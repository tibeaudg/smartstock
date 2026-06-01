import nodemailer from 'nodemailer';
import { validateContactForm } from './utils/validation.js';
import { sanitizeEmailText, sanitizeEmailAddress, escapeHtml } from './utils/emailSanitizer.js';

export default async function contactHandler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    // Security: Strict input validation using Zod-like validation
    const validation = validateContactForm(req.body || {});
    if (!validation.valid) {
      res.status(400).json({ 
        ok: false, 
        error: 'Validation failed',
        details: validation.errors 
      });
      return;
    }

    const { name: safeName, email: safeEmail, message: safeMessage, subject: safeSubject } = validation.data;

    // Security: Sanitize all user input before inserting into email templates
    const sanitizedName = escapeHtml(safeName);
    const sanitizedEmail = sanitizeEmailAddress(safeEmail);
    const sanitizedMessage = sanitizeEmailText(safeMessage);
    const sanitizedSubject = safeSubject ? escapeHtml(safeSubject) : '';

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

    if (!smtpHost || !smtpUser || !smtpPass) {
      res.status(500).json({ ok: false, error: 'Email not configured' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    // Format subject line based on inquiry type (already sanitized)
    let emailSubject = `Contact Form: ${sanitizedName}`;
    if (sanitizedSubject) {
      if (sanitizedSubject === 'business-tier') {
        emailSubject = `Business Tier Inquiry from ${sanitizedName}`;
      } else {
        emailSubject = `${sanitizedSubject} - ${sanitizedName}`;
      }
    }

    const info = await transporter.sendMail({
      from: `Stockflow Contact <${smtpUser}>`,
      to: 'info@stockflow.be',
      replyTo: sanitizedEmail,
      subject: emailSubject,
      text: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\n${sanitizedSubject ? `Subject: ${sanitizedSubject}\n` : ''}\n\nMessage:\n${sanitizedMessage.replace(/<br>/g, '\n')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4F46E5; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${sanitizedName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #4F46E5;">${sanitizedEmail}</a></p>
            ${sanitizedSubject ? `<p style="margin: 8px 0;"><strong>Subject:</strong> ${sanitizedSubject}</p>` : ''}
          </div>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #4F46E5;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #4B5563;">${sanitizedMessage}</p>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #9CA3AF; font-size: 12px;">
            <p>This email was sent from the StockFlow contact form</p>
          </div>
        </div>
      `
    });

    res.status(200).json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('[contact] error', err);
    res.status(500).json({ ok: false, error: 'Unexpected error' });
  }
}
