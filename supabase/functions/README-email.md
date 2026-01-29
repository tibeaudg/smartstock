# Email Edge Functions

These functions handle SMTP for support reply emails and admin SMTP testing. They run on Supabase Edge (Deno) and use your `smtp_settings` table.

## Functions

- **send-support-reply-email** – Sends the agent’s reply to the user’s email (called when an admin replies in the Chat tab).
- **admin-smtp-test** – Tests the SMTP connection (`action: 'test'`) or sends a test email (`action: 'send-test'`, `toEmail`).

Both require an authenticated admin/owner (JWT in `Authorization: Bearer <token>`). They read SMTP config from `smtp_settings` for the current user.

## Deploy

From the project root:

```bash
supabase functions deploy send-support-reply-email
supabase functions deploy admin-smtp-test
```

No extra secrets are required; Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to the functions. SMTP credentials are stored in the `smtp_settings` table.

## Local development

```bash
supabase functions serve send-support-reply-email admin-smtp-test
```

Then use the local functions URL in your app or test with `curl` and a valid JWT.
