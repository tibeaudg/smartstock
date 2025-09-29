import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  BarChart3, 
  Settings, 
  Zap,
  Crown,
  TestTube,
  RefreshCw
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const PaymentTestSuite: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Fetch all modules for testing
  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('price_monthly', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get user's module access
  const { data: allAccess = {} } = useAllModuleAccess();

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    try {
      const result = await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'success', result, timestamp: new Date().toISOString() }
      }));
      toast({
        title: 'Test geslaagd',
        description: `${testName} is succesvol uitgevoerd.`,
      });
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Onbekende fout',
          timestamp: new Date().toISOString()
        }
      }));
      toast({
        title: 'Test gefaald',
        description: `${testName} is gefaald: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
        variant: 'destructive',
      });
    }
  };

  const testModuleAccess = async () => {
    if (!user) throw new Error('Gebruiker niet ingelogd');
    
    const { data, error } = await supabase
      .from('user_module_subscriptions')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) throw error;
    return data;
  };

  const testStripeConnection = async () => {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        moduleId: modules[0]?.id || 'test-module',
        billingCycle: 'monthly',
        userId: user?.id || 'test-user',
        successUrl: `${window.location.origin}/test?success=true`,
        cancelUrl: `${window.location.origin}/test?canceled=true`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stripe connection failed: ${errorText}`);
    }

    return await response.json();
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['modules'] });
    queryClient.invalidateQueries({ queryKey: ['allModuleAccess'] });
    queryClient.invalidateQueries({ queryKey: ['moduleAccess'] });
  };

  const getTestIcon = (testName: string) => {
    const result = testResults[testName];
    if (!result) return <TestTube className="w-4 h-4" />;
    if (result.status === 'success') return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'analytics': return BarChart3;
      case 'automation': return Settings;
      case 'integration': return Zap;
      case 'premium': return Crown;
      default: return Star;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Test Suite</h1>
          <p className="text-gray-600 mt-2">Test de complete payment flow en module toegang</p>
        </div>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="features">Feature Gates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gebruiker:</span>
                    <Badge variant={user ? 'default' : 'destructive'}>
                      {user ? 'Ingelogd' : 'Niet ingelogd'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Modules:</span>
                    <span>{modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actieve abonnementen:</span>
                    <span>{Object.values(allAccess).filter(access => access.hasAccess).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(testResults).map(([testName, result]) => (
                    <div key={testName} className="flex items-center justify-between">
                      <span className="text-sm">{testName}</span>
                      {getTestIcon(testName)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => runTest('Module Access', testModuleAccess)}
                  className="w-full"
                  size="sm"
                >
                  Test Module Access
                </Button>
                <Button 
                  onClick={() => runTest('Stripe Connection', testStripeConnection)}
                  className="w-full"
                  size="sm"
                  variant="outline"
                >
                  Test Stripe Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Suite</CardTitle>
              <CardDescription>Voer verschillende tests uit om de payment flow te controleren</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => runTest('Module Access Check', testModuleAccess)}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <span>Module Access</span>
                </Button>
                <Button 
                  onClick={() => runTest('Stripe API Connection', testStripeConnection)}
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                >
                  <CreditCard className="w-6 h-6 mb-2" />
                  <span>Stripe Connection</span>
                </Button>
              </div>

              {Object.entries(testResults).map(([testName, result]) => (
                <Card key={testName} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{testName}</h3>
                      <div className="flex items-center gap-2">
                        {getTestIcon(testName)}
                        <span className="text-sm text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    {result.status === 'success' ? (
                      <pre className="text-sm bg-green-50 p-2 rounded overflow-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {result.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = getModuleIcon(module.category);
              const access = allAccess[module.id];
              
              return (
                <Card key={module.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </div>
                      {access?.hasAccess && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actief
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">${module.price_monthly}</span>
                        <span className="text-sm text-gray-500">/maand</span>
                      </div>
                      
                      {access?.hasAccess ? (
                        <div className="space-y-2">
                          <div className="text-sm text-green-600">
                            ✓ Toegang tot deze module
                          </div>
                          {access.endDate && (
                            <div className="text-sm text-gray-500">
                              Verloopt: {new Date(access.endDate).toLocaleDateString('nl-NL')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Geen toegang tot deze module
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Gate Tests</CardTitle>
              <CardDescription>Test hoe features worden getoond op basis van module toegang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {modules.slice(0, 3).map((module) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">{module.title} Feature Test</h3>
                  
                  <ModuleFeatureGate
                    moduleId={module.id}
                    moduleTitle={module.title}
                    moduleDescription={module.description}
                    modulePrice={module.price_monthly}
                  >
                    <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        🎉 Premium Feature Unlocked!
                      </h4>
                      <p className="text-green-700">
                        Je hebt toegang tot deze premium functie. Dit is een voorbeeld van hoe 
                        premium content eruit ziet voor gebruikers met een actief abonnement.
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="bg-white p-2 rounded border">
                          <strong>Feature 1:</strong> Geavanceerde analytics
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <strong>Feature 2:</strong> Real-time updates
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <strong>Feature 3:</strong> Priority support
                        </div>
                      </div>
                    </div>
                  </ModuleFeatureGate>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
