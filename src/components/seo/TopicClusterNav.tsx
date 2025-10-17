import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import type { TopicCluster } from '@/config/topicClusters';

interface TopicClusterNavProps {
  cluster: TopicCluster;
  currentPath: string;
  className?: string;
}

export const TopicClusterNav: React.FC<TopicClusterNavProps> = ({ 
  cluster, 
  currentPath,
  className = '' 
}) => {
  const language = cluster.pillar.language;
  const title = language === 'nl' ? 'In Deze Gids' : 'In This Guide';
  const pillarLabel = language === 'nl' ? 'Hoofdgids' : 'Main Guide';

  return (
    <aside className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>

      {/* Pillar Page */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 block">
          {pillarLabel}
        </span>
        <Link
          to={cluster.pillar.path}
          className={`block p-3 rounded-lg transition-all ${
            currentPath === cluster.pillar.path
              ? 'bg-blue-50 border-2 border-blue-500 font-semibold text-blue-700'
              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm">{cluster.pillar.title}</span>
            {currentPath !== cluster.pillar.path && (
              <ArrowRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </Link>
      </div>

      {/* Cluster Pages */}
      {cluster.clusters.length > 0 && (
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            {language === 'nl' ? 'Gerelateerde Onderwerpen' : 'Related Topics'}
          </span>
          <nav className="space-y-1">
            {cluster.clusters.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                  currentPath === page.path
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="line-clamp-1">{page.title}</span>
                  {currentPath === page.path && (
                    <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></span>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
};

export default TopicClusterNav;

