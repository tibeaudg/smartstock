import CaseStudiesPage from '@/pages/case-studies';
import SEO from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Case Studies - StockFlow",
  "description": "See how businesses are using StockFlow to improve inventory management and increase efficiency.",
  "url": "https://www.stockflow.be/resources/case-studies",
  "mainEntity": {
    "@type": "ItemList",
    "name": "StockFlow Case Studies",
    "description": "Success stories from businesses using StockFlow"
  }
};

export default function SEOCaseStudiesPage() {
  return (
    <>
      <SEO
        title="Inventory Management Case Studies 2025 - Success Stories | StockFlow"
        description="See how businesses use StockFlow to improve inventory management. Real success stories from electronics, retail, food, and logistics companies. Learn about ROI, time savings, and results."
        keywords="case studies, success stories, inventory management, business results, ROI, testimonials, inventory software case studies, inventory management success stories, stockflow case studies"
        url="https://www.stockflow.be/resources/case-studies"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />
      <CaseStudiesPage />
    </>
  );
}

