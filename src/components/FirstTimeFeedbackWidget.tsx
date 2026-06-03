import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronUp, Star, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PLACEHOLDERS = [
  'What do you think of StockFlow so far?',
  'Is there anything you feel is missing?',
  'What could be improved?',
  'How does it compare to what you expected?',
  'Any features you wish existed?',
];

const SHOW_DELAY_MS = 8000;
const THANK_YOU_DISMISS_MS = 3000;
const MAX_CHARS = 1000;

interface Props {
  userId: string;
  userEmail: string;
  userName: string;
}

type Phase = 'pill' | 'form' | 'thanks';

export function FirstTimeFeedbackWidget({ userId, userEmail, userName }: Props) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('pill');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const dismissedRef = useRef(false);

  // Cycle placeholder text every 3.5 s
  useEffect(() => {
    if (phase !== 'form') return;
    const id = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [userId]);

  // Auto-close after thank-you
  useEffect(() => {
    if (phase !== 'thanks') return;
    const timer = setTimeout(() => setVisible(false), THANK_YOU_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleDismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
  };

  const handleSubmit = async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);

    try {
      // Primary: store in DB
      const { error: dbError } = await supabase.from('user_feedback' as any).insert({
        user_id: userId,
        email: userEmail,
        rating: rating || null,
        message: message.trim(),
      });
      if (dbError) console.warn('[feedback] db insert error', dbError);

 

      setPhase('thanks');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {phase === 'pill' && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            onClick={() => setPhase('form')}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Quick question for you</span>
            <ChevronUp className="w-3.5 h-3.5 shrink-0 opacity-70" />
          </motion.button>
        )}

        {phase === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="w-80 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground leading-tight">StockFlow</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">We'd love your feedback</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground leading-snug">
                Hey{userName ? ` ${userName}` : ''}! 👋 You've just joined StockFlow.
                We'd love to know what you think.
              </p>

              {/* Star rating */}
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">How would you rate it so far? (optional)</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n === rating ? 0 : n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          n <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                  placeholder={PLACEHOLDERS[placeholderIdx]}
                  rows={3}
                  className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <p className={`text-[10px] text-right mt-0.5 transition-colors ${message.length > MAX_CHARS * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {message.length}/{MAX_CHARS}
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || submitting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Feedback
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground">
                Your feedback helps us improve StockFlow for everyone.
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'thanks' && (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="w-72 bg-background border border-border rounded-2xl shadow-2xl p-5 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </motion.div>
            <p className="font-semibold text-foreground mb-1">Thanks for your feedback!</p>
            <p className="text-xs text-muted-foreground">
              We read every response and use it to make StockFlow better.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
