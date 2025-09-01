import React from 'react';
import { Header } from './HeaderPublic';
import { useNavigate } from 'react-router-dom';

interface SeoPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const SeoPageLayout: React.FC<SeoPageLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onLoginClick={handleLoginClick} hideAuthButtons={false} hideNotifications />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default SeoPageLayout; 
