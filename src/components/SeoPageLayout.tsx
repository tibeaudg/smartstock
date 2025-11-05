import React from 'react';
import Header from './HeaderPublic';
import { useNavigate, useLocation } from 'react-router-dom';
import { BreadcrumbNav } from './seo/BreadcrumbNav';
import { getBreadcrumbPath } from '@/config/topicClusters';
import Footer from './Footer';
import { SeoSidebar, SidebarContent } from './seo/SeoSidebar';
import InternalLinkingWidget from './seo/InternalLinkingWidget';

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

  // Get breadcrumb path for current page
  const breadcrumbItems = getBreadcrumbPath(location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onLoginClick={handleLoginClick} 
        onNavigate={() => {}} 
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
        {showSidebar && sidebarContent ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-8">
              <SeoSidebar content={sidebarContent} />
              <div className="lg:col-start-2">
                {children}
                {/* Internal Linking Widget */}
                <InternalLinkingWidget
                  currentPath={location.pathname}
                  variant="inline"
                  limit={6}
                  className="my-12"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
            {/* Internal Linking Widget */}
            <InternalLinkingWidget
              currentPath={location.pathname}
              variant="inline"
              limit={6}
              className="my-12"
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SeoPageLayout; 
