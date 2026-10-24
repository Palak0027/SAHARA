const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendEmail } = require('../services/email.service');

const GENERIC_MESSAGE = 'If an account exists for that email, a password reset link has been sent.';

async function forgotPassword(req, res, next) {
  try {
    const email = typeof req.body.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 1. Check if user is registered in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please check your email or register.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact SAHARA support.'
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    let frontendUrl = (process.env.FRONTEND_URL || '').trim();
    if (!frontendUrl || frontendUrl === '*' || !frontendUrl.startsWith('http')) {
      const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
      if (origin && origin.startsWith('http') && !origin.includes('*')) {
        frontendUrl = origin;
      } else {
        frontendUrl = 'https://sahara-woad.vercel.app';
      }
    }
    frontendUrl = frontendUrl.replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset your SAHARA password',
        text: `Hello ${user.name},\n\nWe received a request to reset your SAHARA password. Open this link within 15 minutes:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.\n\nSAHARA Support`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#26332f;line-height:1.6"><h2 style="color:#2f5547">Reset your SAHARA password</h2><p>Hello ${escapeHtml(user.name)},</p><p>We received a request to reset your SAHARA password. Click the link below within <strong>15 minutes</strong> to set a new password:</p><p style="margin:20px 0"><a href="${resetUrl}" style="display:inline-block;background:#2f5547;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a></p><p style="font-size:13px;color:#64748b">If the button does not work, copy and paste this URL into your browser:</p><p style="font-size:13px;color:#087f8c;word-break:break-all">${resetUrl}</p><p style="font-size:13px;color:#64748b;margin-top:20px">If you did not request this, you can safely ignore this email.</p><p style="font-size:13px;color:#64748b">— SAHARA Support</p></div>`
      });
    } catch (mailError) {
      console.error('[PasswordReset Controller] Failed to dispatch reset email:', mailError.message || mailError);
      // Clean up token if email failed
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      return res.status(500).json({
        success: false,
        message: `Failed to send password reset email: ${mailError.message || 'Please try again later'}.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `A password reset link has been sent to ${user.email}. Please check your inbox (and spam folder).`
    });
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

/**
 * Check if a user with given 10-digit phone number exists
 */
async function checkPhone(req, res, next) {
  try {
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.'
      });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'No registered active account found with this mobile number.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Account verified.',
      name: user.name,
      phone: user.phone
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset password via Phone OTP verification
 */
async function resetPasswordWithPhone(req, res, next) {
  try {
    const { phone, password } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(String(phone).trim())) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit mobile number is required.'
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const user = await User.findOne({ phone: String(phone).trim() });
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User account not found or is currently inactive.'
      });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  forgotPassword,
  resetPassword,
  checkPhone,
  resetPasswordWithPhone
};

