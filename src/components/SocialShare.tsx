import React from 'react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Stockflow - Gratis Voorraadbeheer',
  description = 'Ontdek Stockflow: dé oplossing voor eenvoudig en gratis voorraadbeheer.',
  image = '/logo.png',
  className = ''
}) => {
  const shareData = {
    title,
    text: description,
    url,
  };

  const socialPlatforms = [
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
      icon: '🔗',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: '📘',
      color: 'bg-blue-800 hover:bg-blue-900'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: '🐦',
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: '📱',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
      icon: '✉️',
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleSocialShare = (platformUrl: string) => {
    window.open(platformUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Native share button (mobile) */}
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          title="Delen"
        >
          <span>📤</span>
          Delen
        </button>
      )}
      
      {/* Social platform buttons */}
      {socialPlatforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => handleSocialShare(platform.url)}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded transition-colors ${platform.color}`}
          title={`Deel op ${platform.name}`}
        >
          <span>{platform.icon}</span>
          {platform.name}
        </button>
      ))}
    </div>
  );
};

export default SocialShare; 
