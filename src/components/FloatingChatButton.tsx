import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FloatingChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed z-50 bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
    aria-label="Open chat"
    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
  >
    <MessageCircle className="w-6 h-6" />
  </button>
);
