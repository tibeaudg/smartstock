# Contact Form Setup Guide

## Overview
The contact form has been fully implemented and will send all inquiries to **info@stockflow.be**.

## ✅ What's Been Implemented

### 1. **Enhanced Contact API** (`api/contact.js`)
- Sends emails to `info@stockflow.be`
- Supports subject-based email routing
- Beautiful HTML email templates
- Handles "Business Tier Inquiry" from pricing page
- Reply-to field set to sender's email for easy responses

### 2. **Updated Contact Form** (`src/pages/contact.tsx`)
- Added subject dropdown with predefined options:
  - General Inquiry
  - Business Tier / Enterprise
  - Technical Support
  - Sales Question
  - Demo Request
  - Partnership Opportunity
  - Other
- Auto-fills subject from URL parameters (e.g., `?subject=business-tier`)
- Form validation for all fields
- Professional UI with success/error messages

### 3. **Business Tier Integration**
- Clicking "Contact Sales" on Business tier pricing redirects to:
  - `/contact?subject=business-tier`
- Subject automatically pre-selected as "Business Tier Inquiry"

## 🔧 Required Environment Variables

To make the contact form work, you need to configure SMTP settings. Add these to your environment variables:

### Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following:

```bash
SMTP_HOST=smtp.your-email-provider.com
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
SMTP_PORT=587
```

### Recommended Email Providers

#### Option 1: Gmail (Free)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_PORT=587
```
**Note:** You need to generate an App Password in Gmail settings (2FA required)

#### Option 2: SendGrid (Recommended for Production)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_PORT=587
```

#### Option 3: Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-smtp-password
SMTP_PORT=587
```

#### Option 4: Your Own Email Server
```bash
SMTP_HOST=mail.stockflow.be
SMTP_USER=info@stockflow.be
SMTP_PASS=your-email-password
SMTP_PORT=587 (or 465 for SSL)
```

## 📧 Email Format

Emails sent to info@stockflow.be will look like:

**Subject:** `Business Tier Inquiry from John Doe` (or other subject)

**Body:**
```
New Contact Form Submission

Name: John Doe
Email: john@example.com
Subject: Business Tier Inquiry

Message:
I'm interested in the Business tier for my company with 50+ users...
```

## 🧪 Testing the Contact Form

### Local Testing
1. Set environment variables in `.env.local`:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your-test-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_PORT=587
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:8080/contact`

4. Fill out and submit the form

5. Check info@stockflow.be for the test email

### Production Testing
1. Deploy to Vercel with environment variables configured
2. Visit `https://your-domain.com/contact?subject=business-tier`
3. Submit the form
4. Verify email received at info@stockflow.be

## 🎨 Email Template Features

- Professional HTML formatting
- Clickable email address (mailto: link)
- Clear subject categorization
- Responsive design for mobile email clients
- Proper text fallback for plain text email clients

## 🔒 Security Notes

1. **Never commit SMTP credentials** to git
2. Use app-specific passwords, not your main email password
3. Enable 2FA on your email account
4. Consider using a dedicated email service for production (SendGrid, Mailgun)
5. Monitor email sending limits of your chosen provider

## 📊 Usage

### From Pricing Page
When users click "Contact Sales" on the Business tier:
- Redirects to `/contact?subject=business-tier`
- Subject automatically filled as "Business Tier Inquiry"
- Clear indication they're inquiring about enterprise features

### Direct Contact Page Access
Users can access `/contact` directly and select any subject from the dropdown.

## 🚀 Next Steps

1. **Configure SMTP credentials** in Vercel environment variables
2. **Test the form** by submitting a test inquiry
3. **Monitor email delivery** to ensure emails are reaching info@stockflow.be
4. **Set up email forwarding** if needed (e.g., forward to multiple team members)
5. **Consider email notifications** for team alerts when new inquiries arrive

## 📝 Troubleshooting

### Email not sending
- Check environment variables are set correctly in Vercel
- Verify SMTP credentials are valid
- Check spam folder at info@stockflow.be
- Review Vercel function logs for errors

### "Email not configured" error
- SMTP environment variables are missing
- Add them to Vercel project settings
- Redeploy the application

### Form submission fails
- Check browser console for errors
- Verify `/api/contact` endpoint is accessible
- Check Vercel function logs

## 💡 Alternative: Supabase Edge Function

If you prefer to use Supabase instead of Vercel API routes, you can create a Supabase Edge Function:

1. Create `supabase/functions/send-contact-email/index.ts`
2. Update contact form to call Supabase function instead
3. Configure SMTP in Supabase secrets

Let me know if you'd like me to implement this alternative approach!

