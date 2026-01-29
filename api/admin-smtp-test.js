import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import auth from './utils/auth.js';
import validation from './utils/validation.js';

const { validateToken, getUserProfile, extractToken } = auth;
const { validateEmail } = validation;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const user = await validateToken(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    const profile = await getUserProfile(user.id);
    if (!profile) {
      return res.status(403).json({ success: false, error: 'User profile not found' });
    }

    const isAdmin = profile.role === 'admin' || profile.is_owner === true;
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { action, toEmail } = req.body || {};
    if (!action || (action !== 'test' && action !== 'send-test')) {
      return res.status(400).json({ success: false, error: 'action must be "test" or "send-test"' });
    }

    if (action === 'send-test' && (!toEmail || typeof toEmail !== 'string' || !validateEmail(toEmail.trim()))) {
      return res.status(400).json({ success: false, error: 'Valid toEmail is required for send-test' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const { data: smtpRow, error: smtpError } = await supabaseAdmin
      .from('smtp_settings')
      .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
      .eq('user_id', user.id)
      .single();

    if (smtpError || !smtpRow || !smtpRow.smtp_host || !smtpRow.smtp_username || !smtpRow.from_email) {
      return res.status(400).json({
        success: false,
        error: 'SMTP not configured. Save your SMTP settings first.',
      });
    }

    if (!smtpRow.smtp_password || String(smtpRow.smtp_password).trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'SMTP password not set. Enter and save your password in Admin SMTP settings.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpRow.smtp_host,
      port: Number(smtpRow.smtp_port) || 587,
      secure: smtpRow.use_tls && Number(smtpRow.smtp_port) === 465,
      auth: {
        user: smtpRow.smtp_username,
        pass: smtpRow.smtp_password || undefined,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
        ...(process.env.NODE_ENV !== 'production' && {
          rejectUnauthorized: false,
          servername: smtpRow.smtp_host,
        }),
      },
    });

    await transporter.verify();

    if (action === 'test') {
      return res.status(200).json({ success: true, message: 'SMTP connection test successful' });
    }

    const to = toEmail.trim().toLowerCase();
    const fromName = smtpRow.from_name || 'StockFlow';
    await transporter.sendMail({
      from: { name: fromName, address: smtpRow.from_email },
      to,
      subject: 'StockFlow – test e-mail',
      text: 'This is a test email from your StockFlow SMTP configuration.',
      html: '<p>This is a test email from your StockFlow SMTP configuration.</p>',
    });

    return res.status(200).json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('[admin-smtp-test]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to test SMTP or send test email',
    });
  }
}
