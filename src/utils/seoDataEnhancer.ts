import { caseStudies, CaseStudy } from '@/data/caseStudies';
import { testimonialQuotes, TestimonialQuote } from '@/data/testimonialQuotes';

/**
 * Get case studies relevant to a specific topic or industry
 */
export function getRelevantCaseStudies(
  topic: string,
  industry?: string
): CaseStudy[] {
  const topicLower = topic.toLowerCase();
  
  return caseStudies.filter(study => {
    // Match by industry if provided
    if (industry) {
      const industryLower = industry.toLowerCase();
      if (study.industry.toLowerCase().includes(industryLower) || 
          industryLower.includes(study.industry.toLowerCase())) {
        return true;
      }
    }
    
    // Match by topic keywords in challenge, solution, or results
    const searchText = [
      study.challenge,
      study.solution,
      study.title,
      ...study.results
    ].join(' ').toLowerCase();
    
    // Common inventory-related keywords
    const keywords = topicLower.split(/\s+/).filter(k => k.length > 3);
    return keywords.some(keyword => searchText.includes(keyword));
  });
}

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
 * Get proprietary metrics for a specific feature
 * Returns aggregated metrics based on case studies and testimonials
 */
export function getProprietaryMetrics(feature: string): {
  averageTimeSaved?: string;
  averageCostSaved?: string;
  customerCount: string;
  keyMetric?: string;
} {
  // Aggregate metrics from case studies
  const relevantStudies = getRelevantCaseStudies(feature);
  const relevantTestimonials = getRelevantTestimonials(feature);
  
  // Extract time savings
  const timeSavings: string[] = [];
  relevantStudies.forEach(study => {
    if (study.metrics.timeSaved) {
      timeSavings.push(study.metrics.timeSaved);
    }
  });
  
  // Extract cost savings
  const costSavings: string[] = [];
  relevantStudies.forEach(study => {
    if (study.metrics.costSaved) {
      costSavings.push(study.metrics.costSaved);
    }
  });
  relevantTestimonials.forEach(testimonial => {
    if (testimonial.savings) {
      costSavings.push(testimonial.savings);
    }
  });
  
  // Calculate averages (simplified - in production, parse and calculate properly)
  let averageTimeSaved: string | undefined;
  if (timeSavings.length > 0) {
    // Extract numbers and average (simplified)
    const times = timeSavings.map(t => {
      const match = t.match(/(\d+\.?\d*)\s*(hours?|hrs?)/i);
      return match ? parseFloat(match[1]) : 0;
    }).filter(t => t > 0);
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      averageTimeSaved = `${Math.round(avg)} hours/week`;
    }
  }
  
  // Base customer count (from customers page data)
  const customerCount = "500+";
  
  // Key metric from case studies
  let keyMetric: string | undefined;
  if (relevantStudies.length > 0) {
    const firstStudy = relevantStudies[0];
    if (firstStudy.results.length > 0) {
      keyMetric = firstStudy.results[0];
    }
  }
  
  return {
    averageTimeSaved,
    averageCostSaved: costSavings.length > 0 ? costSavings[0] : undefined,
    customerCount,
    keyMetric
  };
}

/**
 * Get industry-specific benchmarks
 */
export function getIndustryBenchmarks(industry: string): {
  averageSavings?: string;
  averageTimeReduction?: string;
  commonChallenge?: string;
  typicalResult?: string;
} {
  const industryLower = industry.toLowerCase();
  const relevantStudies = caseStudies.filter(study => 
    study.industry.toLowerCase().includes(industryLower) ||
    industryLower.includes(study.industry.toLowerCase())
  );
  
  if (relevantStudies.length === 0) {
    // Return general benchmarks
    return {
      averageSavings: "€10,000+ annually",
      averageTimeReduction: "70%",
      commonChallenge: "Manual inventory tracking",
      typicalResult: "75% reduction in counting time"
    };
  }
  
  // Extract metrics from relevant studies
  const firstStudy = relevantStudies[0];
  return {
    averageSavings: firstStudy.metrics.costSaved,
    averageTimeReduction: firstStudy.results.find(r => r.includes('%')) || "70%",
    commonChallenge: firstStudy.challenge,
    typicalResult: firstStudy.results[0]
  };
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



