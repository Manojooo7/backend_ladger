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

/**
 * User Registration Email
 */

async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Backedn ladger"
    const textTemplate = `Hello ${name},

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
                    Hello <strong>${name}</strong>,
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
                    <a href="https://ledgerapp.com/login"
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

    await sendEmail(userEmail, subject, textTemplate, htmlTemplate)
}

/**
 * Transaction Completed Email 
 * Sent only after transaction status is COMPLETED
 */

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  
  const subject= "Transaction Successful"

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:40px 0;">
          <tr>
          <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;">

          <!-- Header -->
          <tr>
            <td style="text-align:center;padding-bottom:20px;">
              <h2 style="margin:0;color:#1a1a1a;">Transaction Successful</h2>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="font-size:16px;color:#444;line-height:1.6;">
              <p style="margin:0 0 16px 0;">
              Hello <strong>${name}</strong>,
              </p>

              <p style="margin:0 0 16px 0;">
              Your transaction has been successfully completed.
              </p>
            </td>
          </tr>

          <!-- Transaction Box -->
          <tr>
          <td>

          <table width="100%" cellpadding="12" cellspacing="0" style="border:1px solid #eee;border-collapse:collapse;font-size:15px;">

            <tr>
            <td style="border:1px solid #eee;background:#fafafa;"><strong>Amount</strong></td>
            <td style="border:1px solid #eee;font-weight:bold;">${amount}</td>
            </tr>

            <tr>
            <td style="border:1px solid #eee;background:#fafafa;"><strong>Transferred To</strong></td>
            <td style="border:1px solid #eee;">${toAccount}</td>
            </tr>

          </table>

        </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:25px;font-size:14px;color:#666;line-height:1.6;">
          If you did not perform this transaction, please contact support immediately.
          <br><br>
          Best regards,<br>
          <strong>Ledger Team</strong>
          </td>
        </tr>

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
    </html>
  `
  const textTemplate = `

    Hello ${name},

    Your transaction has been successfully completed.

    Transaction Details:
    Amount: ${amount}
    Transferred To: ${toAccount}

    If you did not perform this transaction, please contact our support team immediately.

    Best regards,
    Ledger Team
  `
  await sendEmail(userEmail,subject,textTemplate, htmlTemplate)

}

/**
 * Transaction Failed Email
 */
async function sendTransactionFaliourEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed"
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:40px 0;">
          <tr>
            <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;">

              <!-- Header -->
              <tr>
                <td style="text-align:center;padding-bottom:20px;">
                <h2 style="margin:0;color:#dc2626;">Transaction Failed</h2>
              </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="font-size:16px;color:#444;line-height:1.6;">
                  <p style="margin:0 0 16px 0;">
                  Hello <strong>${name}</strong>,
                  </p>

                  <p style="margin:0 0 16px 0;">
                  Unfortunately, we were unable to process your recent transaction.
                  </p>
                </td>
              </tr>

              <!-- Transaction Details -->
              <tr>
                <td>
                  <table width="100%" cellpadding="12" cellspacing="0" style="border:1px solid #eee;border-collapse:collapse;font-size:15px;">

                  <tr>
                    <td style="border:1px solid #eee;background:#fafafa;"><strong>Amount</strong></td>
                    <td style="border:1px solid #eee;font-weight:bold;">${amount}</td>
                  </tr>

                  <tr>
                    <td style="border:1px solid #eee;background:#fafafa;"><strong>Attempted To</strong></td>
                    <td style="border:1px solid #eee;">${toAccount}</td>
                  </tr>

                  </table>

                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding-top:20px;font-size:14px;color:#666;line-height:1.6;">
                  Please check your account details and try again later.

                  <br><br>

                  If you did not attempt this transaction, please contact our support team immediately.

                  <br><br>

                  Best regards,<br>
                  <strong>Ledger Team</strong>
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
    </html>
  `

  const textTemplate = `
    
    Hello ${name},

    We were unable to process your recent transaction.

    Transaction Details:
    Amount: ${amount}
    Attempted To: ${toAccount}

    Please check your account details or try again later.

    If you did not attempt this transaction, contact our support team immediately.

    Best regards,
    Ledger Team `

    await sendEmail(userEmail, subject, textTemplate, htmlTemplate)
}


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFaliourEmail
}