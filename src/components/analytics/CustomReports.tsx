import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Settings,
  Save,
  Play
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'inventory' | 'financial' | 'custom';
  format: 'table' | 'chart' | 'both';
  chartType?: 'bar' | 'line' | 'pie';
  filters: {
    dateRange: string;
    categories: string[];
    products: string[];
    branches: string[];
  };
  columns: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    email: string;
  };
  createdAt: string;
  lastRun?: string;
}

interface SavedReport {
  id: string;
  templateId: string;
  name: string;
  data: any[];
  generatedAt: string;
  format: 'pdf' | 'excel' | 'csv';
}

export const CustomReports = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'sales' as const,
    format: 'table' as const,
    chartType: 'bar' as const,
    dateRange: '30d',
    categories: [] as string[],
    products: [] as string[],
    branches: [] as string[],
    columns: [] as string[],
    schedule: {
      frequency: 'monthly' as const,
      time: '09:00',
      email: ''
    }
  });

  const availableColumns = {
    sales: ['Datum', 'Product', 'Aantal', 'Omzet', 'Klant', 'Filial'],
    inventory: ['Product', 'Categorie', 'Voorraad', 'Min. Voorraad', 'Locatie', 'Laatste Beweging'],
    financial: ['Periode', 'Omzet', 'Kosten', 'Winst', 'Marges', 'Belastingen'],
    custom: ['Alle beschikbare velden']
  };

  const chartTypes = [
    { value: 'bar', label: 'Staafdiagram', icon: BarChart3 },
    { value: 'line', label: 'Lijndiagram', icon: LineChart },
    { value: 'pie', label: 'Cirkeldiagram', icon: PieChart }
  ];

  const fetchTemplates = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch templates from database
      const { data: templatesData, error: templatesError } = await supabase
        .from('analytics_queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (templatesError) {
        console.error('Error fetching templates:', templatesError);
        return;
      }

      const templates: ReportTemplate[] = templatesData?.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        type: template.query_type as any,
        format: 'both',
        chartType: 'bar',
        filters: template.parameters || {
          dateRange: '30d',
          categories: [],
          products: [],
          branches: []
        },
        columns: ['Datum', 'Product', 'Aantal', 'Omzet'], // Default columns
        createdAt: template.created_at.split('T')[0],
        lastRun: template.updated_at.split('T')[0]
      })) || [];

      // Fetch saved reports from database
      const { data: reportsData, error: reportsError } = await supabase
        .from('analytics_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
        return;
      }

      const savedReports: SavedReport[] = reportsData?.map(report => ({
        id: report.id,
        templateId: report.id, // Using report ID as template ID for now
        name: report.name,
        data: report.data || [],
        generatedAt: report.created_at,
        format: report.format as any
      })) || [];

      setTemplates(templates);
      setSavedReports(savedReports);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const handleCreateTemplate = async () => {
    if (!user) return;

    try {
      // Generate SQL query based on form data
      let querySql = '';
      if (formData.type === 'sales') {
        querySql = `
          SELECT 
            DATE(st.created_at) as datum,
            p.name as product,
            st.quantity as aantal,
            (st.quantity * p.unit_price) as omzet
          FROM stock_transactions st
          JOIN products p ON st.product_id = p.id
          WHERE st.user_id = '${user.id}'
            AND st.transaction_type = 'out'
            AND st.created_at >= NOW() - INTERVAL '${formData.dateRange}'
          ORDER BY st.created_at DESC
        `;
      } else if (formData.type === 'inventory') {
        querySql = `
          SELECT 
            p.name as product,
            c.name as categorie,
            p.current_stock as voorraad,
            p.min_stock as min_voorraad,
            CASE 
              WHEN p.current_stock <= p.min_stock THEN 'Laag'
              WHEN p.current_stock <= p.min_stock * 1.5 THEN 'Waarschuwing'
              ELSE 'OK'
            END as status
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.user_id = '${user.id}'
            AND p.status = 'active'
          ORDER BY p.current_stock ASC
        `;
      } else if (formData.type === 'financial') {
        querySql = `
          SELECT 
            DATE_TRUNC('week', st.created_at) as periode,
            COUNT(*) as transacties,
            SUM(st.quantity * p.unit_price) as omzet,
            SUM(st.quantity * p.unit_price * 0.7) as kosten,
            SUM(st.quantity * p.unit_price * 0.3) as winst,
            (SUM(st.quantity * p.unit_price * 0.3) / SUM(st.quantity * p.unit_price) * 100) as marges
          FROM stock_transactions st
          JOIN products p ON st.product_id = p.id
          WHERE st.user_id = '${user.id}'
            AND st.transaction_type = 'out'
            AND st.created_at >= NOW() - INTERVAL '${formData.dateRange}'
          GROUP BY DATE_TRUNC('week', st.created_at)
          ORDER BY periode DESC
        `;
      }

      // Save template to database
      const { data, error } = await supabase
        .from('analytics_queries')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          query_type: formData.type,
          query_sql: querySql,
          parameters: {
            dateRange: formData.dateRange,
            categories: formData.categories,
            products: formData.products,
            branches: formData.branches
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
        return;
      }

      // Refresh templates
      await fetchTemplates();
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      format: template.format,
      chartType: template.chartType || 'bar',
      dateRange: template.filters.dateRange,
      categories: template.filters.categories,
      products: template.filters.products,
      branches: template.filters.branches,
      columns: template.columns,
      schedule: template.schedule || { frequency: 'monthly', time: '09:00', email: '' }
    });
    setShowCreateForm(true);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;

    const updatedTemplates = templates.map(template =>
      template.id === editingTemplate.id
        ? {
            ...template,
            name: formData.name,
            description: formData.description,
            type: formData.type,
            format: formData.format,
            chartType: formData.chartType,
            filters: {
              dateRange: formData.dateRange,
              categories: formData.categories,
              products: formData.products,
              branches: formData.branches
            },
            columns: formData.columns,
            schedule: formData.schedule
          }
        : template
    );

    setTemplates(updatedTemplates);
    setShowCreateForm(false);
    setEditingTemplate(null);
    resetForm();
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  const handleRunReport = async (template: ReportTemplate) => {
    if (!user) return;

    try {
      // Create report record
      const { data: reportData, error: reportError } = await supabase
        .from('analytics_reports')
        .insert({
          user_id: user.id,
          name: `${template.name} - ${new Date().toLocaleDateString('nl-NL')}`,
          description: template.description,
          report_type: template.type,
          format: 'pdf',
          filters: template.filters,
          columns: template.columns,
          status: 'processing'
        })
        .select()
        .single();

      if (reportError) {
        console.error('Error creating report:', reportError);
        return;
      }

      // Execute the query and get data
      const { data: queryData, error: queryError } = await supabase
        .from('analytics_queries')
        .select('query_sql')
        .eq('id', template.id)
        .single();

      if (queryError || !queryData) {
        console.error('Error fetching query:', queryError);
        return;
      }

      // Execute the SQL query (this would need to be done via a stored procedure or RPC)
      // For now, we'll simulate the data based on the template type
      let reportDataResult = [];
      if (template.type === 'sales') {
        const { data: salesData } = await supabase
          .from('stock_transactions')
          .select(`
            created_at,
            quantity,
            products!inner(name, unit_price)
          `)
          .eq('user_id', user.id)
          .eq('transaction_type', 'out')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        reportDataResult = salesData?.map(transaction => ({
          datum: new Date(transaction.created_at).toLocaleDateString('nl-NL'),
          product: transaction.products?.name || 'Onbekend',
          aantal: transaction.quantity,
          omzet: transaction.quantity * (transaction.products?.unit_price || 0)
        })) || [];
      } else if (template.type === 'inventory') {
        const { data: inventoryData } = await supabase
          .from('products')
          .select(`
            name,
            current_stock,
            min_stock,
            categories(name)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('current_stock', { ascending: true });

        reportDataResult = inventoryData?.map(product => ({
          product: product.name,
          categorie: product.categories?.name || 'Geen categorie',
          voorraad: product.current_stock,
          min_voorraad: product.min_stock,
          status: product.current_stock <= product.min_stock ? 'Laag' : 
                  product.current_stock <= product.min_stock * 1.5 ? 'Waarschuwing' : 'OK'
        })) || [];
      }

      // Update the report with the data
      await supabase
        .from('analytics_reports')
        .update({
          data: reportDataResult,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', reportData.id);

      // Refresh reports
      await fetchTemplates();
    } catch (error) {
      console.error('Error running report:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'sales',
      format: 'table',
      chartType: 'bar',
      dateRange: '30d',
      categories: [],
      products: [],
      branches: [],
      columns: [],
      schedule: {
        frequency: 'monthly',
        time: '09:00',
        email: ''
      }
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800';
      case 'inventory': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Rapport templates laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Rapporten</h1>
          <p className="text-gray-600 mt-1">
            Maak en beheer aangepaste rapporten voor je voorraad en verkoop
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Rapport
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTemplate ? 'Rapport Bewerken' : 'Nieuw Rapport Maken'}
            </CardTitle>
            <CardDescription>
              Configureer je aangepaste rapport met filters en opties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Rapport Naam</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Bijv. Maandelijkse Verkoop Rapport"
                />
              </div>
              <div>
                <Label htmlFor="type">Rapport Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Verkoop</SelectItem>
                    <SelectItem value="inventory">Voorraad</SelectItem>
                    <SelectItem value="financial">Financieel</SelectItem>
                    <SelectItem value="custom">Aangepast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschrijf wat dit rapport bevat..."
                rows={3}
              />
            </div>

            {/* Format Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Rapport Format</Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.format === 'table'}
                      onCheckedChange={(checked) => 
                        checked && setFormData({ ...formData, format: 'table' })
                      }
                    />
                    <span className="text-sm">Tabel</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.format === 'chart'}
                      onCheckedChange={(checked) => 
                        checked && setFormData({ ...formData, format: 'chart' })
                      }
                    />
                    <span className="text-sm">Grafiek</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.format === 'both'}
                      onCheckedChange={(checked) => 
                        checked && setFormData({ ...formData, format: 'both' })
                      }
                    />
                    <span className="text-sm">Beide</span>
                  </label>
                </div>
              </div>

              {formData.format !== 'table' && (
                <div>
                  <Label>Grafiek Type</Label>
                  <Select
                    value={formData.chartType}
                    onValueChange={(value: any) => setFormData({ ...formData, chartType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Filters */}
            <div>
              <Label>Filters</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="dateRange">Tijdsperiode</Label>
                  <Select
                    value={formData.dateRange}
                    onValueChange={(value) => setFormData({ ...formData, dateRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Laatste 7 dagen</SelectItem>
                      <SelectItem value="30d">Laatste 30 dagen</SelectItem>
                      <SelectItem value="90d">Laatste 90 dagen</SelectItem>
                      <SelectItem value="1y">Laatste jaar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="columns">Kolommen</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (!formData.columns.includes(value)) {
                        setFormData({ ...formData, columns: [...formData.columns, value] });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer kolommen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns[formData.type].map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.columns.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.columns.map((column, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{column}</span>
                        <button
                          onClick={() => setFormData({ 
                            ...formData, 
                            columns: formData.columns.filter((_, i) => i !== index) 
                          })}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div>
              <Label>Automatische Planning (Optioneel)</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="frequency">Frequentie</Label>
                  <Select
                    value={formData.schedule.frequency}
                    onValueChange={(value: any) => 
                      setFormData({ 
                        ...formData, 
                        schedule: { ...formData.schedule, frequency: value } 
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Dagelijks</SelectItem>
                      <SelectItem value="weekly">Wekelijks</SelectItem>
                      <SelectItem value="monthly">Maandelijks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Tijd</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.schedule.time}
                    onChange={(e) => 
                      setFormData({ 
                        ...formData, 
                        schedule: { ...formData.schedule, time: e.target.value } 
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.schedule.email}
                    onChange={(e) => 
                      setFormData({ 
                        ...formData, 
                        schedule: { ...formData.schedule, email: e.target.value } 
                      })
                    }
                    placeholder="rapporten@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => {
                setShowCreateForm(false);
                setEditingTemplate(null);
                resetForm();
              }}>
                Annuleren
              </Button>
              <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                <Save className="w-4 h-4 mr-2" />
                {editingTemplate ? 'Bijwerken' : 'Opslaan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge className={getTypeColor(template.type)}>
                  {template.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Template Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Format:</span>
                    <span className="font-medium">{template.format}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Kolommen:</span>
                    <span className="font-medium">{template.columns.length}</span>
                  </div>
                  {template.schedule && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Planning:</span>
                      <span className="font-medium">{template.schedule.frequency}</span>
                    </div>
                  )}
                  {template.lastRun && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Laatste run:</span>
                      <span className="font-medium">
                        {new Date(template.lastRun).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRunReport(template)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Uitvoeren
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saved Reports */}
      {savedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Opgeslagen Rapporten</CardTitle>
            <CardDescription>
              Recent gegenereerde rapporten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-gray-500">
                        Gegenereerd: {new Date(report.generatedAt).toLocaleString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
