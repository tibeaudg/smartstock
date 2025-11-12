import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Download, Wine, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeadMagnetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  leadMagnetTitle?: string;
  leadMagnetDescription?: string;
}

const LeadMagnet: React.FC<LeadMagnetProps> = ({
  isOpen,
  onClose,
  title = "Get Your Free Wine Shop Inventory Guide",
  description = "Learn how to reduce dead stock by 40% and prevent expired wine losses",
  leadMagnetTitle = "The Wine Shop Owner's Guide to Reducing Dead Stock by 40%",
  leadMagnetDescription = "A comprehensive 15-page guide covering:"
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const guidePoints = [
    "How to identify wines approaching expiry",
    "5 strategies to move slow-moving inventory",
    "Setting up automated reorder points",
    "Multi-location inventory management",
    "Supplier relationship optimization",
    "Case studies from successful wine shops"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Insert lead into Supabase
      const { error: insertError } = await supabase
        .from('leads')
        .insert([
          {
            email: email,
            source: 'wine-shop-guide',
            created_at: new Date().toISOString(),
            metadata: {
              lead_magnet: 'wine-shop-guide',
              title: leadMagnetTitle
            }
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setIsSubmitted(true);
      
      // In a real implementation, you would:
      // 1. Send the PDF via email
      // 2. Add to email marketing list
      
    } catch (err) {
      console.error('Error submitting lead:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would download the actual PDF
    console.log('Downloading wine shop guide...');
    // For now, we'll just close the modal
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Success!
            </DialogTitle>
            <DialogDescription>
              Your guide has been sent to your email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Wine className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600 mb-4">
                We've sent "{leadMagnetTitle}" to {email}
              </p>
            </div>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Guide Now
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription className="mt-2">
                {description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Magnet Preview */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Wine className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">{leadMagnetTitle}</h3>
                <p className="text-sm text-red-700 mb-3">{leadMagnetDescription}</p>
                <ul className="space-y-1">
                  {guidePoints.map((point, index) => (
                    <li key={index} className="flex items-center text-sm text-red-600">
                      <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Get Free Guide'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By downloading, you agree to receive occasional emails from StockFlow. 
              Unsubscribe anytime.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadMagnet;
