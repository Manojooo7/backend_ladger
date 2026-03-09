require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ladger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Backedn ladger"
    const text = `Hello ${name},

                Welcome to Ledger!

                Your account has been successfully created and you can now start managing your financial records.

                If you need help, contact our support team.

                Best regards,
                Ledger Team`
    
    const htmlTemplate = `
   <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:40px 0;">
        <tr>
            <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

                <!-- Header -->
                <tr>
                <td style="text-align:center;padding-bottom:20px;">
                    <h1 style="margin:0;color:#1a1a1a;font-size:26px;">
                    Welcome to Ledger 🎉
                    </h1>
                </td>
                </tr>

                <!-- Content -->
                <tr>
                <td style="color:#444;font-size:16px;line-height:1.6;">

                    <p style="margin:0 0 16px 0;">
                    Hello <strong>{{name}}</strong>,
                    </p>

                    <p style="margin:0 0 16px 0;">
                    Your account has been successfully created. You can now start managing your financial records easily and securely with <strong>Ledger</strong>.
                    </p>

                    <p style="margin:0 0 10px 0;"><strong>With Ledger you can:</strong></p>

                    <ul style="padding-left:20px;margin:0 0 20px 0;color:#444;">
                    <li>Track income and expenses</li>
                    <li>Manage accounts and transactions</li>
                    <li>Generate financial reports</li>
                    <li>Organize your financial data</li>
                    </ul>

                </td>
                </tr>

                <!-- Button -->
                <tr>
                <td align="center" style="padding:20px 0;">
                    <a href="{{login_url}}"
                    style="background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;display:inline-block;font-weight:bold;">
                    Go to Dashboard
                    </a>
                </td>
                </tr>

                <!-- Footer text -->
                <tr>
                <td style="color:#666;font-size:14px;line-height:1.6;">
                    <p style="margin:0 0 16px 0;">
                    If you have any questions or need assistance, feel free to contact our support team.
                    </p>

                    <p style="margin:0;">
                    Best regards,<br>
                    <strong>The Ledger Team</strong>
                    </p>
                </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td style="border-top:1px solid #eee;margin-top:20px;padding-top:20px;text-align:center;color:#999;font-size:12px;">
                    © 2026 Ledger. All rights reserved.
                </td>
                </tr>

            </table>

            </td>
        </tr>
        </table>

    </body>
    </html>`

    const html = htmlTemplate.replace("{{name}}", name).replace("{{login_url}}", "https://ledgerapp.com/login");

    await sendEmail(userEmail, subject, text, html)
}

module.exports = {
    sendRegistrationEmail
}