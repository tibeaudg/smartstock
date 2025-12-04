import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, TrendingUp, Layers, Package, DollarSign, Zap } from 'lucide-react';
import { getRelatedPages, type PageMetadata, findClusterForPage } from '@/config/topicClusters';
import { getContextualLinks, getPageCategory } from '@/config/internalLinking';

interface InternalLinkingWidgetProps {
  currentPath: string;
  relatedPages?: PageMetadata[];
  limit?: number;
  title?: string;
  variant?: 'sidebar' | 'footer' | 'inline' | 'pillar' | 'cluster' | 'product';
  showDescriptions?: boolean;
  className?: string;
  showProductLinks?: boolean;
}

export const InternalLinkingWidget: React.FC<InternalLinkingWidgetProps> = ({
  currentPath,
  relatedPages,
  limit = 6,
  title,
  variant = 'sidebar',
  showDescriptions = true,
  className = '',
  showProductLinks = true,
}) => {
  // Detect if this is a pillar or cluster page
  const cluster = findClusterForPage(currentPath);
  const isPillar = cluster?.pillar.path === currentPath;
  
  // Get contextual links for product/pillar pages
  const contextualLinks = getContextualLinks(currentPath, isPillar, cluster || undefined);
  
  // Get related pages if not provided
  const pages = relatedPages || getRelatedPages(currentPath, limit);

  // Handle special variants
  if (variant === 'pillar' || variant === 'cluster' || variant === 'product') {
    const links = variant === 'product' 
      ? { primary: contextualLinks.primary, secondary: [] }
      : contextualLinks;

    const variantStyles = {
      pillar: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6',
      cluster: 'bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6',
      product: 'bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm',
    };

    const titleStyles = {
      pillar: 'text-2xl font-bold text-blue-900 mb-6',
      cluster: 'text-xl font-bold text-gray-900 mb-4',
      product: 'text-xl font-bold text-blue-900 mb-4',
    };

    return (
      <div className={`${variantStyles[variant]} ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          {variant === 'pillar' && <Layers className="h-6 w-6 text-blue-600" />}
          {variant === 'cluster' && <TrendingUp className="h-5 w-5 text-blue-600" />}
          {variant === 'product' && <Zap className="h-5 w-5 text-blue-600" />}
          <h3 className={titleStyles[variant]}>
            {title || (variant === 'pillar' ? 'Explore StockFlow' : 'Related Resources')}
          </h3>
        </div>

        {/* Primary links */}
        {links.primary && links.primary.length > 0 && (
          <div className="mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              {links.primary.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                  aria-label={link.label}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    {link.path === '/features' && <Package className="h-5 w-5 text-blue-600" />}
                    {link.path === '/pricing' && <DollarSign className="h-5 w-5 text-blue-600" />}
                    {link.path !== '/features' && link.path !== '/pricing' && (
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {link.label}
                    </div>
                    {link.description && (
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Secondary links */}
        {links.secondary && links.secondary.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Related Pages
            </h4>
            <ul className="space-y-2">
              {links.secondary.map((link, index) => (
                <li key={link.path || index}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Original variant handling for backward compatibility
  if (!pages || pages.length === 0) {
    return null;
  }

  const variantStyles = {
    sidebar: 'bg-gray-50 border border-gray-200 rounded-lg p-6',
    footer: 'bg-gray-900 text-white rounded-lg p-6',
    inline: 'bg-blue-50 border-2 border-blue-200 rounded-lg p-6'
  };

  const titleStyles = {
    sidebar: 'text-xl font-bold text-gray-900 mb-4',
    footer: 'text-xl font-bold text-white mb-4',
    inline: 'text-xl font-bold text-blue-900 mb-4'
  };

  const linkStyles = {
    sidebar: 'text-blue-600 hover:text-blue-800 hover:underline',
    footer: 'text-blue-300 hover:text-white hover:underline',
    inline: 'text-blue-700 hover:text-blue-900 hover:underline'
  };

  const descriptionStyles = {
    sidebar: 'text-sm text-gray-600',
    footer: 'text-sm text-gray-300',
    inline: 'text-sm text-blue-800'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {(variant === 'sidebar' || variant === 'inline') && (
          <TrendingUp className="h-5 w-5 text-blue-600" />
        )}
        {(variant === 'footer') && (
          <FileText className="h-5 w-5 text-blue-300" />
        )}
        <h3 className={titleStyles[variant]}>
          {title || 'Related Articles'}
        </h3>
      </div>

      <ul className="space-y-4">
        {pages.slice(0, limit).map((page, index) => (
          <li key={page.path || index}>
            <Link
              to={page.path}
              className={`flex items-start gap-3 group ${linkStyles[variant]}`}
            >
              <ArrowRight className={`h-5 w-5 mt-0.5 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                variant === 'footer' ? 'text-blue-300' : 'text-blue-600'
              }`} />
              <div className="flex-1">
                <div className="font-semibold mb-1">
                  {page.title}
                </div>
                {showDescriptions && page.description && (
                  <p className={descriptionStyles[variant]}>
                    {page.description}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InternalLinkingWidget;
