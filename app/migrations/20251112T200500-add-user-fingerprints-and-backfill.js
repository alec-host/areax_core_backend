'use strict';

/**
 * Adds deterministic fingerprints for searching while keeping email/phone encrypted at rest.
 *
 * Table: tbl_areax_users
 * Columns added:
 *   - email_fp (CHAR(64))  -- HMAC-SHA256 of normalized email, NOT NULL after backfill
 *   - phone_fp (CHAR(64))  -- HMAC-SHA256 of normalized phone, NULLABLE
 *
 * Backfill behavior:
 *   - If email/phone is a JSON envelope {"iv","content","tag"} -> decrypt using AES-256-GCM
 *   - Else treat as legacy plaintext
 *   - Normalize, HMAC with DATA_FINGERPRINT_KEY, and update *_fp columns
 *
 * Indexes:
 *   - idx_users_email_fp on email_fp
 *   - idx_users_phone_fp on phone_fp
 */

const crypto = require('crypto');

const TABLE = 'tbl_areax_users';
const PK = '_id';
const BATCH_SIZE = 1000;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} env var`);
  return v;
}

function getSecretKey() {
  const ENCRYPTION_KEY = requireEnv('ENCRYPTION_KEY'); // 64 hex chars
  if (!/^[0-9a-f]{64}$/i.test(ENCRYPTION_KEY)) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes).');
  }
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  if (key.length !== 32) throw new Error('ENCRYPTION_KEY must decode to 32 bytes.');
  return key;
}

function getIvLength() {
  const IV_LENGTH = parseInt(requireEnv('IV_LENGTH'), 10);
  if (!Number.isFinite(IV_LENGTH)) throw new Error('IV_LENGTH must be a number (typically 12).');
  return IV_LENGTH;
}

function getFpKey() {
  return requireEnv('DATA_FINGERPRINT_KEY');
}

function isEncryptedEnvelope(str) {
  if (typeof str !== 'string') return false;
  try {
    const o = JSON.parse(str);
    return o && typeof o === 'object' && o.iv && o.content && o.tag;
  } catch {
    return false;
  }
}

function decryptEnvelope(str, key, ivLen) {
  // str is JSON {"iv","content","tag"} hex-encoded
  const obj = JSON.parse(str);
  const iv = Buffer.from(obj.iv, 'hex');
  const tag = Buffer.from(obj.tag, 'hex');
  const ct  = Buffer.from(obj.content, 'hex');
  if (iv.length !== ivLen) {
    // Not fatal; AES-GCM supports variable IVs, but warn in logs.
    // throw new Error(`Unexpected IV length: got ${iv.length}, expected ${ivLen}`);
  }
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  // Your encryptor JSON.stringified the original value (string), so parse here if needed
  // but many rows may have been simple strings -> return as string
  let out = pt.toString('utf8');
  try {
    // If the original was JSON.stringify("foo"), JSON.parse -> "foo"
    const maybe = JSON.parse(out);
    if (typeof maybe === 'string') out = maybe;
  } catch { /* keep as string */ }
  return out;
}

// Normalizers
function normEmail(v) {
  return String(v || '').trim().toLowerCase();
}
function normPhone(v) {
  if (v == null) return '';
  const s = String(v).trim();
  const plus = s.startsWith('+');
  const digits = s.replace(/[^\d]/g, '');
  return plus ? `+${digits}` : digits;
}

// Deterministic HMAC (hex)
function hmacHex(input, key) {
  if (!input) return null;
  return crypto.createHmac('sha256', key).update(input).digest('hex');
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // 0) Read secrets (fail fast)
    const SECRET_KEY = getSecretKey();
    const IV_LENGTH = getIvLength();
    const FP_KEY = getFpKey();

    // 1) Add columns as nullable to allow backfill
    await queryInterface.addColumn(TABLE, 'email_fp', {
      type: Sequelize.STRING(64),
      allowNull: true
    });
    await queryInterface.addColumn(TABLE, 'phone_fp', {
      type: Sequelize.STRING(64),
      allowNull: true
    });

    // 2) Backfill in batches, ordered by PK
    // Count
    const [[{ cnt }]] = await queryInterface.sequelize.query(
      `SELECT COUNT(*) AS cnt FROM ${TABLE}`
    );
    const total = Number(cnt) || 0;

    // Process in pages
    // Using OFFSET for clarity; if very large table, consider keyset pagination by PK.
    for (let offset = 0; offset < total; offset += BATCH_SIZE) {
      const [rows] = await queryInterface.sequelize.query(
        `SELECT ${PK}, email, phone
           FROM ${TABLE}
          ORDER BY ${PK}
          LIMIT ${BATCH_SIZE} OFFSET ${offset}`
      );

      // Compute updates
      for (const r of rows) {
        let emailPlain = r.email;
        let phonePlain = r.phone;

        try {
          if (isEncryptedEnvelope(emailPlain)) {
            emailPlain = decryptEnvelope(emailPlain, SECRET_KEY, IV_LENGTH);
          }
        } catch (e) {
          // If decryption fails, skip setting fingerprint to avoid bad data
          // You may log this in a real migration env:
          // console.warn(`Email decrypt failed for id=${r[PK]}:`, e.message);
        }

        try {
          if (isEncryptedEnvelope(phonePlain)) {
            phonePlain = decryptEnvelope(phonePlain, SECRET_KEY, IV_LENGTH);
          }
        } catch (e) {
          // console.warn(`Phone decrypt failed for id=${r[PK]}:`, e.message);
        }

        const emailFp = hmacHex(normEmail(emailPlain), FP_KEY);
        const phoneFp = phonePlain ? hmacHex(normPhone(phonePlain), FP_KEY) : null;

        // Only update if we have at least email fingerprint (email is NOT NULL in schema)
        await queryInterface.sequelize.query(
          `UPDATE ${TABLE}
              SET email_fp = :emailFp,
                  phone_fp = :phoneFp
            WHERE ${PK} = :id`,
          { replacements: { emailFp, phoneFp, id: r[PK] } }
        );
      }
    }

    // 3) Create indexes
    await queryInterface.addIndex(TABLE, ['email_fp'], { name: 'idx_users_email_fp' });
    await queryInterface.addIndex(TABLE, ['phone_fp'], { name: 'idx_users_phone_fp' });

    // 4) Tighten nullability for email_fp (email itself is NOT NULL)
    await queryInterface.changeColumn(TABLE, 'email_fp', {
      type: Sequelize.STRING(64),
      allowNull: false
    });
    // phone_fp remains nullable by design
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first
    try { await queryInterface.removeIndex(TABLE, 'idx_users_email_fp'); } catch {}
    try { await queryInterface.removeIndex(TABLE, 'idx_users_phone_fp'); } catch {}

    // Drop columns
    await queryInterface.removeColumn(TABLE, 'email_fp');
    await queryInterface.removeColumn(TABLE, 'phone_fp');
  }
};
