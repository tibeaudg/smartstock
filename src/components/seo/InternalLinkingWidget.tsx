import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, TrendingUp } from 'lucide-react';
import { getRelatedPages, type PageMetadata } from '@/config/topicClusters';

interface InternalLinkingWidgetProps {
  currentPath: string;
  relatedPages?: PageMetadata[];
  limit?: number;
  title?: string;
  variant?: 'sidebar' | 'footer' | 'inline';
  showDescriptions?: boolean;
  className?: string;
}

export const InternalLinkingWidget: React.FC<InternalLinkingWidgetProps> = ({
  currentPath,
  relatedPages,
  limit = 6,
  title,
  variant = 'sidebar',
  showDescriptions = true,
  className = '',
}) => {
  // Get related pages if not provided
  const pages = relatedPages || getRelatedPages(currentPath, limit);

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
    <div className={`${variantStyles[variant]} ${className} hidden`}>
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
