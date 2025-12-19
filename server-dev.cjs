const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Security middleware
const { csrfTokenGenerator, csrfValidator } = require('./api/utils/csrf.js');
const { verifyStripeWebhook } = require('./api/utils/webhookVerification.js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Security: Enhanced rate limiting with per-endpoint limits
const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Per-endpoint rate limits (stricter for sensitive endpoints)
const RATE_LIMITS = {
  default: { max: 60, window: 60 * 1000 }, // 60 requests per minute
  '/api/contact': { max: 10, window: 60 * 1000 }, // 10 requests per minute
  '/api/visitor-chat': { max: 20, window: 60 * 1000 }, // 20 requests per minute
  '/api/capture-lead': { max: 30, window: 60 * 1000 }, // 30 requests per minute
  '/api/send-purchase-order-email': { max: 5, window: 60 * 1000 }, // 5 requests per minute (very strict)
};

// Cleanup old rate limit entries periodically (prevent memory leak)
setInterval(() => {
  const now = Date.now();
  for (const ip in rateLimit) {
    for (const endpoint in rateLimit[ip]) {
      if (rateLimit[ip][endpoint].resetTime < now) {
        delete rateLimit[ip][endpoint];
      }
    }
    // Remove IP entry if no endpoints remain
    if (Object.keys(rateLimit[ip]).length === 0) {
      delete rateLimit[ip];
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const path = req.path;
  const now = Date.now();
  
  // Get rate limit config for this endpoint
  const limitConfig = RATE_LIMITS[path] || RATE_LIMITS.default;
  const maxRequests = limitConfig.max;
  const window = limitConfig.window;
  
  // Initialize IP tracking if needed
  if (!rateLimit[ip]) {
    rateLimit[ip] = {};
  }
  
  // Initialize endpoint tracking if needed
  if (!rateLimit[ip][path]) {
    rateLimit[ip][path] = { count: 0, resetTime: now + window, violations: 0 };
  }
  
  const endpointData = rateLimit[ip][path];
  
  // Reset if window expired
  if (now > endpointData.resetTime) {
    endpointData.count = 0;
    endpointData.resetTime = now + window;
    // Reset violations after successful window
    if (endpointData.violations > 0) {
      endpointData.violations = Math.max(0, endpointData.violations - 1);
    }
  }
  
  // Check if limit exceeded
  if (endpointData.count >= maxRequests) {
    endpointData.violations++;
    
    // Exponential backoff: increase reset time for repeated violations
    const backoffMultiplier = Math.min(1 + (endpointData.violations * 0.5), 5); // Max 5x backoff
    endpointData.resetTime = now + (window * backoffMultiplier);
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', new Date(endpointData.resetTime).toISOString());
    res.setHeader('Retry-After', Math.ceil((endpointData.resetTime - now) / 1000));
    
    return res.status(429).json({ 
      ok: false, 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((endpointData.resetTime - now) / 1000)
    });
  }
  
  // Increment counter
  endpointData.count++;
  
  // Add rate limit headers to successful requests
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - endpointData.count));
  res.setHeader('X-RateLimit-Reset', new Date(endpointData.resetTime).toISOString());
  
  next();
};

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Security: Parse JSON with size limits, but preserve raw body for webhook verification
app.use(express.json({ limit: '5mb' }));
app.use(express.raw({ type: 'application/json', limit: '5mb' }));

// Security: Store raw body for webhook signature verification
app.use((req, res, next) => {
  if (req.path.startsWith('/api/webhooks/')) {
    req.rawBody = req.body.toString('utf8');
    // Re-parse JSON for normal processing
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (e) {
      // If not JSON, keep as is
    }
  }
  next();
});

// Security: Rate limiting (before CSRF to prevent abuse)
app.use(rateLimiter);

// Security: CSRF token generation for GET requests
app.use(csrfTokenGenerator);

// Security: CSRF validation for state-changing requests (except webhooks)
app.use((req, res, next) => {
  // Skip CSRF for webhooks (they use signature verification instead)
  if (req.path.startsWith('/api/webhooks/')) {
    return next();
  }
  csrfValidator(req, res, next);
});

// Import API handlers
const loadHandler = (relativePath) => {
  const mod = require(relativePath);
  return mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod;
};

const visitorChatHandler = loadHandler('./api/visitor-chat.js');
const contactHandler = loadHandler('./api/contact.js');
const adsHandler = loadHandler('./api/ads.js');
const sitemapHandler = loadHandler('./api/sitemap.js');

// API routes
// Public endpoints (no auth required, but CSRF protected)
app.post('/api/visitor-chat', (req, res) => {
  visitorChatHandler(req, res);
});

app.post('/api/contact', (req, res) => {
  contactHandler(req, res);
});

// Webhook endpoints (signature verified, no CSRF)
// Example: app.post('/api/webhooks/stripe', verifyStripeWebhook, stripeWebhookHandler);

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

// Security: Error sanitization middleware to prevent information leakage
app.use((err, req, res, next) => {
  // Security: Log full error details server-side only (sanitize PII)
  const sanitizedPath = req.path.replace(/\/[^\/]+\/[^\/]+$/, '/***/***'); // Mask IDs in paths
  console.error('[Server Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Only in dev
    path: sanitizedPath,
    method: req.method,
    ip: req.ip ? req.ip.replace(/(\d+\.\d+\.\d+)\.\d+/, '$1.***') : 'unknown', // Mask last octet
    timestamp: new Date().toISOString()
  });
  
  // Security: Return generic error to client, never expose stack traces or internal details
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Only expose error message in development
  const errorResponse = {
    ok: false,
    error: 'Internal server error',
    ...(isDevelopment && {
      // Development-only details
      message: err.message,
      // Never expose stack traces, even in development (security best practice)
    })
  };
  
  res.status(500).json(errorResponse);
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

