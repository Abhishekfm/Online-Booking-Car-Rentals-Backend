const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD
  }
});

exports.sendOtp = async (email, code) => {
  console.log(email);
  console.log(code);
  console.log(`env Email ${process.env.MY_EMAIL}`);
  console.log(`env Email Password ${process.env.MY_EMAIL_PASSWORD}`);
  const mailOptions = {
    from: `"My Rental"<process.env.MY_EMAIL>`,
    to: email,
    subject: 'OTP for Booking',
    html:`<html>
    <head>
      <style>
        .container {
          width: 500px;
          margin: auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        .title {
          font-size: 2em;
          color: #444444;
        }
        .otp {
          font-size: 3em;
          color: #0077c9;
        }
        .message {
          font-size: 1.5em;
          color: #666666;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">OTP Verification</div>
        <div class="otp">${code}</div>
        <div class="message">This is your one-time password. Give This OTP to our Dilvery Agent. When you recieve your Booked Car.</div>
      </div>
    </body>
  </html>
  `
    // text: `Your OTP is ${code}. It expires in 5 minutes.`
  };
  const res = await transporter.sendMail(mailOptions);
  console.log(res);
  return res
};
