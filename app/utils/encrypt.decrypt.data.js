const crypto = require('crypto'); 

const { ENCRYPTION_KEY, IV_LENGTH, FINGERPRINT_KEY } = require("../constants/app_constants"); 
//console.log(ENCRYPTION_KEY, IV_LENGTH, FINGERPRINT_KEY); 
const SECRET_KEY = Buffer.from(ENCRYPTION_KEY, 'hex');
 
//-.validation.
if (!/^[0-9a-f]{64}$/i.test(ENCRYPTION_KEY)) {
  throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes).');
}
if (SECRET_KEY.length !== 32) throw new Error('SECRET_KEY must be 32 bytes.');
if (Number(IV_LENGTH) !== 12) console.warn('AES-GCM works best with a 12-byte IV.');

function encryptSensitiveData(data) {
  const initVector = crypto.randomBytes(Number(IV_LENGTH));
  const cipher = crypto.createCipheriv('aes-256-gcm', SECRET_KEY, initVector);

  const plaintext = Buffer.from(JSON.stringify(data), 'utf8');
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    iv: initVector.toString('hex'),
    content: encrypted.toString('hex'),
    tag: authTag.toString('hex'),
  };
}

function decryptSensitiveData(encrypted) {
  try{
     const initVector = Buffer.from(encrypted.iv, 'hex');
     const tag = Buffer.from(encrypted.tag, 'hex');
     const decipher = crypto.createDecipheriv('aes-256-gcm', SECRET_KEY, initVector);
     decipher.setAuthTag(tag);

     const decrypted = Buffer.concat([
       decipher.update(Buffer.from(encrypted.content, 'hex')),
       decipher.final(),
     ]);
     return JSON.parse(decrypted.toString('utf8'));
  }catch{
     throw new Error('Decryption & authentication has failed.');
  }
}

module.exports = { encryptSensitiveData, decryptSensitiveData, FINGERPRINT_KEY };
