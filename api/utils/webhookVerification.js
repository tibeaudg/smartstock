// Webhook signature verification utilities
// Supports Stripe and other webhook providers

const crypto = require('crypto');

/**
 * Verifies Stripe webhook signature
 * @param {string} payload - Raw request body as string
 * @param {string} signature - Stripe signature header
 * @param {string} secret - Stripe webhook secret
 * @returns {boolean} - True if signature is valid
 */
function verifyStripeSignature(payload, signature, secret) {
  if (!payload || !signature || !secret) {
    return false;
  }

  try {
    // Stripe signs the payload using HMAC SHA-256
    const elements = signature.split(',');
    const signatureHash = elements.find(el => el.startsWith('v1='));
    
    if (!signatureHash) {
      return false;
    }

    const signatureValue = signatureHash.split('=')[1];
    const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1];

    // Check timestamp (prevent replay attacks)
    if (timestamp) {
      const timestampMs = parseInt(timestamp, 10) * 1000;
      const currentTime = Date.now();
      const timeDiff = Math.abs(currentTime - timestampMs);
      
      // Reject if timestamp is more than 5 minutes old
      if (timeDiff > 5 * 60 * 1000) {
        return false;
      }
    }

    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    // Compare signatures using constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(signatureValue),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('[Webhook] Signature verification error:', error);
    return false;
  }
}

/**
 * Middleware to verify Stripe webhook signature
 */
function verifyStripeWebhook(req, res, next) {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return res.status(401).json({
      ok: false,
      error: 'Missing webhook signature'
    });
  }

  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({
      ok: false,
      error: 'Webhook configuration error'
    });
  }

  // Get raw body (must be string, not parsed JSON)
  const payload = req.rawBody || JSON.stringify(req.body);

  if (!verifyStripeSignature(payload, signature, webhookSecret)) {
    return res.status(401).json({
      ok: false,
      error: 'Invalid webhook signature'
    });
  }

  next();
}

module.exports = {
  verifyStripeSignature,
  verifyStripeWebhook
};

