import React, { memo } from 'react';

interface SEOPageHeroProps {
  title: string;
  description?: string;
  dateUpdated?: string;
  readingTime?: string;
  authorName?: string;
}

export const SEOPageHero = memo(({
  title,
  description,
  dateUpdated,
  readingTime = "12 min read",
  authorName = "Toby Gray",
}: SEOPageHeroProps) => {
  return (
    <header style={{ 
      textAlign: 'center', 
      paddingTop: '8rem',
      paddingBottom: '4rem', 
      backgroundColor: '#f8fafc', 
      borderRadius: '16px', 
      marginBottom: '1rem', 
      border: '1px solid #e2e8f0' 
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: 850, 
        color: '#0f172a', 
        letterSpacing: '-0.02em', 
        lineHeight: '1.1', 
        marginBottom: '1.5rem',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {title}
      </h1>
      
      {description && (
        <p style={{ 
          fontSize: '1.4rem', 
          color: '#475569', 
          maxWidth: '800px', 
          margin: '0 auto' 
        }}>
          {description}
        </p>
      )}

      <div style={{ 
        marginTop: '2rem', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem', 
        fontSize: '0.95rem', 
        color: '#64748b' 
      }}>
        <span><strong>Author:</strong> {authorName}</span>
        <span>•</span>
        <span><strong>Updated:</strong> {dateUpdated}</span>
        <span>•</span>
        <span><strong>Reading Time:</strong> {readingTime}</span>
      </div>
    </header>
  );
});

SEOPageHero.displayName = 'SEOPageHero';