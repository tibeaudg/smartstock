import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, Clock, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface BackgroundJob {
  id: string;
  user_id: string;
  name: string;
  export_type: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  file_path: string | null;
  file_size: number | null;
  error_message: string | null;
  email_notification: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  filters: Record<string, any>;
  columns: string[];
}

export const BackgroundJobs: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const queryClient = useQueryClient();

  // Set up real-time subscription for job updates
  useEffect(() => {
    const channel = supabase
      .channel('background-jobs-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics_export_jobs',
        },
        () => {
          // Refetch when jobs change
          queryClient.invalidateQueries({ queryKey: ['backgroundJobs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: jobs, isLoading, refetch } = useQuery<BackgroundJob[]>({
    queryKey: ['backgroundJobs', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('analytics_export_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as BackgroundJob[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = async (job: BackgroundJob) => {
    if (!job.file_path) {
      alert('No file available for download');
      return;
    }
    
    try {
      // Try to download from Supabase storage
      // Note: This assumes files are stored in Supabase storage
      // If files are stored elsewhere, this will need to be adjusted
      const { data, error } = await supabase.storage
        .from('exports')
        .download(job.file_path);

      if (error) {
        // If storage download fails, try to create a download link from file_path
        // This handles cases where file_path might be a direct URL
        if (job.file_path.startsWith('http')) {
          window.open(job.file_path, '_blank');
          return;
        }
        throw error;
      }

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${job.name}.${job.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      // If download fails, show the file_path so admin can manually access it
      alert(`Failed to download file. File path: ${job.file_path}`);
    }
  };

  const jobCounts = {
    all: jobs?.length || 0,
    pending: jobs?.filter(j => j.status === 'pending').length || 0,
    processing: jobs?.filter(j => j.status === 'processing').length || 0,
    completed: jobs?.filter(j => j.status === 'completed').length || 0,
    failed: jobs?.filter(j => j.status === 'failed').length || 0,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Background Jobs</CardTitle>
              <CardDescription>Monitor the status of critical asynchronous tasks</CardDescription>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All ({jobCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Pending ({jobCounts.pending})
            </button>
            <button
              onClick={() => setStatusFilter('processing')}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                statusFilter === 'processing'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Processing ({jobCounts.processing})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Completed ({jobCounts.completed})
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                statusFilter === 'failed'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Failed ({jobCounts.failed})
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-900 mb-1">No background jobs found</p>
              <p className="text-xs text-slate-600">Jobs will appear here when they are created</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`border rounded-lg p-4 ${getStatusColor(job.status)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Job Header */}
                      <div className="flex items-start gap-3">
                        {getStatusIcon(job.status)}
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{job.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {job.export_type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.format.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar (for processing jobs) */}
                      {job.status === 'processing' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Processing...</span>
                            <span>{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                      )}

                      {/* Error Message (for failed jobs) */}
                      {job.status === 'failed' && job.error_message && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <div className="text-sm font-semibold text-red-800 mb-1">Error:</div>
                          <div className="text-sm text-red-700">{job.error_message}</div>
                        </div>
                      )}

                      {/* Job Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600">
                        {job.started_at && (
                          <div>
                            <span className="font-medium">Started:</span>{' '}
                            {formatDistanceToNow(new Date(job.started_at), { addSuffix: true })}
                          </div>
                        )}
                        {job.completed_at && (
                          <div>
                            <span className="font-medium">Completed:</span>{' '}
                            {formatDistanceToNow(new Date(job.completed_at), { addSuffix: true })}
                          </div>
                        )}
                        {job.file_size && (
                          <div>
                            <span className="font-medium">Size:</span> {formatFileSize(job.file_size)}
                          </div>
                        )}
                        {job.email_notification && (
                          <div>
                            <span className="font-medium">Notify:</span> {job.email_notification}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      {job.status === 'completed' && job.file_path && (
                        <button
                          onClick={() => handleDownload(job)}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

