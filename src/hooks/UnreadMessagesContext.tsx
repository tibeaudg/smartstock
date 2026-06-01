import React, { createContext, useContext } from 'react';

interface UnreadMessagesContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  resetUnreadCount: () => Promise<void>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

const noop = async () => {};

export const UnreadMessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UnreadMessagesContext.Provider value={{ unreadCount: 0, refreshUnreadCount: noop, resetUnreadCount: noop }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error('useUnreadMessages must be used within an UnreadMessagesProvider');
  }
  return context;
};
