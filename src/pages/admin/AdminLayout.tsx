import React from 'react';





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
        {children}
      </div>
    </div>
  );
}
