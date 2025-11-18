import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface ChurnFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChurnFeedbackModal: React.FC<ChurnFeedbackModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [churnReason, setChurnReason] = useState('');
  const [missingFeatures, setMissingFeatures] = useState('');
  const [expectationGap, setExpectationGap] = useState('');
  const [priorityFeature, setPriorityFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit feedback.');
      return;
    }

    // All fields are optional but we want at least some feedback
    if (!churnReason.trim() && !missingFeatures.trim() && !expectationGap.trim() && !priorityFeature.trim()) {
      toast.error('Please provide at least some feedback to help us improve.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          recommendation_score: 1, // Required field, set to 1 for churn
          feedback_text: null,
          trigger_context: 'churn',
          churn_reason: churnReason.trim() || null,
          missing_features: missingFeatures.trim() || null,
          expectation_gap: expectationGap.trim() || null,
          priority_feature: priorityFeature.trim() || null,
          churn_trigger_date: new Date().toISOString(),
          feedback_delivered_via: 'login_modal'
        });

      if (error) {
        console.error('Error submitting churn feedback:', error);
        toast.error('Failed to submit feedback. Please try again.');
        return;
      }

      toast.success('Thank you for your feedback. We appreciate your input.');
      
      // Close modal after submission
      setTimeout(() => {
        onClose();
        // Reset form
        setChurnReason('');
        setMissingFeatures('');
        setExpectationGap('');
        setPriorityFeature('');
      }, 1000);
    } catch (error) {
      console.error('Error submitting churn feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent closing without submission - modal is mandatory
  const handleOpenChange = (open: boolean) => {
    // Don't allow closing the modal - user must submit feedback
    if (!open) {
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            We'd Love Your Feedback
          </DialogTitle>
          <DialogDescription>
            We noticed you haven't used the platform yet. Your feedback helps us understand what we can improve.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="churn_reason" className="text-sm font-medium">
              What is the primary reason you haven't started using the platform?
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Help us understand what prevented you from getting started
            </p>
            <Textarea
              id="churn_reason"
              placeholder="e.g., Too complex, missing features, unclear how to start..."
              value={churnReason}
              onChange={(e) => setChurnReason(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div>
            <Label htmlFor="missing_features" className="text-sm font-medium">
              What features did you expect that were unavailable?
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Tell us about features you were looking for
            </p>
            <Textarea
              id="missing_features"
              placeholder="e.g., Integration with X, specific reporting, mobile app..."
              value={missingFeatures}
              onChange={(e) => setMissingFeatures(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div>
            <Label htmlFor="expectation_gap" className="text-sm font-medium">
              What was the discrepancy between your expectations and the platform reality?
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              How did the platform differ from what you expected?
            </p>
            <Textarea
              id="expectation_gap"
              placeholder="e.g., Expected simpler interface, thought it would have Y feature..."
              value={expectationGap}
              onChange={(e) => setExpectationGap(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div>
            <Label htmlFor="priority_feature" className="text-sm font-medium">
              What is the highest-priority feature you would need to start using the platform?
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              What would make you come back and use StockFlow?
            </p>
            <Textarea
              id="priority_feature"
              placeholder="e.g., Better onboarding, specific integration, simpler setup..."
              value={priorityFeature}
              onChange={(e) => setPriorityFeature(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

