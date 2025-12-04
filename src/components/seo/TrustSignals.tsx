import React from 'react';
import { Shield, Award, Users, Star, Lock, CheckCircle } from 'lucide-react';
import { ReviewBadges } from '@/components/trust/ReviewBadges';

interface TrustSignal {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

interface TrustSignalsProps {
  variant?: 'compact' | 'full' | 'grid';
  showUserCount?: boolean;
  showRating?: boolean;
  showSecurity?: boolean;
  showReviewBadges?: boolean;
  showCustomerLogos?: boolean;
  className?: string;
}

export const TrustSignals: React.FC<TrustSignalsProps> = ({
  variant = 'compact',
  showUserCount = true,
  showRating = true,
  showSecurity = true,
  showReviewBadges = false,
  showCustomerLogos = false,
  className = '',
}) => {
  const signals: TrustSignal[] = [];

  if (showUserCount) {
    signals.push({
      icon: <Users className="h-5 w-5" />,
      label: 'Active Users',
      value: '10,000+'
    });
  }

  if (showRating) {
    signals.push({
      icon: <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />,
      label: 'Customer Rating',
      value: '4.8/5'
    });
  }

  if (showSecurity) {
    signals.push({
      icon: <Shield className="h-5 w-5 text-green-600" />,
      label: 'Secure & Compliant',
      value: 'SOC 2'
    });
  }

  signals.push({
    icon: <Award className="h-5 w-5 text-blue-600" />,
    label: 'Trusted by',
    value: '500+ Businesses'
  });

  if (variant === 'grid') {
    const gridContent = (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {signals.map((signal, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="text-blue-600 mb-2">{signal.icon}</div>
            {signal.value && (
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {signal.value}
              </div>
            )}
            <div className="text-sm text-gray-600 text-center">
              {signal.label}
            </div>
          </div>
        ))}
      </div>
    );

    if (showReviewBadges) {
      return (
        <div className="flex flex-col gap-6">
          {gridContent}
          <div className="flex justify-center">
            <ReviewBadges variant="horizontal" />
          </div>
        </div>
      );
    }

    return gridContent;
  }

  if (variant === 'full') {
    const fullContent = (
      <div className={`flex flex-wrap items-center gap-6 ${className}`}>
        {signals.map((signal, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="text-blue-600">{signal.icon}</div>
            <div>
              {signal.value && (
                <div className="text-lg font-semibold text-gray-900">
                  {signal.value}
                </div>
              )}
              <div className="text-sm text-gray-600">{signal.label}</div>
            </div>
          </div>
        ))}
      </div>
    );

    if (showReviewBadges) {
      return (
        <div className="flex flex-col gap-4">
          {fullContent}
          <div className="mt-2">
            <ReviewBadges variant="horizontal" />
          </div>
        </div>
      );
    }

    return fullContent;
  }

  // Compact variant (default)
  const content = (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
      {signals.map((signal, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="text-blue-600">{signal.icon}</div>
          <span className="text-gray-700">
            {signal.value && <span className="font-semibold">{signal.value}</span>}
            <span className="ml-1">{signal.label}</span>
          </span>
        </div>
      ))}
    </div>
  );

  // Wrap with review badges if requested
  if (showReviewBadges) {
    return (
      <div className="flex flex-col gap-4">
        {content}
        <div className="mt-2">
          <ReviewBadges variant="compact" />
        </div>
      </div>
    );
  }

  return content;
};

export const SecurityBadges: React.FC<{ className?: string }> = ({ className = '' }) => {
  const badges = [
    { icon: <Lock className="h-5 w-5" />, text: 'SSL Encrypted' },
    { icon: <Shield className="h-5 w-5" />, text: 'GDPR Compliant' },
    { icon: <CheckCircle className="h-5 w-5" />, text: 'SOC 2 Certified' }
  ];

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="text-green-600">{badge.icon}</div>
          <span className="text-sm font-medium text-green-800">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustSignals;
