import { caseStudies, CaseStudy } from '@/data/caseStudies';
import { testimonialQuotes, TestimonialQuote } from '@/data/testimonialQuotes';



/**
 * Get testimonials relevant to a specific feature or topic
 */
export function getRelevantTestimonials(feature?: string): TestimonialQuote[] {
  if (!feature) {
    return testimonialQuotes;
  }
  
  const featureLower = feature.toLowerCase();
  
  return testimonialQuotes.filter(testimonial => {
    const searchText = [
      testimonial.quote,
      testimonial.company
    ].join(' ').toLowerCase();
    
    // Match feature keywords
    const keywords = featureLower.split(/\s+/).filter(k => k.length > 3);
    return keywords.some(keyword => searchText.includes(keyword));
  });
}




/**
 * Get all available metrics for display
 */
export function getAllMetrics(): {
  totalCustomers: string;
  totalInventoryValue: string;
  averageTimeSaved: string;
  averageCostReduction: string;
} {
  return {
    totalCustomers: "500+",
    totalInventoryValue: "€2.4M",
    averageTimeSaved: "6 hours/week",
    averageCostReduction: "25%"
  };
}





