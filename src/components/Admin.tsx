import { Outlet } from 'react-router-dom';

export const Admin = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container py-6">
        <Outlet />
      </div>
    </div>
  );
};
