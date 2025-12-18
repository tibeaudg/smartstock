/**
 * SEO Enhancer Component
 * Automatically adds common SEO enhancements like WebSite schema and Organization schema
 * Use this component on SEO pages to get automatic schema markup
 */

import React from 'react';
import { StructuredData } from '../StructuredData';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/utils/enhancedStructuredData';
import { useLocation } from 'react-router-dom';

interface SEOEnhancerProps {
  /**
   * Include WebSite schema with SearchAction
   */
  includeWebSite?: boolean;
  
  /**
   * Include Organization schema
   */
  includeOrganization?: boolean;
  
  /**
   * Base URL for the site (defaults to https://www.stockflowsystems.com)
   */
  baseUrl?: string;
  
  /**
   * Language code (defaults to 'en')
   */
  language?: string;
  
  /**
   * Additional custom schemas to include
   */
  customSchemas?: object[];
}

export const SEOEnhancer: React.FC<SEOEnhancerProps> = ({
  includeWebSite = true,
  includeOrganization = true,
  baseUrl = 'https://www.stockflowsystems.com',
  language = 'en',
  customSchemas = []
}) => {
  const location = useLocation();
  
  // Detect language from pathname if not provided
  const detectedLanguage = language || (location.pathname.startsWith('/nl') ? 'nl' : 'en');
  
  const schemas: object[] = [];
  
  // Add Organization schema
  if (includeOrganization) {
    schemas.push(generateOrganizationSchema(baseUrl));
  }
  
  // Add WebSite schema with SearchAction
  if (includeWebSite) {
    schemas.push(generateWebSiteSchema(baseUrl, detectedLanguage));
  }
  
  // Add custom schemas
  if (customSchemas.length > 0) {
    schemas.push(...customSchemas);
  }
  
  // Only render if we have schemas to add
  if (schemas.length === 0) {
    return null;
  }
  
  return <StructuredData data={schemas} />;
};

export default SEOEnhancer;

