import React, { useState, useEffect } from 'react';
import { Header } from '@/components/HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Play, ArrowRight, CheckCircle, Star, Zap, Shield, BarChart3, 
  Package, Users, Clock, Target, TrendingUp, Smartphone, 
  Monitor, Database, Settings, Download, ExternalLink, Scan,
  ShoppingCart, Truck, Plus, Edit, Trash2, Search, Filter,
  TrendingDown, AlertTriangle, CheckCircle2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { logger } from '../lib/logger';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import { SavingsCalculator } from '@/components/SavingsCalculator';

// Fade-in animation component
const FadeInWhenVisible = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

// Step component for instruction guide
const InstructionStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  isActive = false 
}: { 
  number: number; 
  title: string; 
  description: string; 
  icon: any; 
  isActive?: boolean; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: number * 0.1 }}
    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
      isActive 
        ? 'border-blue-500 bg-blue-50 shadow-lg' 
        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-500">Step {number}</span>
          {isActive && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Active</Badge>}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Feature highlight component
const FeatureHighlight = ({ 
  icon: Icon, 
  title, 
  description, 
  benefits 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  benefits: string[]; 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
    <ul className="space-y-2">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

// Mock data for demo
const mockProducts = [
  { id: 1, name: "Laptop Dell XPS 13", sku: "DELL-XPS13-001", stock: 15, price: 1299.99, category: "Electronics", lowStock: false },
  { id: 2, name: "Wireless Mouse Logitech", sku: "LOG-MOUSE-002", stock: 3, price: 29.99, category: "Accessories", lowStock: true },
  { id: 3, name: "USB-C Cable 2m", sku: "USB-C-2M-003", stock: 45, price: 12.99, category: "Cables", lowStock: false },
  { id: 4, name: "Mechanical Keyboard", sku: "KEYB-MECH-004", stock: 8, price: 89.99, category: "Accessories", lowStock: false },
  { id: 5, name: "Monitor 24\" 4K", sku: "MON-24-4K-005", stock: 0, price: 299.99, category: "Monitors", lowStock: true },
  { id: 6, name: "Webcam HD 1080p", sku: "CAM-HD-006", stock: 12, price: 79.99, category: "Accessories", lowStock: false }
];

const mockMovements = [
  { id: 1, product: "Laptop Dell XPS 13", type: "In", quantity: 5, date: "2024-01-15", user: "Demo User" },
  { id: 2, product: "Wireless Mouse Logitech", type: "Out", quantity: 2, date: "2024-01-14", user: "Demo User" },
  { id: 3, product: "USB-C Cable 2m", type: "In", quantity: 20, date: "2024-01-13", user: "Demo User" },
  { id: 4, product: "Monitor 24\" 4K", type: "Out", quantity: 3, date: "2024-01-12", user: "Demo User" }
];

// Demo Components
const DemoHeader = ({ onLogin }: { onLogin: () => void }) => (
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">StockFlow Demo</h1>
          <p className="text-sm text-gray-500">Interactive Demo Environment</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Demo Mode
        </Badge>
        <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700">
          Get Started
        </Button>
      </div>
    </div>
  </div>
);

const DemoSidebar = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'movements', label: 'Movements', icon: ShoppingCart },
    { id: 'scanner', label: 'Scanner', icon: Scan },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const DemoDashboard = () => {
  const totalProducts = mockProducts.length;
  const lowStockCount = mockProducts.filter(p => p.lowStock).length;
  const outOfStockCount = mockProducts.filter(p => p.stock === 0).length;
  const totalValue = mockProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your inventory management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
                </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMovements.slice(0, 4).map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{movement.product}</p>
                    <p className="text-sm text-gray-500">{movement.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={movement.type === 'In' ? 'default' : 'destructive'}>
                      {movement.type} {movement.quantity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProducts.filter(p => p.lowStock || p.stock === 0).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                      {product.stock} left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DemoProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const Categorys = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Products</h2>
          <p className="text-gray-600">Manage your inventory products</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
              </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Categorys.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categorys' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <Badge variant={product.lowStock ? 'destructive' : 'secondary'}>
                      {product.stock} in stock
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                  <p className="text-sm text-gray-500">Category: {product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${product.price}</p>
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const DemoMovements = () => (
  <div className="p-6 space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Stock Movements</h2>
      <p className="text-gray-600">Track all inventory movements and transactions</p>
          </div>

    <div className="space-y-4">
      {mockMovements.map((movement) => (
        <Card key={movement.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  movement.type === 'In' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {movement.type === 'In' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{movement.product}</h3>
                  <p className="text-sm text-gray-500">{movement.date} • {movement.user}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={movement.type === 'In' ? 'default' : 'destructive'}>
                  {movement.type === 'In' ? '+' : '-'}{movement.quantity}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const DemoScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = () => {
    // Simulate barcode scanning
    const mockBarcodes = ['DELL-XPS13-001', 'LOG-MOUSE-002', 'USB-C-2M-003'];
    const randomCode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    setScannedCode(randomCode);
    
    const product = mockProducts.find(p => p.sku === randomCode);
    setScanResult(product);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Barcode Scanner</h2>
        <p className="text-gray-600">Scan barcodes to quickly update inventory</p>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scanner Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Scan className="w-16 h-16 text-gray-400" />
              </div>
              <Button onClick={handleScan} className="w-full">
                <Scan className="w-4 h-4 mr-2" />
                Simulate Scan
              </Button>
            </div>
            
            {scannedCode && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Scanned Code: {scannedCode}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {scanResult && (
          <Card>
            <CardHeader>
              <CardTitle>Scan Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Product Name</Label>
                  <p className="text-lg font-semibold">{scanResult.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">SKU</Label>
                  <p className="text-sm text-gray-900">{scanResult.sku}</p>
                    </div>
                    <div>
                  <Label className="text-sm font-medium text-gray-600">Current Stock</Label>
                  <p className="text-lg font-semibold">{scanResult.stock} units</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Add Stock
                  </Button>
                  <Button size="sm" variant="outline">
                    Remove Stock
                  </Button>
                    </div>
                  </div>
            </CardContent>
          </Card>
        )}
                    </div>
                  </div>
  );
};

const DemoAnalytics = () => (
  <div className="p-6 space-y-6">
                    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
      <p className="text-gray-600">Insights and reports for your inventory</p>
                    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{product.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(product.stock / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{product.stock}</span>
                </div>
              </div>
            ))}
                    </div>
                  </CardContent>
                </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from(new Set(mockProducts.map(p => p.category))).map((category) => {
              const categoryProducts = mockProducts.filter(p => p.category === category);
              const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
              const totalValue = categoryProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);
              
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{category}</p>
                    <p className="text-sm text-gray-500">{categoryProducts.length} products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{totalStock} units</p>
                    <p className="text-sm text-gray-500">${totalValue.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
              </div>
        </CardContent>
      </Card>
                </div>
              </div>
);

export const DemoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLoginClick = () => {
    logger.info('Demo page CTA clicked', { source: 'demo_page' });
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DemoDashboard />;
      case 'products':
        return <DemoProducts />;
      case 'movements':
        return <DemoMovements />;
      case 'scanner':
        return <DemoScanner />;
      case 'analytics':
        return <DemoAnalytics />;
      default:
        return <DemoDashboard />;
    }
  };

  return (
    <>
      <SEO 
        title="Interactive Demo - StockFlow Inventory Management Software"
        description="Try StockFlow's inventory management software with our interactive demo. Experience all features with real data and see how easy it is to manage your inventory."
        keywords="interactive demo, inventory management demo, stock management software demo, try StockFlow"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Demo Header */}
        <DemoHeader onLogin={handleLoginClick} />
        
        {/* Demo Interface */}
        <div className="flex h-screen">
          <DemoSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
                </div>
              </div>
        
        {/* Demo Footer with CTA */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>This is a demo environment with sample data. <strong>Ready to get started?</strong></p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reset Demo
              </Button>
              <Button onClick={handleLoginClick} className="bg-blue-600 hover:bg-blue-700">
                <Zap className="w-4 h-4 mr-2" />
                Start Free Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoPage;
