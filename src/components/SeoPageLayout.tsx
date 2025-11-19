import React from 'react';
import Header from './HeaderPublic';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BreadcrumbNav } from './seo/BreadcrumbNav';
import { getBreadcrumbPath } from '@/config/topicClusters';
import Footer from './Footer';
import InternalLinkingWidget from './seo/InternalLinkingWidget';
import RelatedArticles from './seo/RelatedArticles';
import type { SidebarContent } from '@/utils/seoPageHelpers';

interface SeoPageLayoutProps {
  title: string;
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  showSidebar?: boolean;
  sidebarContent?: SidebarContent;
}

const SeoPageLayout: React.FC<SeoPageLayoutProps> = ({
  children,
  showBreadcrumbs = true,
  showSidebar = false,
  sidebarContent
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  // Get related pages from topic cluster
  const relatedPages = getRelatedPages(location.pathname, 6);
  const hasSidebar = showSidebar && Boolean(sidebarContent);
  const hasTableOfContents = Boolean(sidebarContent?.tableOfContents?.length);
  const hasSidebarRelatedArticles = Boolean(sidebarContent?.relatedArticles?.length);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onLoginClick={handleLoginClick}
        onNavigate={() => { }}
        hideAuthButtons={false}
        hideNotifications
      />
      <main className="w-full flex-grow">
        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbItems.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
        )}

        {/* Main Content with Optional Sidebar */}
        {hasSidebar ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-10">
              <div className="flex-1 min-w-0">
                {children}
                {/* Internal Linking Widget */}
                <InternalLinkingWidget
                  currentPath={location.pathname}
                  variant="inline"
                  limit={6}
                  className="my-12"
                />
              </div>
              {(hasTableOfContents || hasSidebarRelatedArticles) && sidebarContent && (
                <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-10 pt-16 lg:mt-0">
                  {hasTableOfContents && sidebarContent.tableOfContents && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm ">
                      <h2 className="text-lg font-semibold text-gray-900">
                        On this page
                      </h2>
                      <nav className="mt-4">
                        <ul className="space-y-3">
                          {sidebarContent.tableOfContents.map((item) => (
                            <li key={item.id} className="text-sm text-gray-700">
                              <a
                                href={`#${item.id}`}
                                className="block transition-colors hover:text-indigo-600"
                                style={{ paddingLeft: `${Math.max(0, item.level - 1) * 12}px` }}
                              >
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  )}

                  {hasSidebarRelatedArticles && sidebarContent.relatedArticles && (
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Related articles
                      </h2>
                      <ul className="mt-4 space-y-3">
                        {sidebarContent.relatedArticles.map((article) => (
                          <li key={article.path}>
                            <Link
                              to={article.path}
                              className="text-sm text-gray-700 transition-colors hover:text-indigo-600"
                            >
                              {article.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </aside>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
            {/* Related Articles Section */}
            <RelatedArticles articles={relatedPages} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SeoPageLayout; 
