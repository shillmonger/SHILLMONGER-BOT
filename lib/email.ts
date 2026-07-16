import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, username: string, verificationLink: string) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to XAUUSD BOT</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #ffffff;
          color: #000000;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .card {
          background-color: #000000;
          color: #ffffff;
          padding: 40px;
          border: 3px solid #000000;
        }
        h1 {
          font-size: 32px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -1px;
          margin-bottom: 20px;
          color: #ffffff;
        }
        p {
          font-size: 16px;
          margin-bottom: 20px;
          color: #ffffff;
        }
        .button {
          display: inline-block;
          background-color: #ffffff;
          color: #000000;
          padding: 16px 32px;
          text-decoration: none;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 3px solid #ffffff;
          font-size: 14px;
          margin-top: 20px;
        }
        .button:hover {
          background-color: #e5e5e5;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333333;
          font-size: 12px;
          color: #ffffff;
        }
        .divider {
          height: 3px;
          background-color: #ffffff;
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1>Welcome to XAUUSD BOT</h1>
          <p>Hi ${username},</p>
          <p>Thank you for creating an account with us. We're excited to have you on board!</p>
          <div class="divider"></div>
          <p>To activate your account and start trading, please click the button below to confirm your email address:</p>
          <a href="${verificationLink}" class="button">Confirm Account</a>
          <p style="margin-top: 30px; font-size: 14px; color: #999999;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #999999; word-break: break-all;">${verificationLink}</p>
          <div class="footer">
            <p>This link will expire in 24 hours.</p>
            <p style="margin-top: 10px;">If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirm Your Account - XAUUSD BOT',
    html: emailHtml,
  });
};

export const sendPasswordResetEmail = async (email: string, otp: string) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - XAUUSD BOT</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #ffffff;
          color: #000000;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .card {
          background-color: #000000;
          color: #ffffff;
          padding: 40px;
          border: 3px solid #000000;
        }
        h1 {
          font-size: 32px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -1px;
          margin-bottom: 20px;
          color: #ffffff;
        }
        p {
          font-size: 16px;
          margin-bottom: 20px;
          color: #ffffff;
        }
        .otp {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 8px;
          color: #ffffff;
          margin: 30px 0;
          text-align: center;
        }
        .divider {
          height: 3px;
          background-color: #ffffff;
          margin: 30px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333333;
          font-size: 12px;
          color: #ffffff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1>Password Reset</h1>
          <p>We received a request to reset your password for your XAUUSD BOT account.</p>
          <div class="divider"></div>
          <p>Use the following 4-digit code to reset your password:</p>
          <div class="otp">${otp}</div>
          <p>This code will expire in 5 minutes.</p>
          <div class="footer">
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Code - XAUUSD BOT',
    html: emailHtml,
  });
};
