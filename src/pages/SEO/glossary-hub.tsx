import SeoCategoryHubPage from '@/components/seo/SeoCategoryHubPage';

const canonicalPath = '/glossary';

const routeFilter = (path: string) =>
  path.startsWith('/glossary/') ||
  ['/inventory-management', '/warehouse-management-system', '/what-is-lead-time', '/asset-tracking'].includes(
    path
  );

export default function GlossaryHubPage() {
  return (
    <SeoCategoryHubPage
      canonicalPath={canonicalPath}
      title="Inventory Glossary"
      seoTitle="Inventory Management Glossary | StockFlow"
      seoDescription="Browse StockFlow's inventory management glossary. Definitions for asset tracking, lead time, warehouse management, and more."
      heroTitle="Inventory Management Glossary"
      heroDescription="Clear definitions for inventory, warehouse, and supply chain terms."
      routeFilter={routeFilter}
    />
  );
}
