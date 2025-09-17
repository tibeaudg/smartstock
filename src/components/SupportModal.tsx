import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Play, 
  HelpCircle, 
  Phone, 
  Mail, 
  FileText,
  ExternalLink,
  ChevronRight,
  Crown,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatModal } from './ChatModal';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
  'aria-describedby'?: string;
  resetUnreadMessages?: () => void;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  color: string;
  disabled?: boolean;
}

export const SupportModal: React.FC<SupportModalProps> = ({ 
  open, 
  onClose, 
  'aria-describedby': ariaDescribedBy,
  resetUnreadMessages
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const { userProfile } = useAuth();
  const { currentTier } = useSubscription();

  // Check plan access based on current tier
  const isGrowthOrPremium = currentTier?.name === 'groei' || currentTier?.name === 'premium';
  const isPremiumOnly = currentTier?.name === 'premium';

  const supportOptions: SupportOption[] = [
    {
      id: 'chat',
      title: 'Chat with us',
      description: 'Direct contact with our support team via chat',
      icon: MessageCircle,
      action: () => setChatOpen(true),
      color: 'bg-blue-500',
      disabled: !isGrowthOrPremium
    },
    {
      id: 'videos',
      title: 'Instructievideo\'s',
      description: 'Learn how to use StockFlow optimally',
      icon: Play,
      action: () => {
        // Open instructievideo's pagina of modal
        window.open('/instructievideos', '_blank');
      },
      color: 'bg-green-500'
    },
    {
      id: 'faq',
      title: 'Frequently asked questions',
      description: 'Find answers to frequently asked questions',
      icon: HelpCircle,
      action: () => {
        // Open FAQ pagina of modal
        window.open('/faq', '_blank');
      },
      color: 'bg-purple-500'
    },
    {
      id: 'phone',
      title: 'Call us',
      description: 'Direct phone contact with our support team',
      icon: Phone,
      action: () => setPhoneOpen(true),
      color: 'bg-orange-500',
      disabled: !isPremiumOnly
    },
    {
      id: 'email',
      title: 'Email support',
      description: 'info@stockflow.be', // TODO: Change to support@stockflow.be
      icon: Mail,
      action: () => {
        window.open('mailto:info@stockflow.be');
      },
      color: 'bg-red-500'
    },
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Extensive documentation and API documentation',
      icon: FileText,
      action: () => {
        window.open('/documentation', '_blank');
      },
      color: 'bg-indigo-500'
    }
  ];

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        aria-describedby={ariaDescribedBy}
      >
        {/* Desktop Position */}
        <div
          className="absolute top-1/2 -translate-y-1/2 hidden md:block"
          style={{ left: '50%', transform: 'translate(-50%, -50%)', width: '600px' }}
          onClick={(e) => e.stopPropagation()}
        >
        <SupportContent onClose={onClose} supportOptions={supportOptions} isGrowthOrPremium={isGrowthOrPremium} isPremiumOnly={isPremiumOnly} />
      </div>

      {/* Mobile Position */}
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <SupportContent onClose={onClose} supportOptions={supportOptions} isGrowthOrPremium={isGrowthOrPremium} isPremiumOnly={isPremiumOnly} />
        </div>
      </div>

      {/* Chat Modal - Only show for Growth and Premium users */}
      {chatOpen && isGrowthOrPremium && (
        <ChatModal 
          open={chatOpen} 
          onClose={() => setChatOpen(false)} 
          aria-describedby="chat-modal-description"
          resetUnreadMessages={resetUnreadMessages}
        />
      )}

      {/* Phone Modal - Only show for Premium users */}
      {phoneOpen && isPremiumOnly && (
        <PhoneModal 
          open={phoneOpen} 
          onClose={() => setPhoneOpen(false)} 
          aria-describedby="phone-modal-description"
        />
      )}
    </>
  );
};

interface SupportContentProps {
  onClose: () => void;
  supportOptions: SupportOption[];
  isGrowthOrPremium: boolean;
  isPremiumOnly: boolean;
}

