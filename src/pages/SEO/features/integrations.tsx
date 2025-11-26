import IntegrationsPage from '@/pages/integrations';
import SEO from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Integrations - StockFlow",
  "description": "Connect StockFlow with your favorite tools and services. Stripe payments, Supabase database, e-commerce platforms, and more.",
  "url": "https://www.stockflow.be/features/integrations",
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "StockFlow Integrations",
    "description": "Powerful integrations for inventory management"
  }
};

export default function SEOIntegrationsPage() {
  return (
    <>
      <SEO
        title="Integrations - StockFlow"
        description="Connect StockFlow with your favorite tools and services. Stripe payments, Supabase database, e-commerce platforms, and more."
        keywords="integrations, API, Stripe, Supabase, e-commerce, inventory management, business tools"
        url="https://www.stockflow.be/features/integrations"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />
      <IntegrationsPage />
    </>
  );
}

