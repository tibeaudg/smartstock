import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, Clock, User, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationError {
  id: string;
  error_message: string;
  error_type: string | null;
  stack_trace: string | null;
  user_id: string | null;
  page_url: string | null;
  user_agent: string | null;
  created_at: string;
  error_count: number;
  component_stack: string | null;
  profiles?: {
    email: string;
  } | null;
}

export const RecentErrors: React.FC = () => {
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  const { data: errors, isLoading, refetch } = useQuery<ApplicationError[]>({
    queryKey: ['applicationErrors', filter],
    queryFn: async () => {
      let query = supabase
        .from('application_errors')
        .select(`
          *,
          profiles:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      // Apply time filter
      if (filter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      } else if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as ApplicationError[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const toggleExpand = (errorId: string) => {
    setExpandedErrors((prev) => {
      const next = new Set(prev);
      if (next.has(errorId)) {
        next.delete(errorId);
      } else {
        next.add(errorId);
      }
      return next;
    });
  };

  const getErrorTypeColor = (errorType: string | null) => {
    if (!errorType) return 'bg-slate-100 text-slate-800';
    
    const type = errorType.toLowerCase();
    if (type.includes('network') || type.includes('fetch')) {
      return 'bg-blue-100 text-blue-800';
    } else if (type.includes('timeout')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (type.includes('permission') || type.includes('unauthorized')) {
      return 'bg-red-100 text-red-800';
    } else if (type.includes('type') || type.includes('undefined')) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-slate-100 text-slate-800';
  };

  const formatErrorMessage = (message: string): string => {
    // Make error messages more user-friendly
    if (message.includes('NetworkError') || message.includes('Failed to fetch')) {
      return 'Network connection error - unable to reach server';
    }
    if (message.includes('timeout')) {
      return 'Request timeout - server took too long to respond';
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'Permission denied - insufficient access rights';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'Resource not found';
    }
    if (message.includes('500') || message.includes('Internal Server Error')) {
      return 'Server error - internal problem occurred';
    }
    // Return original message if no pattern matches
    return message;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>Application errors in plain English, not raw stack traces</CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'today' | 'week')}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="today">Today</option>
              </select>
              <button
                onClick={() => refetch()}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : !errors || errors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-900 mb-1">No errors found</p>
              <p className="text-xs text-slate-600">Errors will appear here when they occur</p>
            </div>
          ) : (
            <div className="space-y-3">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Error Message */}
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {formatErrorMessage(error.error_message)}
                          </div>
                          {error.error_type && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${getErrorTypeColor(error.error_type)}`}>
                              {error.error_type}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600 ml-8">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(error.created_at), { addSuffix: true })}</span>
                        </div>
                        {error.profiles?.email && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="truncate">{error.profiles.email}</span>
                          </div>
                        )}
                        {error.page_url && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span className="truncate text-xs">{new URL(error.page_url).pathname}</span>
                          </div>
                        )}
                        {error.error_count > 1 && (
                          <div className="text-xs text-slate-500 tabular-nums">
                            Occurred {error.error_count} times
                          </div>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {expandedErrors.has(error.id) && (
                        <div className="mt-4 ml-8 space-y-3 text-sm">
                          {error.stack_trace && (
                            <div>
                              <div className="font-semibold text-slate-700 mb-1">Stack Trace:</div>
                              <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
                                {error.stack_trace}
                              </pre>
                            </div>
                          )}
                          {error.component_stack && (
                            <div>
                              <div className="font-semibold text-slate-700 mb-1">Component Stack:</div>
                              <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
                                {error.component_stack}
                              </pre>
                            </div>
                          )}
                          {error.user_agent && (
                            <div>
                              <div className="font-semibold text-gray-700 mb-1">User Agent:</div>
                              <div className="text-xs text-slate-600">{error.user_agent}</div>
                            </div>
                          )}
                          {error.page_url && (
                            <div>
                              <div className="font-semibold text-gray-700 mb-1">Full URL:</div>
                              <div className="text-xs text-slate-600 break-all">{error.page_url}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expand/Collapse Button */}
                    {(error.stack_trace || error.component_stack) && (
                      <button
                        onClick={() => toggleExpand(error.id)}
                        className="flex-shrink-0 p-2 hover:bg-slate-200 rounded transition-colors"
                        aria-label={expandedErrors.has(error.id) ? 'Collapse' : 'Expand'}
                      >
                        {expandedErrors.has(error.id) ? (
                          <ChevronUp className="w-5 h-5 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                    )}
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

