// models/user.js
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { encryptSensitiveData, decryptSensitiveData, FINGERPRINT_KEY } = require('../utils/encrypt.decrypt.data'); // your helpers
// If you already export FINGERPRINT_KEY from constants, import it there.
if (!FINGERPRINT_KEY) {
  throw new Error('Missing DATA_FINGERPRINT_KEY for deterministic fingerprints');
}

// ---------- helpers (encryption envelope + fingerprints) ----------
function isEncryptedEnvelope(str) {
  if (typeof str !== 'string') return false;
  try {
    const o = JSON.parse(str);
    return o && typeof o === 'object' && o.iv && o.content && o.tag;
  } catch {
    return false;
  }
}

function decryptIfNeeded(str) {
  if (!str) return str;                 // null/undefined
  if (!isEncryptedEnvelope(str)) return str;  // legacy plaintext
  return decryptSensitiveData(JSON.parse(str)); // returns original plaintext string
}

function setPossiblyEncrypted(instance, fieldName, val) {
  instance.setDataValue(fieldName, val); // store plaintext for now; hooks will encrypt
}

function encryptFieldIfPlain(instance, fieldName) {
  const current = instance.getDataValue(fieldName);
  if (current == null) return;
  if (isEncryptedEnvelope(current)) return;               // already encrypted
  const env = encryptSensitiveData(String(current));      // {iv, content, tag}
  instance.setDataValue(fieldName, JSON.stringify(env));  // store as JSON string
}

// Normalize + HMAC (deterministic, case-insensitive)
function normEmail(s) {
  return String(s || '').trim().toLowerCase();
}
function normPhone(s) {
  // Keep leading +, strip spaces, dashes, parentheses
  if (s == null) return '';
  const str = String(s).trim();
  const plus = str.startsWith('+');
  const digits = str.replace(/[^\d]/g, '');
  return plus ? `+${digits}` : digits;
}
function hmacHex(input) {
  if (!input) return null;
  return crypto.createHmac('sha256', FINGERPRINT_KEY).update(input).digest('hex');
}

function updateFingerprints(instance) {
  // Use getters to always get plaintext (decryptIfNeeded runs in getters)
  const emailPlain = instance.get('email'); // getter returns plaintext
  const phonePlain = instance.get('phone');

  const emailFp = hmacHex(normEmail(emailPlain));
  const phoneFp = phonePlain ? hmacHex(normPhone(phonePlain)) : null;

  instance.setDataValue('email_fp', emailFp);
  instance.setDataValue('phone_fp', phoneFp);
}

// ---------------------------------------------------------------

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    reference_number: { type: DataTypes.STRING(65), unique: true, allowNull: false, unique: 'uniq_tbl_areax_users_reference_number', },

    // Encrypted-at-rest fields (backward compatible)
    google_user_id: {
      type: DataTypes.STRING(512),
      allowNull: false,
      get() {
        const raw = this.getDataValue('google_user_id');
        return decryptIfNeeded(raw);
      },
      set(v) { setPossiblyEncrypted(this, 'google_user_id', v); }
    },

    email: {
      type: DataTypes.STRING(512),
      allowNull: false,
      get() {
        const raw = this.getDataValue('email');
        return decryptIfNeeded(raw);
      },
      set(v) { setPossiblyEncrypted(this, 'email', v); }
    },

    phone: {
      type: DataTypes.STRING(128),
      allowNull: true,
      get() {
        const raw = this.getDataValue('phone');
        return decryptIfNeeded(raw);
      },
      set(v) { setPossiblyEncrypted(this, 'phone', v); }
    },

    // Deterministic fingerprints (for search/index). Keep these non-PII hashes.
    email_fp: { type: DataTypes.STRING(64), allowNull: true }, // will be filled in hooks
    phone_fp: { type: DataTypes.STRING(64), allowNull: true },

    country_code: { type: DataTypes.STRING(5), allowNull: true },
    username: { type: DataTypes.STRING(255), allowNull: true },
    display_name: { type: DataTypes.STRING(255), allowNull: true },

    profile_picture_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: { isUrl: { msg: 'Invalid URL format.' } }
    },

    caption: { type: DataTypes.TEXT, allowNull: true },

    guardian_picture_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: { isUrl: { msg: 'Invalid URL format.' } }
    },

    wallpaper_picture_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: { isUrl: { msg: 'Invalid URL format.' } }
    },

    tier_reference_number: { type: DataTypes.STRING(65), allowNull: true },
    country: { type: DataTypes.STRING(65), allowNull: true },
    city: { type: DataTypes.STRING(65), allowNull: true },

    lat: { type: DataTypes.DECIMAL(8, 6), allowNull: true }, // -90..90
    lon: { type: DataTypes.DECIMAL(9, 6), allowNull: true }, // -180..180

    time_zone: { type: DataTypes.STRING(75), allowNull: true },

    access_token: DataTypes.STRING(500),
    refresh_token: DataTypes.STRING(500),
    token_expiry: DataTypes.DATE,
    password: DataTypes.STRING(65),
    token_id: DataTypes.STRING(70),
    hashed_token_id: DataTypes.STRING(70),

    privacy_status: {
      type: DataTypes.ENUM('public', 'private', 'anonymous'),
      defaultValue: 'public',
      allowNull: false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },

    email_verified: { type: DataTypes.INTEGER, defaultValue: 0 },
    phone_verified: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_online: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_deleted: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    indexes: [
      {
        name: 'idx_areax_users',
        unique: false,
        fields: [
          'phone', 'country_code', 'email',
          'privacy_status', 'email_verified', 'phone_verified',
          'is_online', 'is_deleted'
        ]
      },
      {
        name: 'uniq_tbl_areax_users_reference_number',
        unique: true,
        fields: ['reference_number'],
      },      	    
      // Fast lookups by fingerprint (search by email/phone)
      { name: 'idx_users_email_fp', fields: ['email_fp'] },
      { name: 'idx_users_phone_fp', fields: ['phone_fp'] },
      { name: 'idx_users_time_zone', fields: ['time_zone'] },
      { name: 'idx_users_lat_lon', fields: ['lat', 'lon'] } // for bbox prefilter
    ],
    timestamps: false,
    tableName: 'tbl_areax_users',

    hooks: {
      beforeValidate(instance) {
        // 1) compute fingerprints (uses getters → plaintext)
        updateFingerprints(instance);
        // 2) encrypt sensitive fields if still plaintext
        encryptFieldIfPlain(instance, 'google_user_id');
        encryptFieldIfPlain(instance, 'email');
        encryptFieldIfPlain(instance, 'phone');
      },
      beforeUpdate(instance) {
        // Only recompute for changed fields
        if (instance.changed('email') || instance.changed('phone')) {
          updateFingerprints(instance);
        }
        if (instance.changed('google_user_id')) encryptFieldIfPlain(instance, 'google_user_id');
        if (instance.changed('email'))         encryptFieldIfPlain(instance, 'email');
        if (instance.changed('phone'))         encryptFieldIfPlain(instance, 'phone');
      }
    }
  });

  return User;
};
