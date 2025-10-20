import React from 'react';
import Header from './HeaderPublic';
import Footer from './Footer';

interface BlogLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ 
  children, 
  title
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onLoginClick={() => {}} 
        hideAuthButtons 
        simplifiedNav 
        hideNotifications
      />
      
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden flex-shrink-0">
        <img
          src="/optimized/seo.png"
          alt="Blog header"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {title && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl text-center px-4">
              {title}
            </h1>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <article className="blog-content prose prose-lg prose-blue">
            {children}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};
