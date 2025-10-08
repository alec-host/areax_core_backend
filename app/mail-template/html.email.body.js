const juice = require('juice');

module.exports.generateOtpEmailHtml = (code, year) => {
  const rawHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #8DBF4D;
        color: #ffffff;
        padding: 30px;
        text-align: center;
      }
      .content {
        padding: 30px;
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
      }
      .otp-code {
        font-size: 32px;
        font-weight: bold;
        color: #000000;
        text-align: center;
        background-color: #f1f1f1;
        padding: 15px;
        margin: 20px auto;
        border: 1px dashed #999999;
        border-radius: 4px;
        width: fit-content;
      }
      .footer {
        padding: 20px;
        font-size: 12px;
        color: #888888;
        text-align: center;
        background-color: #f9f9f9;
      }
      .links a {
        color: #888888;
        margin: 0 10px;
        text-decoration: none;
      }
      .copy-instruction {
        text-align: center;
	color: #8DBF4D;
        font-size: 0.875em;	
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verification Required</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>We received a request to verify your identity. Please use the following code to complete your verification process:</p>
        <div class="otp-code">${code}</div>
	<p class="copy-instruction">Copy the code above</p>
        <p><strong>Important:</strong> If you didn’t request this code, you can safely ignore this email.</p>
        <p>Never share this verification code with anyone. Our team will never ask you for it.</p>
      </div>
      <div class="footer">
        <div class="links">
          <a href="#">Help Center</a> |
          <a href="#">Privacy Policy</a> |
          <a href="#">Contact Support</a>
        </div>
        <p>&copy; ${year} Project W Team. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  return juice(rawHtml); // Inlines all CSS for compatibility
};

