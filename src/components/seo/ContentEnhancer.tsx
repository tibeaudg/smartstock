import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { getAllSeoPages, type PageMetadata } from '@/config/topicClusters';
import DOMPurify from 'dompurify';

interface ContentEnhancerProps {
  content: string;
  currentPath: string;
  maxLinks?: number;
}

/**
 * Enhances content with natural internal linking
 * Finds keywords and links them to relevant SEO pages
 */
export const ContentEnhancer: React.FC<ContentEnhancerProps> = ({
  content,
  currentPath,
  maxLinks = 5
}) => {
  const allPages = React.useMemo(() => getAllSeoPages(), []);
  
  // Find relevant pages based on keywords in content
  const relevantPages = React.useMemo(() => {
    const contentLower = content.toLowerCase();
    const scoredPages = allPages
      .filter(page => page.path !== currentPath)
      .map(page => {
        let score = 0;
        const titleLower = page.title?.toLowerCase() || '';
        const descLower = page.description?.toLowerCase() || '';
        
        // Score based on keyword matches
        const keywords = titleLower.split(/\s+/).filter(k => k.length > 4);
        keywords.forEach(keyword => {
          if (contentLower.includes(keyword)) {
            score += 2;
          }
        });
        
        // Boost score for related terms
        const relatedTerms = [
          'inventory', 'stock', 'warehouse', 'management', 'tracking',
          'software', 'system', 'solution', 'tool'
        ];
        relatedTerms.forEach(term => {
          if (titleLower.includes(term) && contentLower.includes(term)) {
            score += 1;
          }
        });
        
        return { page, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxLinks)
      .map(item => item.page);
    
    return scoredPages;
  }, [content, currentPath, allPages, maxLinks]);

  // Simple keyword linking (basic implementation)
  const enhancedContent = React.useMemo(() => {
    if (relevantPages.length === 0) return content;
    
    let enhanced = content;
    const usedLinks = new Set<string>();
    
    // Create links for relevant pages (limit to avoid over-linking)
    relevantPages.slice(0, 3).forEach(page => {
      if (usedLinks.has(page.path)) return;
      
      const title = page.title || '';
      const keywords = title.split(/\s+/).filter(k => k.length > 5);
      
      keywords.forEach(keyword => {
        // Only link first occurrence and if not already a link
        const regex = new RegExp(`\\b${keyword}\\b(?![^<]*</a>)`, 'i');
        if (regex.test(enhanced) && usedLinks.size < 3) {
          enhanced = enhanced.replace(
            regex,
            `<a href="${page.path}" class="text-blue-600 hover:text-blue-800 hover:underline font-medium" data-internal-link="true">${keyword}</a>`
          );
          usedLinks.add(page.path);
        }
      });
    });
    
    return enhanced;
  }, [content, relevantPages]);

  // Security: Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = React.useMemo(() => {
    return DOMPurify.sanitize(enhancedContent, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'class', 'data-internal-link'],
      ALLOW_DATA_ATTR: true
    });
  }, [enhancedContent]);

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

/**
 * Component to add contextual internal links at the end of sections
 */
export const ContextualLinks: React.FC<{
  currentPath: string;
  sectionKeywords?: string[];
  maxLinks?: number;
}> = ({ currentPath, sectionKeywords = [], maxLinks = 3 }) => {
  const allPages = React.useMemo(() => getAllSeoPages(), []);
  
  const contextualPages = React.useMemo(() => {
    if (sectionKeywords.length === 0) return [];
    
    return allPages
      .filter(page => page.path !== currentPath)
      .map(page => {
        let score = 0;
        const titleLower = (page.title || '').toLowerCase();
        const descLower = (page.description || '').toLowerCase();
        
        sectionKeywords.forEach(keyword => {
          const keywordLower = keyword.toLowerCase();
          if (titleLower.includes(keywordLower)) score += 3;
          if (descLower.includes(keywordLower)) score += 1;
        });
        
        return { page, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxLinks)
      .map(item => item.page);
  }, [allPages, currentPath, sectionKeywords, maxLinks]);

  if (contextualPages.length === 0) return null;

  return (
    <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-blue-600" />
        Related Topics
      </h3>
      <ul className="space-y-2">
        {contextualPages.map((page) => (
          <li key={page.path}>
            <Link
              to={page.path}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-2"
            >
              {page.title}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

