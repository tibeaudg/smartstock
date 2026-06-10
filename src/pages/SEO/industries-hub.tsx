import SeoCategoryHubPage from '@/components/seo/SeoCategoryHubPage';

const canonicalPath = '/industries';

const routeFilter = (path: string) =>
  path.startsWith('/industries/') ||
  [
    '/contractor-inventory-management',
    '/hvac-inventory-management',
    '/hvac-inventory-management-software',
    '/electrical-inventory-management',
    '/medical-inventory-management',
    '/restaurant-inventory-management-software',
    '/retail-inventory-management',
    '/warehouse-software',
    '/government-inventory-management-software',
    '/non-profit-inventory-management-software',
    '/enterprise-inventory-management',
  ].includes(path);

export default function IndustriesHubPage() {
  return (
    <SeoCategoryHubPage
      canonicalPath={canonicalPath}
      title="Industries"
      seoTitle="Inventory Software by Industry | StockFlow"
      seoDescription="Industry-specific inventory management guides for construction, HVAC, retail, restaurants, medical, and warehouse operations."
      heroTitle="Inventory Management by Industry"
      heroDescription="Find guides tailored to your sector — from contractors and restaurants to retail and cold storage."
      routeFilter={routeFilter}
    />
  );
}
