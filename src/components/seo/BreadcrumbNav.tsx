import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, className = '' }) => {
  // Generate enhanced Schema.org BreadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://www.stockflowsystems.com${item.path}`
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <nav 
        className={`flex items-center space-x-2 text-sm text-gray-600 py-3 px-4 bg-gray-50/50 rounded-lg ${className}`}
        aria-label="Breadcrumb"
      >
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            {index === items.length - 1 ? (
              <span 
                className="font-medium text-gray-900 flex items-center gap-1"
                aria-current="page"
              >
                {index === 0 && <Home className="h-4 w-4" />}
                {item.name}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-blue-600 transition-colors flex items-center gap-1 hover:underline"
              >
                {index === 0 && <Home className="h-4 w-4" />}
                {item.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default BreadcrumbNav;

