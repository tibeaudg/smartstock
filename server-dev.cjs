const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Rate limiting middleware
const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // max 10 requests per minute

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    return next();
  }
  
  if (now > rateLimit[ip].resetTime) {
    rateLimit[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    return next();
  }
  
  if (rateLimit[ip].count >= MAX_REQUESTS) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
  }
  
  rateLimit[ip].count++;
  next();
};

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '5mb' })); // Larger limit for CMS content
app.use(rateLimiter);

// Import API handlers
const loadHandler = (relativePath) => {
  const mod = require(relativePath);
  return mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod;
};

const visitorChatHandler = loadHandler('./api/visitor-chat.js');
const contactHandler = loadHandler('./api/contact.js');
const adsHandler = loadHandler('./api/ads.js');
const sitemapHandler = loadHandler('./api/sitemap.js');
const cmsSeoRouterModule = require('./api/cms-seo.cjs');
const cmsSeoRouter = cmsSeoRouterModule.default || cmsSeoRouterModule;

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

app.use('/api/cms/seo', cmsSeoRouter);

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

