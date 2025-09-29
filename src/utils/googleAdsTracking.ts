// Google Ads Conversion Tracking Utility
// This file handles Google Ads conversion events for the AW-17574614935 account

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface ConversionEvent {
  send_to: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  custom_parameters?: Record<string, any>;
}

export interface GoogleAdsConversionConfig {
  conversionId: string;
  conversionLabel: string;
  value?: number;
  currency?: string;
  transactionId?: string;
  customParameters?: Record<string, any>;
}

// Google Ads Conversion IDs and Labels
export const GOOGLE_ADS_CONVERSIONS = {
  // Page view conversion (track when users visit key pages)
  PAGE_VIEW: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'page_view_label', // Replace with your actual conversion label
  },
  
  // Registration conversion (when user completes signup)
  REGISTRATION: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'registration_label', // Replace with your actual conversion label
  },
  
  // Login conversion (when user successfully logs in)
  LOGIN: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'login_label', // Replace with your actual conversion label
  },
  
  // Demo request conversion (when user requests demo)
  DEMO_REQUEST: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'demo_request_label', // Replace with your actual conversion label
  },
  
  // Contact form submission
  CONTACT_SUBMIT: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'contact_submit_label', // Replace with your actual conversion label
  },
  
  // Pricing page view (high-intent page)
  PRICING_VIEW: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'pricing_view_label', // Replace with your actual conversion label
  },
} as const;

/**
 * Check if Google Ads tracking is available
 */
export const isGoogleAdsAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         Array.isArray(window.dataLayer);
};

/**
 * Track a Google Ads conversion event
 */
export const trackGoogleAdsConversion = (
  config: GoogleAdsConversionConfig,
  eventName: string = 'conversion'
): void => {
  if (!isGoogleAdsAvailable()) {
    // Silently fail - no console output
    return;
  }

  try {
    const conversionEvent: ConversionEvent = {
      send_to: `${config.conversionId}/${config.conversionLabel}`,
      ...(config.value && { value: config.value }),
      ...(config.currency && { currency: config.currency }),
      ...(config.transactionId && { transaction_id: config.transactionId }),
      ...(config.customParameters && { custom_parameters: config.customParameters }),
    };

    // Fire the conversion event with comprehensive error handling
    try {
      window.gtag('event', eventName, conversionEvent);
    } catch (gtagError) {
      // Silently handle gtag errors
      return;
    }
  } catch (error) {
    // Silently fail - no console output
    return;
  }
};

/**
 * Track page view conversion (for important pages)
 */
export const trackPageViewConversion = (
  pageName: string,
  value?: number,
  customParameters?: Record<string, any>
): void => {
  trackGoogleAdsConversion({
    ...GOOGLE_ADS_CONVERSIONS.PAGE_VIEW,
    value,
    customParameters: {
      page_name: pageName,
      ...customParameters,
    },
  }, 'page_view');
};

/**
 * Track registration conversion
 */
export const trackRegistrationConversion = (
  userId?: string,
  email?: string,
  value?: number
): void => {
  trackGoogleAdsConversion({
    ...GOOGLE_ADS_CONVERSIONS.REGISTRATION,
    value,
    transactionId: userId,
    customParameters: {
      user_id: userId,
      email: email,
      conversion_type: 'registration',
    },
  }, 'registration');
};

/**
 * Track login conversion
 */
export const trackLoginConversion = (
  userId?: string,
  email?: string,
  value?: number
): void => {
  trackGoogleAdsConversion({
    ...GOOGLE_ADS_CONVERSIONS.LOGIN,
    value,
    transactionId: userId,
    customParameters: {
      user_id: userId,
      email: email,
      conversion_type: 'login',
    },
  }, 'login');
};

/**
 * Track demo request conversion
 */
