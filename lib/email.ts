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
      <title>Welcome to SHILLMONGER</title>
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
          background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
          color: #ffffff;
          padding: 48px 40px;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.25);
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
          color: #ffffff;
        }
        .tagline {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #a5b4fc;
          margin-bottom: 32px;
        }
        h1 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
          color: #ffffff;
        }
        p {
          font-size: 16px;
          margin-bottom: 16px;
          color: #cbd5e1;
          line-height: 1.7;
        }
        .highlight {
          color: #818cf8;
          font-weight: 600;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          padding: 16px 40px;
          text-decoration: none;
          font-weight: 600;
          border-radius: 12px;
          font-size: 15px;
          margin-top: 24px;
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
          transition: all 0.3s ease;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px -5px rgba(79, 70, 229, 0.5);
        }
        .footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          font-size: 13px;
          color: #94a3b8;
        }
        .link-text {
          color: #818cf8;
          font-size: 12px;
          word-break: break-all;
          margin-top: 16px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">SHILLMONGER</div>
          <div class="tagline">Automated XAUUSD Trading</div>
          <h1>Welcome to the Future of Trading</h1>
          <p>Hi <span class="highlight">${username}</span>,</p>
          <p>Thank you for creating an account with SHILLMONGER. You're about to experience automated XAUUSD trading powered by advanced algorithms.</p>
          <p>To activate your account and start your trading journey, please click the button below to confirm your email address:</p>
          <a href="${verificationLink}" class="button">Confirm Account</a>
          <p class="link-text">Or copy and paste this link into your browser:</p>
          <p class="link-text">${verificationLink}</p>
          <div class="footer">
            <p>This link will expire in 24 hours.</p>
            <p style="margin-top: 12px;">If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirm Your Account - SHILLMONGER',
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
      <title>Password Reset - SHILLMONGER</title>
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
          background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
          color: #ffffff;
          padding: 48px 40px;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.25);
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
          color: #ffffff;
        }
        .tagline {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #a5b4fc;
          margin-bottom: 32px;
        }
        h1 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
          color: #ffffff;
        }
        p {
          font-size: 16px;
          margin-bottom: 16px;
          color: #cbd5e1;
          line-height: 1.7;
        }
        .otp {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 12px;
          color: #818cf8;
          margin: 32px 0;
          text-align: center;
          background: rgba(79, 70, 229, 0.1);
          padding: 24px;
          border-radius: 16px;
          border: 2px solid rgba(129, 140, 248, 0.3);
        }
        .footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          font-size: 13px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">SHILLMONGER</div>
          <div class="tagline">Automated XAUUSD Trading</div>
          <h1>Password Reset</h1>
          <p>We received a request to reset your password for your SHILLMONGER account.</p>
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
    subject: 'Password Reset Code - SHILLMONGER',
    html: emailHtml,
  });
};
