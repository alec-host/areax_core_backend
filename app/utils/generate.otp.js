const optGenerator = require("otp-generator");

module.exports.generateRandomOtp = () => {
    const code = optGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false, digits: true});
    return code;
};