const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const GENERIC_MESSAGE = 'If an account exists for that email, a password reset link has been sent.';

function createMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.');
  }

  const port = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

async function forgotPassword(req, res, next) {
  try {
    const email = typeof req.body.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';

    // Keep the response generic to avoid exposing which emails have accounts.
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(200).json({ success: true, message: GENERIC_MESSAGE });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(200).json({ success: true, message: GENERIC_MESSAGE });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    try {
      const mailer = createMailer();
      await mailer.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: 'Reset your SAHARA password',
        text: `Hello ${user.name},\n\nWe received a request to reset your SAHARA password. Open this link within 15 minutes:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.\n\nSAHARA Support`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#26332f"><h2 style="color:#2f5547">Reset your SAHARA password</h2><p>Hello ${escapeHtml(user.name)},</p><p>We received a request to reset your password. This link expires in <strong>15 minutes</strong>.</p><p><a href="${resetUrl}" style="display:inline-block;background:#2f5547;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Reset password</a></p><p>If the button does not work, copy this link into your browser:</p><p>${resetUrl}</p><p>If you did not request this, you can safely ignore this email.</p><p>— SAHARA Support</p></div>`
      });
    } catch (mailError) {
      // Do not leave a valid reset token behind if delivery failed.
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return next(mailError);
    }

    return res.status(200).json({ success: true, message: GENERIC_MESSAGE });
  } catch (error) {
    next(error);
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    if (typeof token !== 'string' || !token || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'A valid reset token and a password of at least 6 characters are required.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'This password reset link is invalid or has expired. Please request a new one.' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Your password has been reset successfully. You can now log in with your new password.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { forgotPassword, resetPassword };
