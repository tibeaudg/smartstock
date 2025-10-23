import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Star, Heart, ThumbsUp } from 'lucide-react';

interface FirstProductFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstProductFeedbackModal: React.FC<FirstProductFeedbackModalProps> = ({
  isOpen,
  onClose
}) => {
  console.log('[FirstProductFeedbackModal] Props received:', { isOpen });
  const { user } = useAuth();
  const [step, setStep] = useState<'rating' | 'feedback' | 'success'>('rating');
  const [recommendationScore, setRecommendationScore] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreSelect = (score: number) => {
    setRecommendationScore(score);
    setStep('feedback');
  };

  const handleSubmit = async () => {
    if (!user || !recommendationScore) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          recommendation_score: recommendationScore,
          feedback_text: feedbackText.trim() || null,
          trigger_context: 'first_product_added'
        });

      if (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Failed to submit feedback. Please try again.');
        return;
      }

      setStep('success');
      toast.success('Thank you for your feedback!');
      
      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setStep('rating');
        setRecommendationScore(null);
        setFeedbackText('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
    // Reset state for next time
    setStep('rating');
    setRecommendationScore(null);
    setFeedbackText('');
  };

  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Not likely';
    if (score <= 6) return 'Somewhat likely';
    if (score <= 8) return 'Very likely';
    return 'Extremely likely';
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'bg-red-100 text-red-700 border-red-200';
    if (score <= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (score <= 8) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'rating' && '🎉 Congratulations on adding your first product!'}
            {step === 'feedback' && 'Help us improve'}
            {step === 'success' && 'Thank you!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'rating' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                How likely are you to recommend our platform to others?
              </p>
              <p className="text-xs text-gray-500 mb-6">
                (1 = Not at all likely, 10 = Extremely likely)
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <Button
                  key={score}
                  variant={recommendationScore === score ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleScoreSelect(score)}
                  className={`h-10 w-10 p-0 ${
                    recommendationScore === score 
                      ? getScoreColor(score)
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {score}
                </Button>
              ))}
            </div>

            {recommendationScore && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {getScoreLabel(recommendationScore)}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'feedback' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback" className="text-sm font-medium">
                What are we missing or what could be better?
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Your feedback helps us improve the platform (optional)
              </p>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('rating')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Thank you for your feedback!
              </p>
              <p className="text-sm text-gray-600">
                Your input helps us make the platform better for everyone.
              </p>
            </div>
          </div>
        )}

        {step !== 'success' && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={handleSkip} size="sm">
              Skip
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
