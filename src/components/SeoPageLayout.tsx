import React from 'react';
import { Header } from './Header';

interface SeoPageLayoutProps {
  title: string;
  image: string;
  children: React.ReactNode;
}

const SeoPageLayout: React.FC<SeoPageLayoutProps> = ({ title, image, children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onLoginClick={() => {}} hideAuthButtons />
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-transparent pointer-events-none" />
      </div>
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 w-full">
        {children}
      </main>
    </div>
  );
};

export default SeoPageLayout; 