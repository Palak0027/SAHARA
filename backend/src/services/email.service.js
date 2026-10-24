const nodemailer = require('nodemailer');

/**
 * Universal Email Dispatcher for SAHARA
 * - Primary (Cloud/Render): Uses Resend REST API over HTTPS (Port 443), which is never blocked by cloud firewalls.
 * - Fallback (Localhost): Uses Gmail SMTP via Nodemailer when SMTP_HOST, USER, PASS are configured.
 */
async function sendEmail({ to, subject, text, html }) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    // Note: Resend's free tier uses onboarding@resend.dev unless a custom domain is verified
    const fromAddress = process.env.RESEND_FROM || 'SAHARA Support <onboarding@resend.dev>';
    const recipient = Array.isArray(to) ? to : [to];

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipient,
        subject,
        text,
        html
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Resend API responded with status ${response.status}`;
      throw new Error(errorMsg);
    }
    return { success: true, provider: 'resend', id: data.id };
  }

  // Fallback to Nodemailer SMTP (for local dev)
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Email service is not configured. Set RESEND_API_KEY or SMTP credentials.');
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });

  return { success: true, provider: 'smtp', id: info.messageId };
}

module.exports = { sendEmail };
