import nodemailer from 'nodemailer';
import { validateVisitorChat } from './utils/validation.js';
import { sanitizeEmailText, sanitizeEmailAddress, escapeHtml } from './utils/emailSanitizer.js';

export default async function visitorChatHandler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    // Security: Strict input validation
    const validation = validateVisitorChat(req.body || {});
    if (!validation.valid) {
      res.status(400).json({ 
        ok: false, 
        error: 'Validation failed',
        details: validation.errors 
      });
      return;
    }

    const { email: safeEmail, message: safeMessage } = validation.data;

    // Security: Sanitize all user input before inserting into email templates
    const sanitizedEmail = sanitizeEmailAddress(safeEmail);
    const sanitizedMessage = sanitizeEmailText(safeMessage);

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

    if (!smtpHost || !smtpUser || !smtpPass) {
      res.status(500).json({ ok: false, error: 'Email service not configured' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const info = await transporter.sendMail({
      from: `StockFlow Visitor Chat <${smtpUser}>`,
      to: 'info@stockflow.be',
      replyTo: sanitizedEmail,
      subject: `Visitor Chat Message from ${sanitizedEmail}`,
      text: `Email: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage.replace(/<br>/g, '\n')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563EB; margin-bottom: 20px;">New Visitor Chat Message</h2>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>From:</strong> <a href="mailto:${sanitizedEmail}" style="color: #2563EB;">${sanitizedEmail}</a></p>
          </div>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563EB;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #4B5563;">${sanitizedMessage}</p>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #9CA3AF; font-size: 12px;">
            <p>This email was sent from the StockFlow homepage floating chat widget</p>
          </div>
        </div>
      `
    });

    res.status(200).json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('[visitor-chat] error:', err);
    res.status(500).json({ ok: false, error: 'Failed to send message. Please try again.' });
  }
}

