import nodemailer from 'nodemailer';
import { validateSMTPConfig, validateEmailData } from './utils/validation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { smtpConfig, emailData, action } = req.body;
    
    // Handle SMTP connection test (action: 'test')
    if (action === 'test' || !emailData) {
      if (!smtpConfig) {
        return res.status(400).json({ error: 'Missing SMTP configuration' });
      }

      // Security: Validate SMTP config even for testing
      const smtpValidation = validateSMTPConfig(smtpConfig);
      if (!smtpValidation.valid) {
        return res.status(400).json({ 
          error: 'Invalid SMTP configuration',
          details: smtpValidation.errors 
        });
      }

      const validatedSMTP = smtpValidation.data;

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: validatedSMTP.host,
        port: validatedSMTP.port,
        secure: validatedSMTP.useTls && validatedSMTP.port === 465,
        auth: {
          user: validatedSMTP.username,
          pass: validatedSMTP.password,
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
          ...(process.env.NODE_ENV !== 'production' && {
            rejectUnauthorized: false,
            servername: validatedSMTP.host
          })
        }
      });

      // Test connection
      await transporter.verify();

      console.log('SMTP connection test successful');

      return res.status(200).json({
        success: true,
        message: 'SMTP connection test successful'
      });
    }

    // Handle email sending (default action)
    if (!smtpConfig || !emailData) {
      return res.status(400).json({ error: 'Missing required fields: smtpConfig and emailData' });
    }

    // Security: Strict input validation
    const smtpValidation = validateSMTPConfig(smtpConfig);
    if (!smtpValidation.valid) {
      return res.status(400).json({ 
        error: 'Invalid SMTP configuration',
        details: smtpValidation.errors 
      });
    }

    const emailValidation = validateEmailData(emailData);
    if (!emailValidation.valid) {
      return res.status(400).json({ 
        error: 'Invalid email data',
        details: emailValidation.errors 
      });
    }

    const validatedSMTP = smtpValidation.data;
    const validatedEmail = emailValidation.data;

    // Security: Validate SMTP host against allowlist for production
    const allowedSMTPHosts = process.env.ALLOWED_SMTP_HOSTS 
      ? process.env.ALLOWED_SMTP_HOSTS.split(',').map(h => h.trim())
      : [];
    
    // In production, validate SMTP host
    if (process.env.NODE_ENV === 'production' && allowedSMTPHosts.length > 0) {
      if (!allowedSMTPHosts.includes(validatedSMTP.host)) {
        return res.status(400).json({
          success: false,
          error: 'SMTP host not allowed'
        });
      }
    }

    // Create transporter with proper TLS validation
    const transporter = nodemailer.createTransport({
      host: validatedSMTP.host,
      port: validatedSMTP.port,
      secure: validatedSMTP.useTls && validatedSMTP.port === 465, // true for 465, false for other ports
      auth: {
        user: validatedSMTP.username,
        pass: validatedSMTP.password,
      },
      // Security: Enable TLS certificate validation (removed rejectUnauthorized: false)
      // Only allow self-signed certificates in development
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
        // In development, allow self-signed certs but log a warning
        ...(process.env.NODE_ENV !== 'production' && {
          rejectUnauthorized: false,
          // Log warning in development
          servername: validatedSMTP.host
        })
      }
    });

    // Verify connection configuration
    await transporter.verify();

    // Email options using validated data
    const mailOptions = {
      from: {
        name: validatedSMTP.fromName,
        address: validatedSMTP.fromEmail
      },
      to: validatedEmail.to,
      cc: validatedEmail.cc || undefined,
      subject: validatedEmail.subject,
      html: validatedEmail.body,
      attachments: validatedEmail.purchaseOrderId ? [
        {
          filename: `purchase-order-${validatedEmail.purchaseOrderId}.pdf`,
          content: 'Purchase order PDF would be generated here',
          contentType: 'application/pdf'
        }
      ] : []
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
