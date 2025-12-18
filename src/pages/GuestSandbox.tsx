import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { generateDemoData } from '@/lib/onboarding/generateDemoData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';

export default function GuestSandbox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoDataLoading, setDemoDataLoading] = useState(false);
  const [demoDataCreated, setDemoDataCreated] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(7);

  useEffect(() => {
    initializeGuestSession();
  }, []);

  const initializeGuestSession = async () => {
    try {
      // Check if there's a session token in URL
      const tokenFromUrl = searchParams.get('token');
      
      if (tokenFromUrl) {
        // Validate existing session
        const { data: session, error } = await supabase
          .from('guest_sessions')
          .select('*')
          .eq('session_token', tokenFromUrl)
          .single();

        if (error || !session) {
          toast.error('Invalid or expired session');
          createNewSession();
          return;
        }

        // Check if expired
        const expires = new Date(session.expires_at);
        if (expires < new Date()) {
          toast.error('This demo session has expired');
          createNewSession();
          return;
        }

        setSessionToken(tokenFromUrl);
        setExpiresAt(expires);
        setDemoDataCreated(session.demo_data_created || false);
        updateDaysRemaining(expires);
        setLoading(false);
        return;
      }

      // Create new session
      createNewSession();
    } catch (error: any) {
      console.error('Error initializing guest session:', error);
      toast.error('Failed to initialize demo session');
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      const token = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      const { data: session, error } = await supabase
        .from('guest_sessions')
        .insert({
          session_token: token,
          expires_at: expiresAt.toISOString(),
          demo_data_created: false
        })
        .select()
        .single();

      if (error) throw error;

      setSessionToken(token);
      setExpiresAt(expiresAt);
      updateDaysRemaining(expiresAt);
      
      // Update URL with token
      navigate(`/demo?token=${token}`, { replace: true });
      setLoading(false);
    } catch (error: any) {
      console.error('Error creating guest session:', error);
      toast.error('Failed to create demo session');
      setLoading(false);
    }
  };

  const updateDaysRemaining = (expires: Date) => {
    const now = new Date();
    const diff = expires.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setDaysRemaining(Math.max(0, days));
  };

  const handleCreateDemoData = async () => {
    if (!sessionToken) {
      toast.error('No session token available');
      return;
    }

    setDemoDataLoading(true);
    try {
      const result = await generateDemoData(sessionToken);

      if (result.success) {
        // Mark demo data as created
        await supabase
          .from('guest_sessions')
          .update({ demo_data_created: true })
          .eq('session_token', sessionToken);

        setDemoDataCreated(true);
        toast.success(
          `Demo data created! ${result.productsCreated} products, ${result.categoriesCreated} categories, ${result.branchesCreated} warehouses.`
        );
      } else {
        toast.error('Some errors occurred while creating demo data');
        console.error('Demo data errors:', result.errors);
      }
    } catch (error: any) {
      console.error('Error creating demo data:', error);
      toast.error('Failed to create demo data');
    } finally {
      setDemoDataLoading(false);
    }
  };

  const handleStartDemo = () => {
    // For now, redirect to signup with a note about the demo
    // In a full implementation, you'd create a guest user and log them in
    navigate('/auth?mode=register&demo=true');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up your demo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Try StockFlow Free - 7-Day Demo | StockFlow"
        description="Experience StockFlow with a free 7-day demo account. No credit card required."
        keywords="demo, trial, inventory management, free trial"
        url="https://www.stockflowsystems.com/demo"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Try StockFlow Free</CardTitle>
              <CardDescription className="text-lg">
                Experience our inventory management system with a 7-day demo account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">{daysRemaining} days remaining</span>
                </div>
                <p className="text-gray-600">
                  Your demo account expires on {expiresAt?.toLocaleDateString()}
                </p>
              </div>

              {!demoDataCreated ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">What you'll get:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>2-3 demo warehouses to explore</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>5-10 product categories with sample data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>20-30 sample products with stock levels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Sample stock movements and transactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Full access to all features for 7 days</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleCreateDemoData}
                    disabled={demoDataLoading}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {demoDataLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Demo Data...
                      </>
                    ) : (
                      <>
                        Create Demo Data
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button variant="ghost" onClick={handleStartDemo}>
                      Or sign up for a full account
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Demo Data Ready!</h3>
                    <p className="text-gray-600 mb-6">
                      Your demo account is set up with sample data. You can now explore all features.
                    </p>
                  </div>
                  <Button
                    onClick={handleStartDemo}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>No Credit Card Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This is a fully functional demo account. You can explore all features without any commitment.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>Demo data will be automatically deleted after 7 days</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

