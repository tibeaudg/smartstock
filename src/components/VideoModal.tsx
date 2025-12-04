import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string; // YouTube/Vimeo URL or embed URL
}

// Default demo video URL - can be configured via environment variable
const DEFAULT_VIDEO_URL = import.meta.env.VITE_DEMO_VIDEO_URL || 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Replace with actual demo video

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  const videoSrc = videoUrl || DEFAULT_VIDEO_URL;

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Convert YouTube URL to embed format if needed
  const getEmbedUrl = (url: string): string => {
    // If already an embed URL, return as is
    if (url.includes('/embed/')) {
      return url;
    }

    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // If no match, return as is (assume it's already an embed URL)
    return url;
  };

  const embedUrl = getEmbedUrl(videoSrc);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={onClose}
          aria-label="Close video modal"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Video Container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="StockFlow Demo Video"
          />
        </div>

        {/* Optional: Add a title or description below video */}
        <div className="p-4 bg-gray-900 text-white">
          <h3 id="video-modal-title" className="text-lg font-semibold mb-2">
            StockFlow Inventory Management Demo
          </h3>
          <p className="text-sm text-gray-300">
            See how StockFlow helps Medical Device Distributors, Event Companies, and Rental Businesses manage their inventory efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

