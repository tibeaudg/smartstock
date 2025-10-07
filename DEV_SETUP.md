# Development Setup

## API Development Server

This project uses a development API server to handle `/api/*` endpoints during local development.

### Quick Start

1. **Create a `.env` file** in the root directory with your SMTP credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**For Gmail:**
- Use App Passwords (not your regular password)
- Enable 2-factor authentication
- Generate an App Password at: https://myaccount.google.com/apppasswords

**For other SMTP providers:**
- Use your SMTP server host (e.g., smtp.sendgrid.net, smtp.mailgun.org)
- Use the appropriate port (587 for TLS, 465 for SSL)
- Use your SMTP username and password

2. **Run the development server:**

```bash
npm run dev
```

This will start both:
- Vite dev server on `http://localhost:8080` (your React app)
- API dev server on `http://localhost:3001` (handles `/api/*` endpoints)

### How It Works

- **Development**: Vite proxies `/api/*` requests to the Express server running on port 3001
- **Production (Vercel)**: The `api/` folder contains serverless functions that Vercel automatically deploys

### Available API Endpoints

During development, these endpoints are available:

- `POST /api/visitor-chat` - Floating chat widget messages
- `POST /api/contact` - Contact form submissions
- `GET /api/sitemap` - Sitemap generation
- `GET /api/ads` - Ads.txt file
- `GET /api/health` - Health check endpoint

### Troubleshooting

**404 errors on `/api/*` endpoints:**
- Make sure both servers are running (`npm run dev` starts both)
- Check that port 3001 is not in use by another application
- Verify your `.env` file exists and contains SMTP credentials

**Email not sending:**
- Check your SMTP credentials in `.env`
- For Gmail, ensure you're using an App Password, not your regular password
- Check the API server logs in the terminal for error messages

### Manual Server Start

If you need to run the servers separately:

```bash
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Vite Server
npm run dev:vite
```

### Using Vercel Environment Variables Locally

If you have your SMTP credentials in Vercel, you can pull them locally:

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env
```

This will create a `.env` file with your Vercel environment variables.

