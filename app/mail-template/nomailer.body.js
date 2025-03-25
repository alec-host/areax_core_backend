const { MAILER_USERNAME } = require("../constants/app_constants");

module.exports.nomailerBody = (toEmail,code) => {
    const mailOptions = {
            from: MAILER_USERNAME,
            to: toEmail,
            subject: 'OTP To Complete Your Signup',
            html: `<html> 
                    <p style="font-size:1em">Hi there,</p>
                    <p style="font-size:1em">Thank you for signing up for Area X. Use the OTP code below to complete your account setup</p>
                    <h1 style="color:orange">${code}</h1>
                    <p style="font-size:1em">Best,</p>
                    <p>The Area X team</p>
                   </html>`
        }
    return mailOptions;
};