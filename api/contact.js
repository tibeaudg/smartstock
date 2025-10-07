const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const { name, email, message, subject } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: 'Missing fields' });
      return;
    }

    // Input validation and sanitization
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ ok: false, error: 'Invalid email format' });
      return;
    }

    // Sanitize inputs to prevent injection attacks
    const sanitize = (str) => String(str).replace(/[<>]/g, '').trim();
    const safeName = sanitize(name).substring(0, 100);
    const safeEmail = sanitize(email).substring(0, 100);
    const safeMessage = sanitize(message).substring(0, 5000);
    const safeSubject = subject ? sanitize(subject).substring(0, 200) : '';

    // Additional validation
    if (safeName.length < 2 || safeMessage.length < 10) {
      res.status(400).json({ ok: false, error: 'Name must be at least 2 characters and message at least 10 characters' });
      return;
    }

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

    // Format subject line based on inquiry type
    let emailSubject = `Contact Form: ${safeName}`;
    if (safeSubject) {
      if (safeSubject === 'business-tier') {
        emailSubject = `Business Tier Inquiry from ${safeName}`;
      } else {
        emailSubject = `${safeSubject} - ${safeName}`;
      }
    }

    const info = await transporter.sendMail({
      from: `Stockflow Contact <${smtpUser}>`,
      to: 'info@stockflow.be',
      replyTo: safeEmail,
      subject: emailSubject,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n${safeSubject ? `Subject: ${safeSubject}\n` : ''}\n\nMessage:\n${safeMessage}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4F46E5; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #4F46E5;">${safeEmail}</a></p>
            ${safeSubject ? `<p style="margin: 8px 0;"><strong>Subject:</strong> ${safeSubject}</p>` : ''}
          </div>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #4F46E5;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #4B5563;">${safeMessage}</p>
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
};


