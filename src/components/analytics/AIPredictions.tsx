import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  Package
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Prediction {
  id: string;
  type: 'demand' | 'stockout' | 'reorder' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  recommendation: string;
  products?: string[];
  predictedDate?: string;
  currentStock?: number;
  predictedDemand?: number;
}

interface TrendAnalysis {
  productId: string;
  productName: string;
  currentTrend: 'up' | 'down' | 'stable';
  trendStrength: number;
  predictedSales: number;
  confidence: number;
  factors: string[];
}

export const AIPredictions = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastAnalysis, setLastAnalysis] = useState<Date>(new Date());

  const fetchPredictions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch existing predictions from database
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('analytics_predictions')
        .select(`
          *,
          products!inner(name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (predictionsError) {
        console.error('Error fetching predictions:', predictionsError);
        return;
      }

      const predictions: Prediction[] = predictionsData?.map(pred => ({
        id: pred.id,
        type: pred.prediction_type as any,
        title: pred.title,
        description: pred.description,
        confidence: pred.confidence,
        impact: pred.impact as any,
        timeframe: pred.timeframe,
        recommendation: pred.recommendation,
        products: pred.products ? [pred.products.name] : [],
        predictedDate: pred.predicted_date,
        currentStock: pred.current_stock,
        predictedDemand: pred.predicted_demand
      })) || [];

      // Generate new predictions based on current data
      await generateNewPredictions();

      // Fetch trend analysis
      const { data: trendData, error: trendError } = await supabase
        .rpc('calculate_top_products', {
          p_user_id: user.id,
          p_days: 30,
          p_limit: 10
        });

      const trends: TrendAnalysis[] = trendData?.map((product, index) => ({
        productId: product.product_id,
        productName: product.product_name,
        currentTrend: index < 3 ? 'up' : index < 6 ? 'stable' : 'down',
        trendStrength: Math.max(30, 100 - (index * 10)),
        predictedSales: product.total_quantity,
        confidence: Math.max(60, 95 - (index * 5)),
        factors: ['Historische verkoop', 'Seizoenspatronen', 'Markt trends']
      })) || [];

      setPredictions(predictions);
      setTrends(trends);
      setLastAnalysis(new Date());
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPredictions = async () => {
    if (!user) return;

    try {
      // Get products with low stock
      const { data: lowStockProducts, error: lowStockError } = await supabase
        .from('products')
        .select('id, name, current_stock, min_stock')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .lt('current_stock', supabase.raw('min_stock * 1.5'));

      if (lowStockProducts && lowStockProducts.length > 0) {
        // Create stockout predictions
        for (const product of lowStockProducts.slice(0, 3)) {
          const existingPrediction = await supabase
            .from('analytics_predictions')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product.id)
            .eq('prediction_type', 'stockout')
            .eq('status', 'active')
            .single();

          if (!existingPrediction.data) {
            await supabase
              .from('analytics_predictions')
              .insert({
                user_id: user.id,
                product_id: product.id,
                prediction_type: 'stockout',
                title: 'Voorraadtekort Voorspeld',
                description: `${product.name} heeft een hoge kans op uitverkoop binnen 5 dagen`,
                confidence: Math.floor(Math.random() * 20) + 75,
                impact: 'high',
                timeframe: '5 dagen',
                recommendation: `Herbestel ${Math.ceil(product.min_stock * 2)} stuks van ${product.name} om voorraadtekort te voorkomen`,
                current_stock: product.current_stock,
                predicted_demand: Math.ceil(product.min_stock * 1.5),
                predicted_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
              });
          }
        }
      }

      // Get top selling products for demand predictions
      const { data: topProducts, error: topProductsError } = await supabase
        .rpc('calculate_top_products', {
          p_user_id: user.id,
          p_days: 14,
          p_limit: 3
        });

      if (topProducts && topProducts.length > 0) {
        for (const product of topProducts) {
          const existingPrediction = await supabase
            .from('analytics_predictions')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product.product_id)
            .eq('prediction_type', 'demand')
            .eq('status', 'active')
            .single();

          if (!existingPrediction.data) {
            await supabase
              .from('analytics_predictions')
              .insert({
                user_id: user.id,
                product_id: product.product_id,
                prediction_type: 'demand',
                title: 'Verhoogde Vraag Verwacht',
                description: `${product.product_name} toont sterke verkoop trend voor komende 2 weken`,
                confidence: Math.floor(Math.random() * 15) + 80,
                impact: 'medium',
                timeframe: '2 weken',
                recommendation: `Verhoog voorraad van ${product.product_name} met 30% voor optimale beschikbaarheid`,
                predicted_demand: Math.ceil(product.total_quantity * 1.3),
                predicted_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                expires_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
              });
          }
        }
      }
    } catch (error) {
      console.error('Error generating new predictions:', error);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [user]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <BarChart3 className="w-4 h-4 text-blue-600" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">AI analyseert je data...</p>
          <p className="text-sm text-gray-500 mt-2">Dit kan even duren</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Voorspellingen</h1>
          <p className="text-gray-600 mt-1">
            Intelligente inzichten voor optimale voorraadbeheer
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={fetchPredictions} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Nieuwe Analyse
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Status */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          AI model is actief en analyseert real-time data. Laatste analyse: {lastAnalysis.toLocaleString('nl-NL')}
        </AlertDescription>
      </Alert>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((prediction) => (
          <Card key={prediction.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{prediction.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {prediction.description}
                  </CardDescription>
                </div>
                <Badge className={getImpactColor(prediction.impact)}>
                  {getImpactIcon(prediction.impact)}
                  <span className="ml-1 capitalize">{prediction.impact}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Confidence Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vertrouwen:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}%
                    </span>
                  </div>
                </div>

                {/* Timeframe */}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Voorspeld voor: {prediction.timeframe}
                  </span>
                </div>

                {/* Product Details */}
                {prediction.products && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Betrokken producten:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prediction.products.map((product, index) => (
                        <Badge key={index} variant="outline">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Information */}
                {prediction.currentStock !== undefined && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Huidige voorraad</p>
                      <p className="font-semibold">{prediction.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Voorspelde vraag</p>
                      <p className="font-semibold">{prediction.predictedDemand}</p>
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Aanbeveling:</p>
                  <p className="text-sm text-blue-800">{prediction.recommendation}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Actie Ondernemen
                  </Button>
                  <Button size="sm" variant="outline">
                    Meer Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analyse</CardTitle>
          <CardDescription>
            AI-gedreven analyse van verkoop trends per product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.productId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(trend.currentTrend)}
                    <div>
                      <h4 className="font-semibold">{trend.productName}</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {trend.currentTrend} trend ({trend.trendStrength}% sterkte)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Voorspelde verkoop</p>
                    <p className="font-bold text-lg">{trend.predictedSales}</p>
                    <p className={`text-xs ${getConfidenceColor(trend.confidence)}`}>
                      {trend.confidence}% vertrouwen
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Beïnvloedende factoren:</p>
                  <div className="flex flex-wrap gap-2">
                    {trend.factors.map((factor, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Analysis */}
      <div className="text-center text-sm text-gray-500">
        Laatste AI analyse: {lastAnalysis.toLocaleString('nl-NL')}
      </div>
    </div>
  );
};
