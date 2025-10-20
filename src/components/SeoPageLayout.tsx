import React from 'react';
import Header from './HeaderPublic';
import { useNavigate, useLocation } from 'react-router-dom';
import { BreadcrumbNav } from './seo/BreadcrumbNav';
import { getBreadcrumbPath } from '@/config/topicClusters';
import Footer from './Footer';

interface SeoPageLayoutProps {
  title: string;
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

const SeoPageLayout: React.FC<SeoPageLayoutProps> = ({ 
  children, 
  showBreadcrumbs = true 
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
        
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SeoPageLayout; 
