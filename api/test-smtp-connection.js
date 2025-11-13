import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { smtpConfig } = req.body;

    if (!smtpConfig) {
      return res.status(400).json({ error: 'Missing SMTP configuration' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.useTls && smtpConfig.port === 465, // true for 465, false for other ports
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();

    console.log('SMTP connection test successful');

    return res.status(200).json({
      success: true,
      message: 'SMTP connection test successful'
    });

  } catch (error) {
    console.error('SMTP connection test failed:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'SMTP connection test failed'
    });
  }
}
