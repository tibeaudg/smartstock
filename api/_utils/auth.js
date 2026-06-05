// Server-side authentication and authorization middleware
// Validates Supabase JWT tokens and checks user permissions

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase admin client for server-side operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Auth] Supabase credentials not configured. Server-side auth will be disabled.');
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Extracts JWT token from request headers
 * @param {object} req - Express request object
 * @returns {string|null} - JWT token or null
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * Validates JWT token and returns user information
 * @param {string} token - JWT token
 * @returns {Promise<object|null>} - User object or null if invalid
 */
async function validateToken(token) {
  if (!supabaseAdmin || !token) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('[Auth] Token validation error:', error);
    return null;
  }
}

/**
 * Gets user profile from database
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} - User profile or null
 */
async function getUserProfile(userId) {
  if (!supabaseAdmin || !userId) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error('[Auth] Profile fetch error:', error);
    return null;
  }
}

/**
 * Middleware to require authentication
 */
async function requireAuth(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({
      ok: false,
      error: 'Authentication required'
    });
  }

  const user = await validateToken(token);
  if (!user) {
    return res.status(401).json({
      ok: false,
      error: 'Invalid or expired token'
    });
  }

  // Attach user to request
  req.user = user;
  req.userProfile = await getUserProfile(user.id);
  
  next();
}

/**
 * Middleware to require admin role
 */
async function requireAdmin(req, res, next) {
  // First check authentication
  await requireAuth(req, res, () => {
    // Then check admin role
    if (!req.userProfile) {
      return res.status(403).json({
        ok: false,
        error: 'User profile not found'
      });
    }

    const isAdmin = req.userProfile.role === 'admin' || req.userProfile.is_owner === true;
    if (!isAdmin) {
      return res.status(403).json({
        ok: false,
        error: 'Admin access required'
      });
    }

    next();
  });
}

/**
 * Middleware to require owner role
 */
async function requireOwner(req, res, next) {
  await requireAuth(req, res, () => {
    if (!req.userProfile || req.userProfile.is_owner !== true) {
      return res.status(403).json({
        ok: false,
        error: 'Owner access required'
      });
    }
    next();
  });
}

module.exports = {
  extractToken,
  validateToken,
  getUserProfile,
  requireAuth,
  requireAdmin,
  requireOwner
};


