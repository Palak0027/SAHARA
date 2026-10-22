const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

function createMailerSafe() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  const port = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

/**
 * Public: Submit a contact message from Home page
 * POST /api/contact
 */
async function submitContactMessage(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Your name is required.'
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty.'
      });
    }

    const contactMsg = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      subject: subject && subject.trim() ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      status: 'unread'
    });

    // Attempt to send email notification (non-blocking)
    try {
      const mailer = createMailerSafe();
      if (mailer) {
        // Send auto-acknowledgement to sender
        await mailer.sendMail({
          from: process.env.MAIL_FROM || process.env.SMTP_USER,
          to: contactMsg.email,
          subject: `We received your message: ${contactMsg.subject}`,
          html: `<div style="font-family:Arial,sans-serif;color:#26343a;max-width:560px;margin:auto;">
            <h2 style="color:#2f5547">Hello ${contactMsg.name},</h2>
            <p>Thank you for reaching out to SAHARA. We have received your inquiry:</p>
            <blockquote style="background:#f4f9f6;border-left:4px solid #2f5547;padding:10px 15px;margin:15px 0;">
              <strong>Subject:</strong> ${contactMsg.subject}<br/><br/>
              ${contactMsg.message}
            </blockquote>
            <p>Our team will review your message and get back to you shortly.</p>
            <p style="color:#71818a;font-size:12px;">— SAHARA Community Support</p>
          </div>`
        });
      }
    } catch (mailErr) {
      // Don't fail the API if email fails
      console.warn('Contact auto-reply email skipped or failed:', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent to the SAHARA admin team.',
      data: {
        id: contactMsg._id,
        name: contactMsg.name,
        subject: contactMsg.subject,
        createdAt: contactMsg.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Get all contact messages
 * GET /api/contact
 */
async function getContactMessages(req, res, next) {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    const query = {};

    if (status && ['unread', 'read', 'resolved'].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex }
      ];
    }

    const total = await ContactMessage.countDocuments(query);
    const unreadCount = await ContactMessage.countDocuments({ status: 'unread' });

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      unreadCount,
      page: Number(page),
      messages
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Update contact message status & admin notes
 * PATCH /api/contact/:id
 */
async function updateContactStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updateFields = {};
    if (status && ['unread', 'read', 'resolved'].includes(status)) {
      updateFields.status = status;
    }
    if (typeof adminNotes === 'string') {
      updateFields.adminNotes = adminNotes;
    }

    const message = await ContactMessage.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message status updated successfully.',
      data: message
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Delete contact message
 * DELETE /api/contact/:id
 */
async function deleteContactMessage(req, res, next) {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage
};
