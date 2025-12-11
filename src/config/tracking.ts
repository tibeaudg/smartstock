// Tracking configuration
export const TRACKING_CONFIG = {
  // Disable tracking in these environments
  disabledEnvironments: ['development', 'test'],
  
  // Disable tracking for these hostnames
  disabledHostnames: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1'
  ],
  
  // Admin IP addresses to exclude (add your IPs here)
  adminIPs: [
    // Add your IP addresses here
    // '192.168.1.100', // Example home IP
    // '203.0.113.1',   // Example office IP
    // '10.0.0.50',     // Example VPN IP
  ],
  
  // Admin user agents to exclude (optional)
  adminUserAgents: [
    // Add patterns to exclude admin user agents
    // 'Mozilla/5.0 (compatible; AdminBot/1.0)',
  ],
  
  // Enable/disable specific tracking features
  features: {
    pageViews: true,
    clicks: true,
    scrollDepth: true,
    formAbandonment: true,
    timeOnPage: true,
    pageExit: true,
  }
};

// Function to get user's IP address (client-side approximation)
export const getUserIP = async (): Promise<string | null> => {
  try {
    // Try to get IP from a public service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Could not fetch user IP:', error);
    return null;
  }
};

// Function to check if tracking should be disabled
// NOTE: For user activity tracking, we want to track even in development
// This function can be used to disable general analytics, but user activity
// tracking should work everywhere
export const shouldDisableTracking = (): boolean => {
  // For user activity tracking, we allow tracking in all environments
  // Uncomment below if you want to disable tracking in development
  // if (TRACKING_CONFIG.disabledEnvironments.includes(process.env.NODE_ENV || '')) {
  //   return true;
  // }
  
  // Check hostname (but allow localhost for testing)
  // if (TRACKING_CONFIG.disabledHostnames.includes(window.location.hostname)) {
  //   return true;
  // }
  
  // Allow localhost for user activity tracking
  // if (window.location.hostname.includes('localhost')) {
  //   return true;
  // }
  
  return false;
};

// Function to check if user is admin (async version with IP check)
// NOTE: This function is used to EXCLUDE admins from tracking
// For user activity tracking, we want to track ALL users including admins
// So this should return false to allow tracking
export const isAdminUser = async (): Promise<boolean> => {
  // For user activity tracking purposes, we want to track all users
  // including admins, so we return false here
  // If you want to exclude admins from tracking, uncomment the checks below
  
  // Check user agent patterns
  // const userAgent = navigator.userAgent;
  // for (const pattern of TRACKING_CONFIG.adminUserAgents) {
  //   if (userAgent.includes(pattern)) {
  //     return true;
  //   }
  // }
  
  // Check IP address (async)
  // try {
  //   const userIP = await getUserIP();
  //   if (userIP && TRACKING_CONFIG.adminIPs.includes(userIP)) {
  //     return true;
  //   }
  // } catch (error) {
  //   console.warn('Could not check admin IP:', error);
  // }
  
  return false; // Allow tracking for all users including admins
};
