const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));
app.use(express.json());

// Import API handlers
const visitorChatHandler = require('./api/visitor-chat.js');
const contactHandler = require('./api/contact.js');
const adsHandler = require('./api/ads.js');
const sitemapHandler = require('./api/sitemap.js');

// API routes
app.post('/api/visitor-chat', (req, res) => {
  visitorChatHandler(req, res);
});

app.post('/api/contact', (req, res) => {
  contactHandler(req, res);
});

app.get('/api/ads', (req, res) => {
  adsHandler(req, res);
});

app.get('/api/sitemap', (req, res) => {
  sitemapHandler(req, res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    ok: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(`📧 Visitor chat endpoint: http://localhost:${PORT}/api/visitor-chat`);
  console.log(`✉️  Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`\n⚙️  Environment check:`);
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST ? '✓ Set' : '✗ Not set'}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER ? '✓ Set' : '✗ Not set'}`);
  console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? '✓ Set' : '✗ Not set'}`);
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`\n⚠️  WARNING: SMTP credentials not configured in .env file`);
    console.log(`   Email sending will not work until you create a .env file with:`);
    console.log(`   SMTP_HOST, SMTP_USER, SMTP_PASS\n`);
  }
});

