import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { AdminShell } from './AdminLayout';

interface FeedbackEntry {
  id: string;
  user_id: string;
  email: string;
  rating: number | null;
  message: string;
  created_at: string;
}

function FeedbackContent() {
  const { data: feedbackList = [], isLoading } = useQuery<FeedbackEntry[]>({
    queryKey: ['adminFeedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_feedback' as any)
        .select('id, user_id, email, rating, message, created_at')
        .order('created_at', { ascending: false })
        .range(0, 499);
      if (error) throw error;
      return (data ?? []) as FeedbackEntry[];
    },
  });

  const rated = feedbackList.filter(f => f.rating);
  const avgRating = rated.length
    ? rated.reduce((sum, f) => sum + (f.rating ?? 0), 0) / rated.length
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return <div className="text-center py-16 text-slate-400">No feedback submitted yet.</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        {feedbackList.length} response{feedbackList.length !== 1 ? 's' : ''}
        {avgRating != null && (
          <span className="ml-2 text-yellow-600 font-medium">
            {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))} {avgRating.toFixed(1)} avg
          </span>
        )}
      </p>
      <div className="space-y-3">
        {feedbackList.map(entry => (
          <Card key={entry.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-slate-800">{entry.email}</span>
                    {entry.rating != null && (
                      <span className="text-yellow-500 text-sm">
                        {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{entry.message}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0 mt-0.5">
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminFeedbackPage() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && userProfile.is_owner !== true) navigate('/dashboard');
  }, [userProfile, navigate]);

  return (
    <BranchProvider>
      <SEO title="Feedback | stockflow" url="https://www.stockflowsystems.com/admin/feedback" />
      <Layout currentTab="admin" onTabChange={() => {}} userRole="admin" userProfile={userProfile} variant="admin">
        <AdminShell title="User Feedback">
          <FeedbackContent />
        </AdminShell>
      </Layout>
    </BranchProvider>
  );
}
