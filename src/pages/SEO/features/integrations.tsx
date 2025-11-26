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
        title="Inventory Management Integrations 2025 - 45+ Connections | StockFlow"
        description="Connect StockFlow with 45+ business tools. Integrate with Shopify, Amazon, QuickBooks, Xero, WooCommerce, and more. Automate inventory sync across sales channels and accounting systems. Start free trial."
        keywords="inventory integrations, inventory management integrations, e-commerce integrations, accounting integrations, POS integrations, Shopify integration, QuickBooks integration, inventory API, stockflow integrations"
        url="https://www.stockflow.be/features/integrations"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />
      <IntegrationsPage />
    </>
  );
}

