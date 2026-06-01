import nodemailer from 'nodemailer';
import { requireAuth } from './utils/auth.js';
import { escapeHtml, sanitizeEmailText } from './utils/emailSanitizer.js';

const STAR_LABELS = { 1: 'Very Poor', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Excellent' };

export default async function sendFeedbackEmailHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Validate auth
  await new Promise((resolve) => requireAuth(req, res, resolve));
  if (res.headersSent) return;

  const { rating, message } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ ok: false, error: 'Message too long (max 1000 chars)' });
  }
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    return res.status(400).json({ ok: false, error: 'Rating must be between 1 and 5' });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

  if (!smtpHost || !smtpUser || !smtpPass) {
    return res.status(500).json({ ok: false, error: 'Email not configured' });
  }

  const userEmail = escapeHtml(req.user?.email || 'unknown');
  const safeName = escapeHtml(req.userProfile?.first_name || req.userProfile?.email || 'unknown');
  const safeMessage = sanitizeEmailText(message.trim());
  const ratingLabel = rating ? `${rating}/5 — ${STAR_LABELS[rating]}` : 'Not provided';
  const ratingStars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '—';

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `StockFlow Feedback <${smtpUser}>`,
      to: 'info@stockflow.be',
      replyTo: req.user?.email,
      subject: `New User Feedback from ${safeName}`,
      text: `User: ${safeName} <${userEmail}>\nRating: ${ratingLabel}\n\nFeedback:\n${message.trim()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#4F46E5;margin-bottom:20px;">💬 New User Feedback</h2>
          <div style="background:#f9fafb;padding:15px;border-radius:6px;margin-bottom:20px;">
            <p style="margin:8px 0;"><strong>User:</strong> ${safeName}</p>
            <p style="margin:8px 0;"><strong>Email:</strong> <a href="mailto:${userEmail}" style="color:#4F46E5;">${userEmail}</a></p>
            <p style="margin:8px 0;"><strong>Rating:</strong> <span style="font-size:18px;letter-spacing:2px;">${ratingStars}</span> ${ratingLabel}</p>
          </div>
          <div style="background:#fff;padding:15px;border-left:4px solid #4F46E5;">
            <h3 style="margin-top:0;color:#374151;">Feedback:</h3>
            <p style="white-space:pre-wrap;line-height:1.6;color:#4B5563;">${safeMessage}</p>
          </div>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e0e0e0;text-align:center;color:#9CA3AF;font-size:12px;">
            <p>Sent via the StockFlow in-app feedback widget</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[send-feedback-email] error', err);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
}
