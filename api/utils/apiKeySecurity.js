// Server-side API key hashing and management
// This should be used instead of client-side hashing

const crypto = require('crypto');

/**
 * Generates a secure random API key
 * @param {string} prefix - Key prefix (e.g., 'sk_live_')
 * @param {number} length - Random part length
 * @returns {string} - Generated API key
 */
function generateAPIKey(prefix = 'sk_live_', length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

/**
 * Hashes an API key using SHA-256
 * @param {string} apiKey - API key to hash
 * @returns {string} - Hex-encoded hash
 */
function hashAPIKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Verifies an API key against a stored hash
 * @param {string} apiKey - API key to verify
 * @param {string} storedHash - Stored hash to compare against
 * @returns {boolean} - True if key matches hash
 */
function verifyAPIKey(apiKey, storedHash) {
  const computedHash = hashAPIKey(apiKey);
  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(storedHash)
  );
}

module.exports = {
  generateAPIKey,
  hashAPIKey,
  verifyAPIKey
};

