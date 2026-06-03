import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminAnalyticsPage from './admin/AdminAnalyticsPage';

/** Legacy `/admin?tab=*` redirects + analytics default at `/admin` */
export default function AdminPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (!tab) return;
    const routes: Record<string, string> = {
      users: '/admin/users',
      notifications: '/admin/notifications',
      emails: '/admin/emails',
      feedback: '/admin/feedback',
      integrations: '/admin/integrations',
    };
    if (routes[tab]) {
      navigate(routes[tab], { replace: true });
    }
  }, [tab, navigate]);

  if (tab && tab !== 'chats') {
    return null;
  }

  return <AdminAnalyticsPage />;
}
