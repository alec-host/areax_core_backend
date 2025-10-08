const { MAILER_USERNAME } = require("../constants/app_constants");
const { generateOtpEmailHtml } = require("./html.email.body");
const date = new Date();
const year = date.getFullYear();
module.exports.nomailerBody = (toEmail,code,defautAction='signup') => {
    const subject = 'Action Required: Your Project W Verification Code';
    const html = generateOtpEmailHtml(code,year);	
    const mailOptions = {
            from: MAILER_USERNAME,
            to: toEmail,
            subject: subject,
            text: `Your OTP code is: ${code}`,
	    html: html
    }
    return mailOptions;
};

