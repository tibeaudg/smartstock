import React from 'react';

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="">
    {children}
  </div>
);