const SupportContent: React.FC<SupportContentProps> = ({ onClose, supportOptions, isGrowthOrPremium, isPremiumOnly }) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[700px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              Support & Help
            </h2>
            <p className="text-sm text-gray-600">How can we help you?</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-10 w-10 p-0 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Support modal close"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            const isDisabled = option.disabled;
            
            return (
              <div key={option.id} className="relative group">
                <button
                  onClick={option.action}
                  disabled={isDisabled}
                  className={`
                    w-full p-4 rounded-lg border transition-all duration-200 text-left
                    ${isDisabled 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white hover:bg-gray-50'
                    }
                  `}
                  title={isDisabled ? 'Premium feature - Upgrade required' : undefined}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-10 h-10 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0 
                      ${!isDisabled ? 'group-hover:scale-105' : ''} transition-transform
                    `}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        font-semibold transition-colors
                        ${isDisabled 
                          ? 'text-gray-500' 
                          : 'text-gray-900 group-hover:text-blue-600'
                        }
                      `}>
                        {option.title}
                        {isDisabled && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            {option.id === 'chat' ? 'Growth+' : 'Premium'}
                          </span>
                        )}
                      </h3>
                      <p className={`
                        text-sm mt-1 leading-relaxed
                        ${isDisabled ? 'text-gray-500' : 'text-gray-600'}
                      `}>
                        {option.description}
                      </p>
                    </div>
                    <ChevronRight className={`
                      w-5 h-5 flex-shrink-0 transition-colors
                      ${isDisabled 
                        ? 'text-gray-300' 
                        : 'text-gray-400 group-hover:text-blue-500'
                      }
                    `} />
                  </div>
                </button>
                
                {/* Tooltip for disabled options */}
                {isDisabled && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                    {option.id === 'chat' ? 'Growth+ plan required' : 'Premium plan required'} - Upgrade to access
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>


        {/* Additional Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Quick tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use the search function to find products quickly</li>
            <li>• Scan barcodes for quick inventory updates</li>
            <li>• View your dashboard for an overview of your inventory</li>
            <li>• Set notifications to stay updated</li>
          </ul>
        </div>
      </div>

      {/* Footer */}

    </div>
  );
};

// Phone Modal Component
interface PhoneModalProps {
  open: boolean;
  onClose: () => void;
  'aria-describedby'?: string;
}

const PhoneModal: React.FC<PhoneModalProps> = ({ 
  open, 
  onClose, 
  'aria-describedby': ariaDescribedBy
}) => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '+31 20 123 4567';
  const formattedNumber = '+31201234567';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      toast.success('Phone number copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Could not copy phone number');
    }
  };

  const handleCall = () => {
    window.open(`tel:${formattedNumber}`);
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-modal-title"
      aria-describedby={ariaDescribedBy}
    >
      {/* Desktop Position */}
      <div
        className="absolute top-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: '50%', transform: 'translate(-50%, -50%)', width: '400px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <PhoneContent 
          onClose={onClose}
          phoneNumber={phoneNumber}
          onCopy={handleCopy}
          onCall={handleCall}
          copied={copied}
        />
      </div>

      {/* Mobile Position */}
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <PhoneContent 
          onClose={onClose}
          phoneNumber={phoneNumber}
          onCopy={handleCopy}
          onCall={handleCall}
          copied={copied}
        />
      </div>
    </div>
  );
};

interface PhoneContentProps {
  onClose: () => void;
  phoneNumber: string;
  onCopy: () => void;
  onCall: () => void;
  copied: boolean;
}

const PhoneContent: React.FC<PhoneContentProps> = ({
  onClose,
  phoneNumber,
  onCopy,
  onCall,
  copied
}) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto flex flex-col max-h-[500px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              Phone Support
            </h2>
            <p className="text-sm text-gray-600">Direct phone contact</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-10 w-10 p-0 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Phone modal close"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {phoneNumber}
            </h3>
            <p className="text-gray-600">
              Monday - Friday: 9:00 - 17:00
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Support for all your questions
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onCall}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
            >
              <Phone className="w-5 h-5 mr-2" />
                Call Now
            </Button>
            
            <Button
              onClick={onCopy}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Number
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Support Team</h4>
            <p className="text-sm text-blue-700">
              Our support team is ready to help you with all your questions about StockFlow. 
              We provide quick and professional support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
