const nodemailer = require('nodemailer');

/**
 * Universal Email Dispatcher for SAHARA
 * - Primary: Gmail SMTP (or configured SMTP) via Nodemailer.
 *   Sends emails to ANY recipient email address in the world without sandbox limits.
 * - Fallback / Secondary: Resend REST API (over HTTPS Port 443).
 */
async function sendEmail({ to, subject, text, html }) {
  const errors = [];

  // Helper 1: Try SMTP (e.g. Gmail SMTP)
  const trySmtp = async () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error('SMTP credentials (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) not configured');
    }

    const port = Number(SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const fromAddress = process.env.MAIL_FROM || `"SAHARA Support" <${SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html
    });

    return { success: true, provider: 'smtp', id: info.messageId };
  };

  // Helper 2: Try Resend REST API
  const tryResend = async () => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

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
      const errorMsg = data?.message || data?.error || `Resend API returned status ${response.status}`;
      throw new Error(errorMsg);
    }

    return { success: true, provider: 'resend', id: data.id };
  };

  // Prioritize SMTP first because Gmail SMTP can deliver to ALL emails (no sandbox domain restrictions)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      return await trySmtp();
    } catch (smtpErr) {
      console.warn('[EmailService] SMTP attempt failed:', smtpErr.message, 'Trying Resend API as fallback...');
      errors.push(`SMTP: ${smtpErr.message}`);

      if (process.env.RESEND_API_KEY) {
        try {
          return await tryResend();
        } catch (resendErr) {
          console.error('[EmailService] Resend fallback failed:', resendErr.message);
          errors.push(`Resend: ${resendErr.message}`);
        }
      }
    }
  } else if (process.env.RESEND_API_KEY) {
    try {
      return await tryResend();
    } catch (resendErr) {
      console.error('[EmailService] Resend API attempt failed:', resendErr.message);
      errors.push(`Resend: ${resendErr.message}`);
    }
  }

  throw new Error(`Email delivery failed. ${errors.join(' | ')}`);
}

module.exports = { sendEmail };
