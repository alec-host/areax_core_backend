const nomailer = require("nodemailer");

const { MAILER_USERNAME, MAILER_PASSWORD } = require("../constants/app_constants");
const { nomailerBody } = require("../mail-template/nomailer.body");

module.exports.sendEmailOtp = async(toEmail,code) => {
    let transporter = nomailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: MAILER_USERNAME,
            pass: MAILER_PASSWORD
        }  
    });

    try{
        await transporter.sendMail(nomailerBody(toEmail,code));

        return [true,'An OTP has been sent to your email address.',code];
    }catch(e){
        console.error(e);
        return [false,'We are currently unable to send the email. Please try again later.'];
    }
};
