import { Outlet } from 'react-router-dom';
import SEO from '@/components/SEO';

export const Admin = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <SEO
        title="Admin Dashboard | stockflow"
        description="Beheer gebruikers en instellingen in het admin dashboard van stockflow."
        keywords="admin dashboard, voorraadbeheer admin, gebruikersbeheer, stockflow"
        url="https://www.stockflow.be/admin"
      />
      <div className="py-6 px-6">
        <Outlet />
      </div>
    </div>
  );
};
