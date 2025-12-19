import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { LeadMagnet } from '@/data/leadMagnets';

interface LeadMagnetDownloadProps {
  isOpen: boolean;
  onClose: () => void;
  leadMagnet: LeadMagnet;
}

const LeadMagnetDownload: React.FC<LeadMagnetDownloadProps> = ({
  isOpen,
  onClose,
  leadMagnet
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const IconComponent = leadMagnet.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Call API endpoint to capture lead
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: leadMagnet.source,
          metadata: {
            lead_magnet: leadMagnet.id,
            title: leadMagnet.title,
            description: leadMagnet.description
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture lead');
      }

      setIsSubmitted(true);
      
      // Trigger immediate PDF download
      const link = document.createElement('a');
      link.href = leadMagnet.pdfPath;
      link.download = `${leadMagnet.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err: any) {
      console.error('Error submitting lead:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadAgain = () => {
    const link = document.createElement('a');
    link.href = leadMagnet.pdfPath;
    link.download = `${leadMagnet.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Download Started!
            </DialogTitle>
            <DialogDescription>
              Your download should start automatically. If it doesn't, click the button below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <IconComponent className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
              <p className="text-sm text-gray-600 mb-4">
                We've sent "{leadMagnet.title}" to {email}
              </p>
              <p className="text-xs text-gray-500">
                Check your email for additional resources and updates.
              </p>
            </div>
            <Button onClick={handleDownloadAgain} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Again
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
              <DialogTitle className="text-xl">Get Your Free Download</DialogTitle>
              <DialogDescription className="mt-2">
                Enter your email to download this free resource
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <IconComponent className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">{leadMagnet.title}</h3>
                <p className="text-sm text-blue-700 mb-3">{leadMagnet.description}</p>
                {leadMagnet.points && leadMagnet.points.length > 0 && (
                  <ul className="space-y-1">
                    {leadMagnet.points.map((point, index) => (
                      <li key={index} className="flex items-center text-sm text-blue-600">
                        <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
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
                disabled={isSubmitting}
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
              {isSubmitting ? (
                <>
                  <span className="mr-2">Processing...</span>
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Free {leadMagnet.title}
                </>
              )}
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

export default LeadMagnetDownload;







