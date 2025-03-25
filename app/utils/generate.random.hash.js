const crypto = require('crypto');

module.exports.generateRandomHash = (length) => {
   // Generate random bytes
   const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
   // Convert to hexadecimal string and slice to the desired length
   return randomBytes.toString('hex').slice(0, length);
};
