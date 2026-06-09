import React, { memo } from 'react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOPageHeroProps {
  title: string;
  description?: string;
  dateUpdated?: string;
  readingTime?: string;
  authorName?: string;
  breadcrumbItems?: BreadcrumbItem[];
}

export const SEOPageHero = memo(({
  title,
  description,
  breadcrumbItems = []
}: SEOPageHeroProps) => {
  return (
    <header style={{ 
      textAlign: 'center', 
      paddingTop: '2rem',
      paddingBottom: '4rem', 
      backgroundColor: '#f8fafc', 
      borderRadius: '16px', 
      marginBottom: '1rem', 
      border: '1px solid #e2e8f0' 
    }}>

      {breadcrumbItems.length > 0 && (
        <nav aria-label="Breadcrumb" style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', justifyContent: 'center' }}>
          {breadcrumbItems.map((item, index) => (
            <span key={item.url || item.name} style={{ color: '#2563eb', fontSize: '0.95rem' }}>
              <a href={item.url} style={{ color: '#2563eb', textDecoration: 'none' }}>{item.name}</a>
              {index < breadcrumbItems.length - 1 && <span aria-hidden="true"> / </span>}
            </span>
          ))}
        </nav>
      )}
      

      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: 850, 
        color: '#0f172a', 
        letterSpacing: '-0.02em', 
        lineHeight: '1.1', 
        marginBottom: '1.5rem',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {title}
      </h1>


      {description && (
        <p style={{ 
          fontSize: '1rem', 
          color: '#475569', 
          maxWidth: '800px', 
          margin: '0 auto' 
        }}>
          {description}
        </p>
      )}


    </header>
  );
});

SEOPageHero.displayName = 'SEOPageHero';