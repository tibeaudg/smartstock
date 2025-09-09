import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { 
  FileText, 
  Bell, 
  MessageSquare, 
  Search, 
  CreditCard,
  TestTube,
  Settings,
  Users,
  BarChart3
} from 'lucide-react';

export const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'cms', label: 'CMS', icon: FileText, path: '/admin/cms' },
    { id: 'notifications', label: 'Notificaties', icon: Bell, path: '/admin/notifications' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/admin/chat' },
    { id: 'seo', label: 'SEO', icon: Search, path: '/admin/seo' },
    { id: 'payment-test', label: 'Payment Test', icon: TestTube, path: '/admin/payment-test' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-full">
      <SEO
        title="Admin Dashboard | stockflow"
        description="Beheer gebruikers en instellingen in het admin dashboard van stockflow."
        keywords="admin dashboard, voorraadbeheer admin, gebruikersbeheer, stockflow"
        url="https://www.stockflow.be/admin"
      />
      
      {/* Admin Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Beheer en configuratie</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={isActive(item.path) ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-6 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
