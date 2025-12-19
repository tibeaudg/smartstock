// Comprehensive Zod validation schemas for all API endpoints
// Note: This requires zod to be installed in the API directory
// If zod is not available, fall back to the existing validation.js functions

let z;
try {
  z = require('zod');
} catch (e) {
  // Zod not available, will use fallback validation
  z = null;
}

// Email validation schema
const emailSchema = z ? z.string().email().max(254) : null;

// Contact form schema
const contactFormSchema = z ? z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  message: z.string().min(10).max(5000),
  subject: z.string().max(200).optional()
}) : null;

// Visitor chat schema
const visitorChatSchema = z ? z.object({
  email: z.string().email().max(254),
  message: z.string().min(5).max(2000)
}) : null;

// Lead capture schema
const leadCaptureSchema = z ? z.object({
  email: z.string().email().max(255),
  source: z.string().max(100),
  metadata: z.record(z.unknown()).optional()
}) : null;

/**
 * Validates data using Zod schema with fallback to existing validation
 * @param {object} schema - Zod schema (or null if Zod not available)
 * @param {object} data - Data to validate
 * @param {function} fallbackValidator - Fallback validation function
 * @returns {object} - { valid: boolean, data?: object, errors?: string[] }
 */
function validateWithZod(schema, data, fallbackValidator) {
  if (!z || !schema) {
    // Fallback to existing validation
    return fallbackValidator(data);
  }

  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return {
        valid: true,
        data: result.data
      };
    } else {
      return {
        valid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${error.message}`]
    };
  }
}

module.exports = {
  emailSchema,
  contactFormSchema,
  visitorChatSchema,
  leadCaptureSchema,
  validateWithZod,
  zodAvailable: !!z
};

