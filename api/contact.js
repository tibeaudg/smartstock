const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: 'Missing fields' });
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

    const info = await transporter.sendMail({
      from: `Stockflow Contact <${smtpUser}>`,
      to: 'info@stockflow.be',
      replyTo: email,
      subject: `Nieuw bericht van ${name}`,
      text: message,
      html: `<p><strong>Naam:</strong> ${name}</p><p><strong>E-mail:</strong> ${email}</p><p>${message.replace(/\n/g, '<br/>')}</p>`
    });

    res.status(200).json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('[contact] error', err);
    res.status(500).json({ ok: false, error: 'Unexpected error' });
  }
};


