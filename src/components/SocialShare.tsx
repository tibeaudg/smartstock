import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  className?: string;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'floating';
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = 'StockFlow - Cloud-based Inventory Management Platform',
  description = 'Manage your inventory easily, quickly and smartly with StockFlow. Free for SMEs.',
  image = 'https://www.stockflowsystems.com/Inventory-Management.png',
  className = '',
  showLabels = true,
  variant = 'default'
}) => {
  const [copied, setCopied] = React.useState(false);

  const shareData = {
    url,
    title,
    description,
    image
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);
    const encodedImage = encodeURIComponent(image);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=stockflowapp`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  };

  const shareButtons = [
    {
      platform: 'facebook',
      icon: Facebook,
      label: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      platform: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-white'
    },
    {
      platform: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-white'
    },
    {
      platform: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      platform: 'email',
      icon: Mail,
      label: 'Email',
      color: 'bg-gray-600 hover:bg-gray-700',
      textColor: 'text-white'
    },
    {
      platform: 'copy',
      icon: copied ? Check : Copy,
      label: copied ? 'Copied!' : 'Copy Link',
      color: copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700',
      textColor: 'text-white'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Share2 className="h-4 w-4 text-gray-500" />
        <div className="flex gap-1">
          {shareButtons.slice(0, 4).map((button) => (
            <Button
              key={button.platform}
              size="sm"
              variant="outline"
              className={`${button.color} ${button.textColor} border-0`}
              onClick={() => handleShare(button.platform)}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className="bg-white rounded-full shadow-lg p-2 flex flex-col gap-2">
          {shareButtons.slice(0, 4).map((button) => (
            <Button
              key={button.platform}
              size="sm"
              className={`${button.color} ${button.textColor} rounded-full w-10 h-10 p-0`}
              onClick={() => handleShare(button.platform)}
              title={button.label}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Share this page
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {shareButtons.map((button) => (
          <Button
            key={button.platform}
            className={`${button.color} ${button.textColor} flex items-center gap-2`}
            onClick={() => handleShare(button.platform)}
          >
            <button.icon className="h-4 w-4" />
            {showLabels && (
              <span className="text-sm font-medium">{button.label}</span>
            )}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Help others discover StockFlow by sharing this page
      </div>
    </div>
  );
};

export default SocialShare;