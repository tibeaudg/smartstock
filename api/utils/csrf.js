// CSRF protection middleware
// Generates and validates CSRF tokens for state-changing operations

const crypto = require('crypto');

// In-memory token store (in production, use Redis or database)
const tokenStore = new Map();
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

// Cleanup expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (data.expiresAt < now) {
      tokenStore.delete(token);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

/**
 * Generates a CSRF token and stores it
 * @param {string} sessionId - Session identifier (can be IP or user ID)
 * @returns {string} - CSRF token
 */
function generateToken(sessionId) {
  const token = crypto.randomBytes(32).toString('hex');
  tokenStore.set(token, {
    sessionId,
    expiresAt: Date.now() + TOKEN_EXPIRY,
    createdAt: Date.now()
  });
  return token;
}

/**
 * Validates a CSRF token
 * @param {string} token - CSRF token to validate
 * @param {string} sessionId - Session identifier
 * @returns {boolean} - True if token is valid
 */
function validateToken(token, sessionId) {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const tokenData = tokenStore.get(token);
  if (!tokenData) {
    return false;
  }

  // Check expiry
  if (tokenData.expiresAt < Date.now()) {
    tokenStore.delete(token);
    return false;
  }

  // Check session match
  if (tokenData.sessionId !== sessionId) {
    return false;
  }

  return true;
}

/**
 * Middleware to generate CSRF token for GET requests
 */
function csrfTokenGenerator(req, res, next) {
  if (req.method === 'GET') {
    const sessionId = req.ip || req.connection.remoteAddress || 'unknown';
    const token = generateToken(sessionId);
    res.setHeader('X-CSRF-Token', token);
  }
  next();
}

/**
 * Middleware to validate CSRF token for state-changing requests
 */
function csrfValidator(req, res, next) {
  // Only validate POST, PUT, DELETE, PATCH requests
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body?.csrfToken;
  const sessionId = req.ip || req.connection.remoteAddress || 'unknown';

  if (!validateToken(token, sessionId)) {
    return res.status(403).json({
      ok: false,
      error: 'Invalid or missing CSRF token'
    });
  }

  // Remove used token (one-time use)
  if (token) {
    tokenStore.delete(token);
  }

  next();
}

module.exports = {
  generateToken,
  validateToken,
  csrfTokenGenerator,
  csrfValidator
};

