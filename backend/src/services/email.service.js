const nodemailer = require('nodemailer');

/**
 * Universal Email Dispatcher for SAHARA
 * - Primary: Gmail SMTP (or configured SMTP) via Nodemailer.
 *   Sends emails to ANY recipient email address in the world without sandbox limits.
 * - Fallback / Secondary: Resend REST API (over HTTPS Port 443).
 */
async function sendEmail({ to, subject, text, html }) {
  const errors = [];

  // Helper 1: Try Vercel Serverless Relay (runs Nodemailer on Vercel where ports 465/587 are NOT blocked)
  const tryVercelNodemailerRelay = async () => {
    const candidateUrls = [
      process.env.VERCEL_RELAY_URL,
      process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}/api/send-email` : null,
      'https://sahara-1m64cwpv1-palak-5539.vercel.app/api/send-email',
      'https://sahara-woad.vercel.app/api/send-email'
    ].filter(Boolean);

    // Remove duplicates
    const uniqueUrls = [...new Set(candidateUrls)];
    let lastError = null;

    for (const url of uniqueUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-sahara-secret': process.env.EMAIL_RELAY_SECRET || 'sahara_relay_secret_2026'
          },
          body: JSON.stringify({
            to,
            subject,
            text,
            html,
            secret: process.env.EMAIL_RELAY_SECRET || 'sahara_relay_secret_2026'
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json().catch(() => ({}));
        if (response.ok && data.success) {
          console.log(`[EmailService] Nodemailer email sent successfully via Vercel relay (${url})`);
          return { success: true, provider: 'nodemailer-vercel', id: data.messageId };
        } else {
          lastError = new Error(data.message || `Relay returned status ${response.status}`);
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('All Vercel relay endpoints failed');
  };

  // Helper 2: Try Direct Nodemailer SMTP (Works on localhost; fast 4s timeout on Render)
  const trySmtp = async () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error('SMTP credentials (SMTP_USER, SMTP_PASS) not configured');
    }

    const port = Number(SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      connectionTimeout: 4000, // 4s fast timeout so Render doesn't hang
      greetingTimeout: 4000,
      socketTimeout: 6000,
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

  // Helper 3: Try Resend REST API (HTTPS Port 443 - Sandbox delivers to owner)
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

  // 1. If running in production on Render (or if Vercel URL is available), try Vercel Nodemailer Relay
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    try {
      return await tryVercelNodemailerRelay();
    } catch (relayErr) {
      console.warn('[EmailService] Vercel relay attempt failed:', relayErr.message, 'Trying direct SMTP...');
      errors.push(`VercelRelay: ${relayErr.message}`);
    }
  }

  // 2. Try Direct Nodemailer SMTP (Default for localhost or servers without port blocks)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      return await trySmtp();
    } catch (smtpErr) {
      console.warn('[EmailService] Direct SMTP attempt failed:', smtpErr.message);
      errors.push(`SMTP: ${smtpErr.message}`);

      // If we are in local dev and direct SMTP failed, try Vercel relay as well
      if (process.env.NODE_ENV !== 'production') {
        try {
          return await tryVercelNodemailerRelay();
        } catch (relayErr) {
          errors.push(`VercelRelay: ${relayErr.message}`);
        }
      }
    }
  }

  // 3. Fallback: Try Resend REST API
  if (process.env.RESEND_API_KEY) {
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
