import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function getSmtpConfig() {
  const smtp_host = Deno.env.get('SMTP_host') ?? ''
  const smtp_port = Number(Deno.env.get('SMTP_port')) || 587
  const smtp_username = Deno.env.get('username') ?? ''
  const smtp_password = Deno.env.get('SMTP_password') ?? ''
  const from_name = Deno.env.get('From_name') || 'StockFlow'
  return {
    smtp_host,
    smtp_port,
    smtp_username,
    smtp_password,
    from_email: smtp_username,
    from_name,
    use_tls: smtp_port === 465,
  }
}

function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

function sanitizeMessage(str: string, maxLength = 10000): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, maxLength)
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser(token)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: profile } = await userClient
      .from('profiles')
      .select('role, is_owner')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.is_owner === true
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { chatId, message } = body

    if (!chatId || typeof chatId !== 'string' || !chatId.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'chatId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const trimmedMessage = sanitizeMessage(message.trim(), 10000)
    if (!trimmedMessage) {
      return new Response(
        JSON.stringify({ success: false, error: 'message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: chat, error: chatError } = await adminClient
      .from('chats')
      .select('id, user_id')
      .eq('id', chatId.trim())
      .single()

    if (chatError || !chat) {
      return new Response(
        JSON.stringify({ success: false, error: 'Chat not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: userProfile, error: profileError } = await adminClient
      .from('profiles')
      .select('email')
      .eq('id', chat.user_id)
      .single()

    if (profileError || !userProfile?.email) {
      return new Response(
        JSON.stringify({ success: false, error: 'User email not found for this chat' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const toEmail = userProfile.email.trim().toLowerCase()
    if (!validateEmail(toEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid recipient email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const smtpRow = getSmtpConfig()

    if (!smtpRow.smtp_host || !smtpRow.smtp_username || !smtpRow.smtp_password) {
      return new Response(
        JSON.stringify({ success: false, error: 'SMTP not configured. Set SMTP_host, username, SMTP_port, SMTP_password, and From_name in Supabase secrets.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const port = Number(smtpRow.smtp_port) || 587
    const secure = smtpRow.use_tls && port === 465

    const transporter = nodemailer.createTransport({
      host: smtpRow.smtp_host,
      port,
      secure,
      auth: {
        user: smtpRow.smtp_username,
        pass: smtpRow.smtp_password || undefined,
      },
      tls: {
        rejectUnauthorized: Deno.env.get('DENO_ENV') === 'production',
        ...(Deno.env.get('DENO_ENV') !== 'production' && {
          rejectUnauthorized: false,
          servername: smtpRow.smtp_host,
        }),
      },
    })

    // Fetch all chat messages for this chat
    const { data: chatMessages, error: messagesError } = await adminClient
      .from('chat_messages')
      .select('id, message, sender_type, sender_id, created_at')
      .eq('chat_id', chatId.trim())
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('[send-support-reply-email] Error fetching chat messages:', messagesError)
    }

    // Get admin profile name for display
    const { data: adminProfile } = await adminClient
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    const adminName = adminProfile 
      ? `${adminProfile.first_name || ''} ${adminProfile.last_name || ''}`.trim() || 'Support Team'
      : 'Support Team'

    // Get user profile name for display
    const { data: userProfileFull } = await adminClient
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', chat.user_id)
      .single()

    const userName = userProfileFull
      ? `${userProfileFull.first_name || ''} ${userProfileFull.last_name || ''}`.trim() || 'You'
      : 'You'

    const fromName = smtpRow.from_name || 'StockFlow Support'
    const subject = 'Re: StockFlow support'
    
    // Format chat history
    let chatHistoryHtml = ''
    if (chatMessages && chatMessages.length > 0) {
      chatHistoryHtml = '<div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">'
      chatHistoryHtml += '<h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px;">Chat History:</h3>'
      
      chatMessages.forEach((msg: any) => {
        const isAdmin = msg.sender_type === 'admin'
        const senderName = isAdmin ? adminName : userName
        const senderColor = isAdmin ? '#3b82f6' : '#6b7280'
        const bgColor = isAdmin ? '#eff6ff' : '#f9fafb'
        const align = isAdmin ? 'right' : 'left'
        
        const messageText = msg.message
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/\n/g, '<br>')
        
        const date = new Date(msg.created_at)
        const formattedDate = date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })
        
        chatHistoryHtml += `
          <div style="margin-bottom: 16px; text-align: ${align};">
            <div style="display: inline-block; max-width: 80%; background-color: ${bgColor}; padding: 12px; border-radius: 8px; text-align: left;">
              <div style="font-size: 12px; font-weight: 600; color: ${senderColor}; margin-bottom: 4px;">${senderName}</div>
              <div style="white-space: pre-wrap; line-height: 1.6; color: #1f2937;">${messageText}</div>
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">${formattedDate}</div>
            </div>
          </div>
        `
      })
      
      chatHistoryHtml += '</div>'
    }

    const escaped = trimmedMessage
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>')
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #eff6ff; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: 600; color: #3b82f6; margin-bottom: 4px;">${adminName}</div>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #1f2937; margin: 0;">${escaped}</p>
        </div>
        ${chatHistoryHtml}
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">This is a reply from StockFlow support. You can also view and reply in the app.</p>
      </div>
    `
    
    // Create plain text version with chat history
    let textBody = trimmedMessage + '\n\n'
    if (chatMessages && chatMessages.length > 0) {
      textBody += '--- Chat History ---\n\n'
      chatMessages.forEach((msg: any) => {
        const senderName = msg.sender_type === 'admin' ? adminName : userName
        const date = new Date(msg.created_at)
        const formattedDate = date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })
        textBody += `${senderName} (${formattedDate}):\n${msg.message}\n\n`
      })
    }
    textBody += '\n---\nThis is a reply from StockFlow support. You can also view and reply in the app.'

    let emailStatus = 'sent'
    let errorMessage: string | null = null
    let messageId: string | null = null

    try {
      const info = await transporter.sendMail({
        from: { name: fromName, address: smtpRow.from_email },
        to: toEmail,
        subject,
        html: htmlBody,
        text: textBody,
      })

      messageId = info.messageId || null
      emailStatus = 'delivered'
    } catch (error) {
      console.error('[send-support-reply-email] Error sending email:', error)
      emailStatus = 'failed'
      errorMessage = error instanceof Error ? error.message : 'Unknown error'
    }

    // Log email to database
    const { error: logError } = await adminClient
      .from('email_logs')
      .insert({
        template_id: null,
        recipient_email: toEmail,
        recipient_user_id: chat.user_id,
        subject,
        email_type: 'support',
        status: emailStatus,
        error_message: errorMessage,
        sent_at: new Date().toISOString(),
        delivered_at: emailStatus === 'delivered' ? new Date().toISOString() : null,
        metadata: {
          message_id: messageId,
          chat_id: chatId,
        },
      })

    if (logError) {
      console.error('[send-support-reply-email] Error logging email:', logError)
    }

    if (emailStatus === 'failed') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage || 'Failed to send email',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Reply sent and email sent to user' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[send-support-reply-email]', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
