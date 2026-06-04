import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, Bell, Mail, MessageSquare, Plug } from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { to: '/admin', label: 'Analytics', icon: BarChart3, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/emails', label: 'Emails', icon: Mail },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/admin/integrations', label: 'Integrations', icon: Plug },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-2">
      {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            )
          }
        >
          <Icon className="w-4 h-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminShell({ children, title = 'Admin' }: AdminShellProps) {
  return (
    <div className="flex-grow ml-6 mr-6 min-h-screen overflow-y-auto">
      <div className="w-full flex-grow space-y-6 mb-24 mt-16">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">Owner dashboard</p>
        </div>
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
