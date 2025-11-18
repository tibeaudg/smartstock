import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const { email, name } = req.body || {};
    if (!email) {
      res.status(400).json({ ok: false, error: 'Email is required' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ ok: false, error: 'Invalid email format' });
      return;
    }

    // Sanitize inputs
    const sanitize = (str) => String(str || '').replace(/[<>]/g, '').trim();
    const safeEmail = sanitize(email).substring(0, 100);
    const safeName = sanitize(name).substring(0, 100) || 'there';

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

    // Create survey link (adjust URL as needed)
    const surveyLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.stockflow.be'}/dashboard`;

    const info = await transporter.sendMail({
      from: `StockFlow Team <${smtpUser}>`,
      to: safeEmail,
      subject: 'We\'d Love Your Feedback - Help Us Improve StockFlow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563EB; margin-bottom: 20px;">Hi ${safeName},</h2>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0; line-height: 1.6; color: #374151;">
              We noticed you haven't had a chance to fully explore StockFlow yet. Your feedback is incredibly valuable to us and helps us understand how we can improve the platform to better meet your needs.
            </p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2563EB; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #374151;">We'd love to hear from you:</h3>
            <ul style="line-height: 1.8; color: #4B5563;">
              <li>What prevented you from getting started?</li>
              <li>What features were you looking for?</li>
              <li>How can we make StockFlow better for you?</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${surveyLink}" 
               style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Share Your Feedback
            </a>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #9CA3AF; font-size: 12px;">
            <p>This email was sent from StockFlow. If you have any questions, please contact us at info@stockflow.be</p>
          </div>
        </div>
      `,
      text: `
Hi ${safeName},

We noticed you haven't had a chance to fully explore StockFlow yet. Your feedback is incredibly valuable to us and helps us understand how we can improve the platform to better meet your needs.

We'd love to hear from you:
- What prevented you from getting started?
- What features were you looking for?
- How can we make StockFlow better for you?

Visit ${surveyLink} to share your feedback.

This email was sent from StockFlow. If you have any questions, please contact us at info@stockflow.be
      `
    });

    res.status(200).json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('[send-churn-survey-email] error:', err);
    res.status(500).json({ ok: false, error: 'Failed to send email. Please try again.' });
  }
}

