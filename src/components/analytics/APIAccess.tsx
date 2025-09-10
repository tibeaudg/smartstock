import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  RefreshCw,
  Code,
  Database,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastUsed?: string;
  usage: {
    requests: number;
    limit: number;
    resetDate: string;
  };
  expiresAt?: string;
}

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  example: string;
  response: string;
}

interface UsageStats {
  totalRequests: number;
  requestsToday: number;
  requestsThisMonth: number;
  averageResponseTime: number;
  errorRate: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
  }>;
}

export const APIAccess = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[],
    expiresAt: '',
    description: ''
  });

  const availablePermissions = [
    { value: 'read:products', label: 'Producten Lezen', description: 'Toegang tot product data' },
    { value: 'write:products', label: 'Producten Schrijven', description: 'Producten aanpassen' },
    { value: 'read:transactions', label: 'Transacties Lezen', description: 'Transactie historie' },
    { value: 'write:transactions', label: 'Transacties Schrijven', description: 'Nieuwe transacties' },
    { value: 'read:inventory', label: 'Voorraad Lezen', description: 'Voorraad status' },
    { value: 'write:inventory', label: 'Voorraad Schrijven', description: 'Voorraad aanpassen' },
    { value: 'read:analytics', label: 'Analytics Lezen', description: 'Rapportage data' },
    { value: 'admin', label: 'Admin Toegang', description: 'Volledige toegang' }
  ];

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/products',
      description: 'Haal alle producten op',
      parameters: [
        { name: 'limit', type: 'integer', required: false, description: 'Aantal resultaten (max 100)' },
        { name: 'offset', type: 'integer', required: false, description: 'Start positie' },
        { name: 'category', type: 'string', required: false, description: 'Filter op categorie' }
      ],
      example: 'GET /api/v1/products?limit=50&category=electronics',
      response: '{"products": [...], "total": 150, "limit": 50, "offset": 0}'
    },
    {
      method: 'GET',
      path: '/api/v1/products/{id}',
      description: 'Haal specifiek product op',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Product ID' }
      ],
      example: 'GET /api/v1/products/123e4567-e89b-12d3-a456-426614174000',
      response: '{"id": "...", "name": "...", "quantity": 100, ...}'
    },
    {
      method: 'POST',
      path: '/api/v1/transactions',
      description: 'Maak nieuwe transactie',
      parameters: [
        { name: 'product_id', type: 'string', required: true, description: 'Product ID' },
        { name: 'quantity', type: 'integer', required: true, description: 'Aantal' },
        { name: 'type', type: 'string', required: true, description: 'in of out' },
        { name: 'price', type: 'number', required: false, description: 'Prijs per stuk' }
      ],
      example: 'POST /api/v1/transactions {"product_id": "...", "quantity": 5, "type": "out"}',
      response: '{"id": "...", "status": "success", "transaction": {...}}'
    },
    {
      method: 'GET',
      path: '/api/v1/analytics/sales',
      description: 'Verkoop analytics',
      parameters: [
        { name: 'start_date', type: 'string', required: false, description: 'Start datum (YYYY-MM-DD)' },
        { name: 'end_date', type: 'string', required: false, description: 'Eind datum (YYYY-MM-DD)' },
        { name: 'group_by', type: 'string', required: false, description: 'Groepering (day, week, month)' }
      ],
      example: 'GET /api/v1/analytics/sales?start_date=2024-01-01&group_by=day',
      response: '{"sales": [...], "total_revenue": 15000, "period": "2024-01-01 to 2024-01-31"}'
    }
  ];

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch API keys from database
      const { data: keysData, error: keysError } = await supabase
        .from('analytics_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (keysError) {
        console.error('Error fetching API keys:', keysError);
        return;
      }

      const apiKeys: APIKey[] = keysData?.map(key => ({
        id: key.id,
        name: key.name,
        key: key.key_hash, // In real implementation, this would be the actual key
        permissions: key.permissions || [],
        status: key.status as any,
        createdAt: key.created_at,
        lastUsed: key.last_used_at,
        usage: {
          requests: key.current_usage,
          limit: key.usage_limit,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        expiresAt: key.expires_at
      })) || [];

      // Fetch usage statistics
      const { data: usageData, error: usageError } = await supabase
        .from('analytics_api_usage')
        .select(`
          endpoint,
          status_code,
          response_time,
          created_at,
          analytics_api_keys!inner(user_id)
        `)
        .eq('analytics_api_keys.user_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (usageError) {
        console.error('Error fetching usage stats:', usageError);
        return;
      }

      // Calculate usage statistics
      const totalRequests = usageData?.length || 0;
      const requestsToday = usageData?.filter(usage => 
        new Date(usage.created_at).toDateString() === new Date().toDateString()
      ).length || 0;
      
      const requestsThisMonth = usageData?.filter(usage => 
        new Date(usage.created_at).getMonth() === new Date().getMonth()
      ).length || 0;

      const averageResponseTime = usageData?.reduce((sum, usage) => 
        sum + usage.response_time, 0) / (usageData?.length || 1) || 0;

      const errorRate = usageData?.filter(usage => 
        usage.status_code >= 400
      ).length / (usageData?.length || 1) * 100 || 0;

      // Calculate top endpoints
      const endpointCounts = usageData?.reduce((acc, usage) => {
        acc[usage.endpoint] = (acc[usage.endpoint] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topEndpoints = Object.entries(endpointCounts)
        .map(([endpoint, requests]) => ({ endpoint, requests }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 5);

      const usageStats: UsageStats = {
        totalRequests,
        requestsToday,
        requestsThisMonth,
        averageResponseTime: Math.round(averageResponseTime),
        errorRate: Math.round(errorRate * 100) / 100,
        topEndpoints
      };

      setApiKeys(apiKeys);
      setUsageStats(usageStats);
    } catch (error) {
      console.error('Error fetching API data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const generateAPIKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk_live_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateKey = async () => {
    if (!user) return;

    try {
      const apiKey = generateAPIKey();
      const keyHash = btoa(apiKey); // Simple encoding, in production use proper hashing

      // Save API key to database
      const { data, error } = await supabase
        .from('analytics_api_keys')
        .insert({
          user_id: user.id,
          name: formData.name,
          key_hash: keyHash,
          permissions: formData.permissions,
          status: 'active',
          usage_limit: 10000,
          current_usage: 0,
          expires_at: formData.expiresAt || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating API key:', error);
        return;
      }

      // Create new key object for display
      const newKey: APIKey = {
        id: data.id,
        name: data.name,
        key: apiKey, // Show the actual key only once
        permissions: data.permissions,
        status: data.status,
        createdAt: data.created_at,
        usage: {
          requests: data.current_usage,
          limit: data.usage_limit,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        expiresAt: data.expires_at
      };

      setApiKeys([newKey, ...apiKeys]);
      setShowCreateForm(false);
      setFormData({ name: '', permissions: [], expiresAt: '', description: '' });
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('analytics_api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting API key:', error);
        return;
      }

      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const handleToggleKey = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Key className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">API data laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Toegang</h1>
          <p className="text-gray-600 mt-1">
            Beheer je API keys en bekijk gebruik statistieken
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe API Key
        </Button>
      </div>

      {/* Create API Key Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe API Key</CardTitle>
            <CardDescription>
              Maak een nieuwe API key aan voor externe integraties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Key Naam</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Bijv. Mobile App Integration"
                />
              </div>
              <div>
                <Label htmlFor="expiresAt">Vervaldatum (Optioneel)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {availablePermissions.map((permission) => (
                  <label key={permission.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, permissions: [...formData.permissions, permission.value] });
                        } else {
                          setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== permission.value) });
                        }
                      }}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-sm">{permission.label}</p>
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuleren
              </Button>
              <Button onClick={handleCreateKey}>
                <Key className="w-4 h-4 mr-2" />
                API Key Aanmaken
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="usage">Gebruik</TabsTrigger>
          <TabsTrigger value="docs">Documentatie</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="keys" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{key.name}</CardTitle>
                      <CardDescription>
                        Gemaakt: {new Date(key.createdAt).toLocaleDateString('nl-NL')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(key.status)}>
                        {getStatusIcon(key.status)}
                        <span className="ml-1 capitalize">{key.status}</span>
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteKey(key.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* API Key */}
                  <div>
                    <Label>API Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={showKey[key.id] ? key.key : '••••••••••••••••••••••••••••••••'}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleKey(key.id)}
                      >
                        {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(key.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {key.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Requests</p>
                      <p className="font-semibold">{key.usage.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Limiet</p>
                      <p className="font-semibold">{key.usage.limit.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Last Used */}
                  {key.lastUsed && (
                    <div className="text-sm text-gray-500">
                      Laatst gebruikt: {new Date(key.lastUsed).toLocaleString('nl-NL')}
                    </div>
                  )}

                  {/* Expires */}
                  {key.expiresAt && (
                    <div className="text-sm text-gray-500">
                      Vervalt: {new Date(key.expiresAt).toLocaleDateString('nl-NL')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-4">
          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </div>
                      <CardDescription className="mt-2">
                        {endpoint.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Parameters */}
                  {endpoint.parameters.length > 0 && (
                    <div>
                      <Label>Parameters</Label>
                      <div className="space-y-2 mt-2">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <div key={paramIndex} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <code className="text-sm font-mono">{param.name}</code>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  <div>
                    <Label>Voorbeeld</Label>
                    <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm">
                      {endpoint.example}
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <Label>Response</Label>
                    <div className="mt-2 p-3 bg-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{endpoint.response}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-4">
          {usageStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Totaal Requests</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageStats.totalRequests.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Alle tijd
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vandaag</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageStats.requestsToday.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Requests vandaag
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gem. Response</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageStats.averageResponseTime}ms</div>
                  <p className="text-xs text-muted-foreground">
                    Response tijd
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageStats.errorRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Fout percentage
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {usageStats && (
            <Card>
              <CardHeader>
                <CardTitle>Meest Gebruikte Endpoints</CardTitle>
                <CardDescription>
                  Top endpoints gebaseerd op request volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageStats.topEndpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <code className="text-sm font-mono">{endpoint.endpoint}</code>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{endpoint.requests.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">requests</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentatie</CardTitle>
              <CardDescription>
                Volledige documentatie voor de StockFlow API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Authenticatie</h3>
                <p className="text-gray-600 mb-4">
                  Alle API requests vereisen authenticatie via een API key. Voeg je API key toe aan de header:
                </p>
                <div className="p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm">
                  Authorization: Bearer sk_live_your_api_key_here
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Rate Limiting</h3>
                <p className="text-gray-600 mb-4">
                  API requests zijn beperkt tot 1000 requests per uur per API key. 
                  Rate limit headers worden toegevoegd aan alle responses:
                </p>
                <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                  X-RateLimit-Limit: 1000<br/>
                  X-RateLimit-Remaining: 999<br/>
                  X-RateLimit-Reset: 1640995200
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Error Handling</h3>
                <p className="text-gray-600 mb-4">
                  De API gebruikt standaard HTTP status codes. Errors worden geretourneerd in JSON format:
                </p>
                <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                  {`{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid parameters provided",
    "details": {...}
  }
}`}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Browser
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
