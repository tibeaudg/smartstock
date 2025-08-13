import { useState } from 'react';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const resetUnreadCount = () => setUnreadCount(0);
  // Optionally, you can add a function to increment unreadCount if needed elsewhere
  const incrementUnreadCount = () => setUnreadCount(c => c + 1);
  return { unreadCount, resetUnreadCount, incrementUnreadCount };
};
