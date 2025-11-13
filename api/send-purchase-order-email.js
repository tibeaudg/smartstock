import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { smtpConfig, emailData } = req.body;

    if (!smtpConfig || !emailData) {
      return res.status(400).json({ error: 'Missing required parameters' });
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

    // Verify connection configuration
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: {
        name: smtpConfig.fromName || 'StockFlow',
        address: smtpConfig.fromEmail
      },
      to: emailData.to,
      cc: emailData.cc || undefined,
      subject: emailData.subject,
      html: emailData.body,
      attachments: [
        {
          filename: `purchase-order-${emailData.purchaseOrderId}.pdf`,
          content: 'Purchase order PDF would be generated here',
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
}
