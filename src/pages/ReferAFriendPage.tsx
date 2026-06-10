import React, { useState } from 'react';
import { Copy, Check, Mail, MessageCircle, Linkedin, Link2, Users, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Referral {
  id: string;
  referred_email: string;
  status: 'pending' | 'rewarded';
  signed_up_at: string;
  rewarded_at: string | null;
}

const HOW_IT_WORKS = [
  {
    icon: Link2,
    title: 'Share your unique link',
    desc: 'Send your link to a friend, colleague, or anyone managing stock for their business.',
  },
  {
    icon: Users,
    title: 'They sign up & try Professional free for 30 days',
    desc: "Your friend gets an extended 30-day trial of Professional — double the standard 14 days.",
  },
  {
    icon: Gift,
    title: 'They stay active for 7 days',
    desc: "Once they've used StockFlow for a full week, the reward triggers automatically.",
  },
  {
    icon: Gift,
    title: 'You both get rewarded',
    desc: 'You receive 1 free month of the Professional plan. Stack unlimited referrals.',
  },
];

export default function ReferAFriendPage() {
  const { user, userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: rewardProfile } = useQuery({
    queryKey: ['referral-rewards', user?.id],
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, free_months_credit')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const referralCode = (rewardProfile ?? userProfile)?.referral_code;
  const freeMonthsCredit = (rewardProfile ?? userProfile)?.free_months_credit ?? 0;

  const referralLink = referralCode
    ? `stockflowsystems.com/join?ref=${referralCode}`
    : 'Loading your link…';

  const { data: referrals = [] } = useQuery<Referral[]>({
    queryKey: ['referrals', user?.id],
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select('id, referred_email, status, signed_up_at, rewarded_at')
        .eq('referrer_user_id', user!.id)
        .order('signed_up_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Referral[];
    },
  });

  const totalSent = referrals.length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const successfulConversions = referrals.filter(r => r.status === 'rewarded').length;

  const handleCopy = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(`https://${referralLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const shareGmail = () => {
    const subject = encodeURIComponent('Try StockFlow — free inventory management');
    const body = encodeURIComponent(
      `Hey,\n\nI've been using StockFlow to manage my inventory and thought you'd find it useful too.\n\nSign up with my link and you'll get a 30-day free trial of Professional:\nhttps://${referralLink}\n\nNo credit card needed.`
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=&su=${subject}&body=${body}`);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! I use StockFlow for inventory management — you should try it. Sign up with my link for a 30-day free trial: https://${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(`https://${referralLink}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const stats = [
    {
      label: 'Total Referrals Sent',
      value: totalSent,
      sub: totalSent === 0 ? 'Share your link to get started' : `${pendingReferrals} pending activation`,
    },
    {
      label: 'Successful Conversions',
      value: successfulConversions,
      sub: 'Referred users active for 7+ days',
    },
    {
      label: 'Free Months of Professional',
      value: freeMonthsCredit,
      sub: freeMonthsCredit > 0 ? 'Credit applied to your next bill' : '1 conversion = 1 free Professional month',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Refer a Friend</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Invite colleagues and fellow business owners — earn free months when they join StockFlow.
        </p>
      </div>

      {/* Reward banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-white font-semibold text-base">You earn. They win too.</p>
            <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
              For every friend who joins and stays active for 7 days, you both get rewarded.
            </p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
              <Users className="w-3.5 h-3.5" />
              You get 1 free month of Professional
            </span>
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
              <Gift className="w-3.5 h-3.5" />
              They get 30-day Pro trial
            </span>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {freeMonthsCredit > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 px-4 py-3 flex items-center gap-3">
          <Gift className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">
              {freeMonthsCredit} free month{freeMonthsCredit === 1 ? '' : 's'} of Professional available
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
              This credit will be applied automatically on your next billing cycle.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="text-4xl font-bold text-foreground mt-1">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-4 w-4" />
            Your referral link
          </CardTitle>
          <CardDescription>Copy and share your unique link to start earning rewards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Link + copy */}
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-3 py-2.5 min-w-0">
              <span className="text-sm font-mono text-blue-700 dark:text-blue-300 break-all">
                {referralLink}
              </span>
            </div>
            <button
              onClick={handleCopy}
              disabled={!referralCode}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={shareGmail}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground font-medium hover:bg-muted transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Gmail
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground font-medium hover:bg-muted transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground font-medium hover:bg-muted transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress to next free month</span>
              <span className="text-muted-foreground">{successfulConversions} / 1 referral</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: successfulConversions >= 1 ? '100%' : '0%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground">1 successful referral = 1 free month of Professional. No limit.</p>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referral history</CardTitle>
          <CardDescription>Track who you've referred and the status of their rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No referrals yet — share your link above to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {referrals.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.referred_email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Signed up {new Date(r.signed_up_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === 'rewarded'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {r.status === 'rewarded' ? 'Rewarded — 1 free Pro month earned' : 'Pending — waiting for 7-day activation'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