export const trackDemoRequestConversion = (
  email?: string,
  companyName?: string,
  value?: number
): void => {
  trackGoogleAdsConversion({
    ...GOOGLE_ADS_CONVERSIONS.DEMO_REQUEST,
    value,
    customParameters: {
      email: email,
      company_name: companyName,
      conversion_type: 'demo_request',
    },
  }, 'demo_request');
};

/**
 * Track contact form submission
 */
export const trackContactFormConversion = (
  formType: string,
  email?: string,
  value?: number
): void => {
  trackGoogleAdsConversion({
    ...GOOGLE_ADS_CONVERSIONS.CONTACT_SUBMIT,
    value,
    customParameters: {
      form_type: formType,
      email: email,
      conversion_type: 'contact_form',
    },
  }, 'contact_submit');
};

/**
 * Track pricing page view (high-intent conversion)
 */
export const trackPricingViewConversion = (
  source?: string,
  value?: number
): void => {
  trackGoogleAdsConversion({
    ...GOOGLE_ADS_CONVERSIONS.PRICING_VIEW,
    value,
    customParameters: {
      source: source,
      conversion_type: 'pricing_view',
    },
  }, 'pricing_view');
};

/**
 * Track custom conversion with flexible parameters
 */
export const trackCustomConversion = (
  conversionLabel: string,
  conversionId: string = 'AW-17574614935',
  value?: number,
  customParameters?: Record<string, any>
): void => {
  trackGoogleAdsConversion({
    conversionId,
    conversionLabel,
    value,
    customParameters,
  }, 'custom_conversion');
};

/**
 * Enhanced conversion tracking with additional data
 */
export const trackEnhancedConversion = (
  config: GoogleAdsConversionConfig & {
    email?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    address?: {
      street?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
    };
  }
): void => {
  if (!isGoogleAdsAvailable()) {
    console.warn('Google Ads tracking not available');
    return;
  }

  try {
    const enhancedData: any = {
      send_to: `${config.conversionId}/${config.conversionLabel}`,
      ...(config.value && { value: config.value }),
      ...(config.currency && { currency: config.currency }),
      ...(config.transactionId && { transaction_id: config.transactionId }),
    };

    // Add enhanced conversion data if available
    if (config.email || config.phoneNumber || config.firstName || config.lastName) {
      enhancedData.user_data = {};
      
      if (config.email) enhancedData.user_data.email_address = config.email;
      if (config.phoneNumber) enhancedData.user_data.phone_number = config.phoneNumber;
      if (config.firstName) enhancedData.user_data.first_name = config.firstName;
      if (config.lastName) enhancedData.user_data.last_name = config.lastName;
      if (config.address) enhancedData.user_data.address = config.address;
    }

    // Add custom parameters
    if (config.customParameters) {
      enhancedData.custom_parameters = config.customParameters;
    }

    window.gtag('event', 'conversion', enhancedData);
    
    console.log('Google Ads enhanced conversion tracked:', {
      conversionId: config.conversionId,
      conversionLabel: config.conversionLabel,
      hasUserData: !!(config.email || config.phoneNumber),
    });
  } catch (error) {
    console.error('Error tracking enhanced Google Ads conversion:', error);
  }
};

/**
 * Initialize Google Ads tracking (call this once on app load)
 */
export const initializeGoogleAdsTracking = (): void => {
  if (!isGoogleAdsAvailable()) {
    // Silently fail - no console output
    return;
  }

  // Silently track initial page load
  try {
    trackPageViewConversion('homepage_initial_load');
  } catch (error) {
    // Silently handle any errors
    return;
  }
};

// Export all conversion tracking functions
export const GoogleAdsTracking = {
  trackPageViewConversion,
  trackRegistrationConversion,
  trackLoginConversion,
  trackDemoRequestConversion,
  trackContactFormConversion,
  trackPricingViewConversion,
  trackCustomConversion,
  trackEnhancedConversion,
  initializeGoogleAdsTracking,
  isAvailable: isGoogleAdsAvailable,
};
