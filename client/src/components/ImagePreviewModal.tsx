import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const ImagePreviewModal = ({ isOpen, onClose, imageUrl, alt }) => {
  if (!imageUrl) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col items-center justify-center max-w-2xl w-full max-h-[90vh]">
        <img src={imageUrl} alt={alt} className="max-h-[80vh] max-w-full rounded shadow-lg" />
      </DialogContent>
    </Dialog>
  );
};
