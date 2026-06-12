import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  Search, 
  TestTube,
  Crown,
  Mail
} from 'lucide-react';

export const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'notifications', label: 'Notificaties', icon: Bell, path: '/admin/notifications' },
    { id: 'smtp', label: 'E-mail / SMTP', icon: Mail, path: '/admin/smtp' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/admin/chat' },
    { id: 'seo', label: 'SEO', icon: Search, path: '/admin/seo' },
    { id: 'subscriptions', label: 'Abonnementen', icon: Crown, path: '/admin/subscriptions' },
    { id: 'payment-test', label: 'Payment Test', icon: TestTube, path: '/admin/payment-test' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-full">

      


      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-6 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
