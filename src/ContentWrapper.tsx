import React from 'react';

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full -mx-8 px-4 lg:px-8">
    {children}
  </div>
);
