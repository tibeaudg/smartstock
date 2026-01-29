import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import auth from './utils/auth.js';

const { validateToken, getUserProfile, extractToken } = auth;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeMessage(str, maxLength = 10000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, maxLength);
}

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

    const { chatId, message } = req.body || {};
    if (!chatId || typeof chatId !== 'string' || chatId.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'chatId is required' });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }

    const trimmedMessage = sanitizeMessage(message.trim(), 10000);
    if (trimmedMessage.length === 0) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const { data: chat, error: chatError } = await supabaseAdmin
      .from('chats')
      .select('id, user_id')
      .eq('id', chatId.trim())
      .single();

    if (chatError || !chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', chat.user_id)
      .single();

    if (profileError || !userProfile || !userProfile.email) {
      return res.status(400).json({
        success: false,
        error: 'User email not found for this chat',
      });
    }

    const toEmail = userProfile.email.trim().toLowerCase();
    if (!validateEmail(toEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid recipient email' });
    }

    const { data: smtpRow, error: smtpError } = await supabaseAdmin
      .from('smtp_settings')
      .select('smtp_host, smtp_port, smtp_username, smtp_password, from_email, from_name, use_tls')
      .eq('user_id', user.id)
      .single();

    if (smtpError || !smtpRow || !smtpRow.smtp_host || !smtpRow.smtp_username || !smtpRow.from_email) {
      return res.status(400).json({
        success: false,
        error: 'SMTP not configured. Configure E-mail / SMTP in Admin first.',
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

    const fromName = smtpRow.from_name || 'StockFlow Support';
    const subject = 'Re: StockFlow support';
    const escaped = trimmedMessage
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p style="white-space: pre-wrap; line-height: 1.6;">${escaped}</p>
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">This is a reply from StockFlow support. You can also view and reply in the app.</p>
      </div>
    `;

    await transporter.sendMail({
      from: { name: fromName, address: smtpRow.from_email },
      to: toEmail,
      subject,
      html: htmlBody,
      text: trimmedMessage,
    });

    return res.status(200).json({
      success: true,
      message: 'Reply sent and email sent to user',
    });
  } catch (error) {
    console.error('[send-support-reply-email]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
    });
  }
}
