const dns = require('dns');
const validator = require('validator');

module.exports.validateEmail = (email) => {
  return new Promise((resolve,reject) => {
    if(!validator.isEmail(email)) {
      return resolve(false);
    }
    const domain = email.split('@')[1];
    dns.resolveMx(domain, (err, addresses) => {
      if(err) {
        console.error(err);
        return resolve(false);
      }
      if(addresses && addresses.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};