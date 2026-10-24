import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Sahara-Secret'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { to, subject, text, html, secret } = req.body || {};

  const expectedSecret = process.env.EMAIL_RELAY_SECRET || 'sahara_relay_secret_2026';
  const providedSecret = req.headers['x-sahara-secret'] || secret;

  if (providedSecret !== expectedSecret) {
    return res.status(401).json({ success: false, message: 'Unauthorized relay request' });
  }

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ success: false, message: 'Missing parameters: to, subject, or content' });
  }

  const user = process.env.SMTP_USER || 'shrivastavpalak495@gmail.com';
  const pass = process.env.SMTP_PASS || 'yjzqvgggvtrmnybt';

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `"SAHARA Support" <${user}>`,
      to,
      subject,
      text,
      html
    });

    console.log('[VercelNodemailerRelay] Email dispatched successfully to:', to, 'ID:', info.messageId);
    return res.status(200).json({
      success: true,
      provider: 'nodemailer-vercel',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('[VercelNodemailerRelay] Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to dispatch email via Nodemailer'
    });
  }
}
