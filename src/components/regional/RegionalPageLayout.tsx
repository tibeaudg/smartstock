import React from 'react';
import { Header } from '../HeaderPublic';
import { useNavigate } from 'react-router-dom';

interface RegionalPageLayoutProps {
  children: React.ReactNode;
}

const RegionalPageLayout: React.FC<RegionalPageLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onLoginClick={handleLoginClick} 
        onNavigate={() => {}} 
        hideAuthButtons={false} 
        hideNotifications 
      />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default RegionalPageLayout;

