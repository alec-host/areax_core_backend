const nomailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');

const { MAILER_USERNAME, MAILER_PASSWORD, SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } = require("../constants/app_constants");
//const { nomailerBody } = require("../mail-template/nomailer.body");
const { nomailerBody } = require("../mail-template/nomailer.enhanced.body");

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


sgMail.setApiKey(SENDGRID_API_KEY); // Store securely in .env

module.exports.sendGridEmailOtp = async (toEmail, code) => {
  /*	
  const msg = {
    to: toEmail,
    from: SENDGRID_SENDER_EMAIL, // Must be a verified sender
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${code}`,
    html: `<p>Your OTP code is: <strong>${code}</strong></p>`
  };
  */
  try {
    await sgMail.send(nomailerBody(toEmail,code));
    return [true, 'An OTP has been sent to your email address.', code];
  } catch (e) {
    console.error('SendGrid error:', e.response?.body || e.message);
    return [false, 'We are currently unable to send the email. Please try again later.'];
  }
};
