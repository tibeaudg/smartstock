import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database,
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  Mail,
  Share2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ExportJob {
  id: string;
  name: string;
  type: 'products' | 'transactions' | 'inventory' | 'financial' | 'custom';
  format: 'excel' | 'csv' | 'pdf' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  fileSize?: string;
  downloadUrl?: string;
  filters: {
    dateRange: string;
    categories: string[];
    products: string[];
    branches: string[];
    customQuery?: string;
  };
  columns: string[];
  emailNotification?: string;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  columns: string[];
  filters: any;
  isDefault: boolean;
}

export const ExportData = () => {
  const { user } = useAuth();
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'products' as const,
    format: 'excel' as const,
    dateRange: '30d',
    categories: [] as string[],
    products: [] as string[],
    branches: [] as string[],
    columns: [] as string[],
    customQuery: '',
    emailNotification: '',
    includeCharts: false,
    includeSummary: true
  });

  const availableColumns = {
    products: [
      'ID', 'Naam', 'Beschrijving', 'Categorie', 'Voorraad', 'Min. Voorraad', 
      'Prijs', 'Kostprijs', 'Leverancier', 'Locatie', 'Barcode', 'Gemaakt op'
    ],
    transactions: [
      'ID', 'Datum', 'Type', 'Product', 'Aantal', 'Prijs', 'Totaal', 
      'Gebruiker', 'Filial', 'Referentie', 'Notities'
    ],
    inventory: [
      'Product ID', 'Product Naam', 'Categorie', 'Huidige Voorraad', 
      'Min. Voorraad', 'Max. Voorraad', 'Locatie', 'Laatste Beweging', 
      'Status', 'Waarde'
    ],
    financial: [
      'Periode', 'Omzet', 'Kosten', 'Winst', 'Marges', 'Belastingen', 
      'Transacties', 'Gem. Transactie Waarde', 'Top Producten'
    ],
    custom: ['Alle beschikbare velden']
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet, description: 'Voor analyse en rapportage' },
    { value: 'csv', label: 'CSV (.csv)', icon: FileText, description: 'Voor import in andere systemen' },
    { value: 'pdf', label: 'PDF (.pdf)', icon: FileText, description: 'Voor presentatie en archivering' },
    { value: 'json', label: 'JSON (.json)', icon: Database, description: 'Voor API integraties' }
  ];

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch export jobs from database
      const { data: jobsData, error: jobsError } = await supabase
        .from('analytics_export_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) {
        console.error('Error fetching export jobs:', jobsError);
        return;
      }

      const exportJobs: ExportJob[] = jobsData?.map(job => ({
        id: job.id,
        name: job.name,
        type: job.export_type as any,
        format: job.format as any,
        status: job.status as any,
        progress: job.progress,
        createdAt: job.created_at,
        completedAt: job.completed_at,
        fileSize: job.file_size ? `${(job.file_size / 1024 / 1024).toFixed(1)} MB` : undefined,
        downloadUrl: job.file_path,
        filters: job.filters || {
          dateRange: '30d',
          categories: [],
          products: [],
          branches: []
        },
        columns: job.columns || [],
        emailNotification: job.email_notification
      })) || [];

      // Create default templates
      const templates: ExportTemplate[] = [
        {
          id: '1',
          name: 'Standaard Producten Export',
          description: 'Basis producten export met alle belangrijke velden',
          type: 'products',
          format: 'excel',
          columns: ['ID', 'Naam', 'Categorie', 'Voorraad', 'Prijs'],
          filters: { dateRange: '30d' },
          isDefault: true
        },
        {
          id: '2',
          name: 'Transacties Maandoverzicht',
          description: 'Maandelijkse transacties voor financiële analyse',
          type: 'transactions',
          format: 'csv',
          columns: ['Datum', 'Type', 'Product', 'Aantal', 'Prijs', 'Totaal'],
          filters: { dateRange: '30d' },
          isDefault: false
        },
        {
          id: '3',
          name: 'Voorraad Audit',
          description: 'Volledige voorraad status voor auditing',
          type: 'inventory',
          format: 'pdf',
          columns: ['Product', 'Voorraad', 'Min. Voorraad', 'Status', 'Locatie'],
          filters: { dateRange: '7d' },
          isDefault: false
        }
      ];

      setExportJobs(exportJobs);
      setTemplates(templates);
    } catch (error) {
      console.error('Error fetching export data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateExport = async () => {
    if (!user) return;
    
    setProcessing(true);
    try {
      // Create export job in database
      const { data: jobData, error: jobError } = await supabase
        .from('analytics_export_jobs')
        .insert({
          user_id: user.id,
          name: formData.name || `${formData.type} Export - ${new Date().toLocaleDateString('nl-NL')}`,
          export_type: formData.type,
          format: formData.format,
          status: 'processing',
          progress: 0,
          filters: {
            dateRange: formData.dateRange,
            categories: formData.categories,
            products: formData.products,
            branches: formData.branches,
            customQuery: formData.customQuery
          },
          columns: formData.columns,
          email_notification: formData.emailNotification
        })
        .select()
        .single();

      if (jobError) {
        console.error('Error creating export job:', jobError);
        return;
      }

      setShowCreateForm(false);

      // Start processing the export
      await processExportJob(jobData.id);
    } catch (error) {
      console.error('Error creating export:', error);
    } finally {
      setProcessing(false);
    }
  };

  const processExportJob = async (jobId: string) => {
    try {
      // Update progress
      await supabase
        .from('analytics_export_jobs')
        .update({ 
          progress: 25,
          started_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Fetch data based on export type
      let exportData = [];
      const { data: jobData } = await supabase
        .from('analytics_export_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (!jobData) return;

      // Update progress
      await supabase
        .from('analytics_export_jobs')
        .update({ progress: 50 })
        .eq('id', jobId);

      // Generate data based on export type
      if (jobData.export_type === 'products') {
        const { data: productsData } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            current_stock,
            min_stock,
            unit_price,
            status,
            location,
            created_at,
            categories(name),
            suppliers(name)
          `)
          .eq('user_id', user?.id);

        exportData = productsData?.map(product => ({
          ID: product.id,
          Naam: product.name,
          Beschrijving: product.description,
          Voorraad: product.current_stock,
          'Min. Voorraad': product.min_stock,
          Prijs: product.unit_price,
          Status: product.status,
          Locatie: product.location,
          Categorie: product.categories?.name || 'Geen categorie',
          Leverancier: product.suppliers?.name || 'Geen leverancier',
          'Aangemaakt': new Date(product.created_at).toLocaleDateString('nl-NL')
        })) || [];
      } else if (jobData.export_type === 'transactions') {
        const days = jobData.filters?.dateRange === '7d' ? 7 : 
                    jobData.filters?.dateRange === '30d' ? 30 : 
                    jobData.filters?.dateRange === '90d' ? 90 : 365;
        
        const { data: transactionsData } = await supabase
          .from('stock_transactions')
          .select(`
            id,
            transaction_type,
            quantity,
            reason,
            reference,
            created_at,
            products!inner(name, unit_price)
          `)
          .eq('user_id', user?.id)
          .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        exportData = transactionsData?.map(transaction => ({
          ID: transaction.id,
          Datum: new Date(transaction.created_at).toLocaleDateString('nl-NL'),
          Type: transaction.transaction_type,
          Product: transaction.products?.name || 'Onbekend',
          Aantal: transaction.quantity,
          Prijs: transaction.products?.unit_price || 0,
          Totaal: transaction.quantity * (transaction.products?.unit_price || 0),
          Reden: transaction.reason,
          Referentie: transaction.reference
        })) || [];
      } else if (jobData.export_type === 'inventory') {
        const { data: inventoryData } = await supabase
          .from('products')
          .select(`
            id,
            name,
            current_stock,
            min_stock,
            max_stock,
            location,
            status,
            categories(name)
          `)
          .eq('user_id', user?.id)
          .eq('status', 'active');

        exportData = inventoryData?.map(product => ({
          'Product ID': product.id,
          'Product Naam': product.name,
          'Huidige Voorraad': product.current_stock,
          'Min. Voorraad': product.min_stock,
          'Max. Voorraad': product.max_stock,
          'Locatie': product.location,
          'Status': product.current_stock <= product.min_stock ? 'Laag' : 
                   product.current_stock <= product.min_stock * 1.5 ? 'Waarschuwing' : 'OK',
          'Categorie': product.categories?.name || 'Geen categorie'
        })) || [];
      }

      // Update progress
      await supabase
        .from('analytics_export_jobs')
        .update({ progress: 75 })
        .eq('id', jobId);

      // Simulate file generation (in real implementation, this would generate actual files)
      const fileSize = JSON.stringify(exportData).length;
      const fileName = `${jobData.name.toLowerCase().replace(/\s+/g, '-')}.${jobData.format}`;

      // Update job as completed
      await supabase
        .from('analytics_export_jobs')
        .update({
          status: 'completed',
          progress: 100,
          file_path: `/exports/${fileName}`,
          file_size: fileSize,
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Refresh export jobs
      await fetchData();
    } catch (error) {
      console.error('Error processing export job:', error);
      
      // Update job as failed
      await supabase
        .from('analytics_export_jobs')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', jobId);
    }
  };


  const handleUseTemplate = (template: ExportTemplate) => {
    setFormData({
      name: template.name,
      type: template.type as any,
      format: template.format as any,
      dateRange: template.filters.dateRange || '30d',
      categories: [],
      products: [],
      branches: [],
      columns: template.columns,
      customQuery: '',
      emailNotification: '',
      includeCharts: false,
      includeSummary: true
    });
    setShowCreateForm(true);
  };

  const handleDeleteJob = (jobId: string) => {
    setExportJobs(exportJobs.filter(job => job.id !== jobId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    const formatOption = formatOptions.find(opt => opt.value === format);
    return formatOption ? <formatOption.icon className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Download className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Export data laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
          <p className="text-gray-600 mt-1">
            Exporteer je voorraad en verkoop data in verschillende formaten
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} disabled={processing}>
          <Download className="w-4 h-4 mr-2" />
          Nieuwe Export
        </Button>
      </div>

      {/* Create Export Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe Data Export</CardTitle>
            <CardDescription>
              Configureer je export met filters en opties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Export Naam</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Bijv. Producten Export Jan 2024"
                />
              </div>
              <div>
                <Label htmlFor="type">Data Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">Producten</SelectItem>
                    <SelectItem value="transactions">Transacties</SelectItem>
                    <SelectItem value="inventory">Voorraad</SelectItem>
                    <SelectItem value="financial">Financieel</SelectItem>
                    <SelectItem value="custom">Aangepast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <Label>Export Format</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                {formatOptions.map((format) => (
                  <div
                    key={format.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.format === format.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, format: format.value as any })}
                  >
                    <div className="flex items-center space-x-3">
                      <format.icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">{format.label}</p>
                        <p className="text-xs text-gray-500">{format.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="all">Alle data</SelectItem>
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
              <div>
                <Label>Geselecteerde Kolommen</Label>
                <div className="flex flex-wrap gap-2 mt-2">
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

            {/* Custom Query */}
            {formData.type === 'custom' && (
              <div>
                <Label htmlFor="customQuery">Aangepaste Query (SQL)</Label>
                <Textarea
                  id="customQuery"
                  value={formData.customQuery}
                  onChange={(e) => setFormData({ ...formData, customQuery: e.target.value })}
                  placeholder="SELECT * FROM products WHERE..."
                  rows={4}
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              <Label>Export Opties</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.includeSummary}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, includeSummary: checked as boolean })
                    }
                  />
                  <span className="text-sm">Inclusief samenvatting</span>
                </label>
                {formData.format === 'excel' && (
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.includeCharts}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, includeCharts: checked as boolean })
                      }
                    />
                    <span className="text-sm">Inclusief grafieken</span>
                  </label>
                )}
              </div>
            </div>

            {/* Email Notification */}
            <div>
              <Label htmlFor="email">E-mail Notificatie (Optioneel)</Label>
              <Input
                id="email"
                type="email"
                value={formData.emailNotification}
                onChange={(e) => setFormData({ ...formData, emailNotification: e.target.value })}
                placeholder="email@company.com"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuleren
              </Button>
              <Button onClick={handleCreateExport} disabled={processing}>
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verwerken...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Starten
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Export Templates</CardTitle>
          <CardDescription>
            Gebruik voorgedefinieerde templates voor snelle exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  {template.isDefault && (
                    <Badge variant="secondary">Standaard</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  {getFormatIcon(template.format)}
                  <span>{template.format.toUpperCase()}</span>
                  <span>•</span>
                  <span>{template.columns.length} kolommen</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUseTemplate(template)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Gebruiken
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Export Jobs</CardTitle>
          <CardDescription>
            Huidige en voltooide export taken
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportJobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getFormatIcon(job.format)}
                    <div>
                      <h4 className="font-medium">{job.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>{job.format.toUpperCase()}</span>
                        <span>•</span>
                        <span>{job.columns.length} kolommen</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1 capitalize">{job.status}</span>
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Verwerken...</span>
                      <span>{Math.round(job.progress)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Gemaakt: {new Date(job.createdAt).toLocaleString('nl-NL')}</span>
                    {job.completedAt && (
                      <span>Voltooid: {new Date(job.completedAt).toLocaleString('nl-NL')}</span>
                    )}
                    {job.fileSize && (
                      <span>Grootte: {job.fileSize}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {job.status === 'completed' && job.downloadUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                    {job.emailNotification && (
                      <Button size="sm" variant="ghost">
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
