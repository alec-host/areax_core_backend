const { MAILER_USERNAME } = require("../constants/app_constants");

module.exports.nomailerBody = (toEmail,code,defautAction='signup') => {
    const subject = 'Action Required: Your Project W Verification Code';
    const mailOptions = {
            from: MAILER_USERNAME,
            to: toEmail,
            subject: subject,
	    text: `Your OTP code is: ${code}`,
            html: `<!DOCTYPE html>
	           <html lang="en">
		     <head>
		       <meta charset="UTF-8" />
		       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		       <title>OTP Verification</title>
		       <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
		       <style>
                         body {
                           font-family: 'Roboto', sans-serif;
                           background-color: #f9f9f9;
                           margin: 0;
                           padding: 0;
                         }
	               </style>		
                     </head>
		     <body>
                       <p style="font-size:1em">Hi there,</p>
                       <p style="font-size:1em">Please use the one-time code below to proceed with your request.</p>
                       <h1 style="color:#BCE879">${code}</h1>
		       <p style="font-size:1em">If you did not initiate this request, you can safely ignore this message.</p>
                       <p style="font-size:1em">Best,</p>
                       <p>The Project W team</p>
		     </body>
                   </html>`
        }
    return mailOptions;
};
