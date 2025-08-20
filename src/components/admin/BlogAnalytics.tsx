import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { getBlogAnalyticsSummary, getBlogAnalyticsBySlug } from '../../integrations/supabase/client';
import type { BlogAnalyticsSummary, BlogAnalytics } from '../../integrations/supabase/types';

export default function BlogAnalytics() {
  const [analytics, setAnalytics] = useState<BlogAnalyticsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState<BlogAnalytics[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getBlogAnalyticsSummary();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDetailedAnalytics = async (slug: string) => {
    try {
      const data = await getBlogAnalyticsBySlug(slug);
      setDetailedAnalytics(data);
      setSelectedSlug(slug);
    } catch (error) {
      console.error('Failed to load detailed analytics:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatLoadTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Analytics</h1>
          <p className="text-gray-600 mt-2">Track visitor engagement across your blog posts</p>
        </div>
        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, item) => sum + item.total_views, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, item) => sum + item.unique_visitors, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Time on Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const validTimes = analytics
                  .filter(item => item.avg_time_on_page_seconds)
                  .map(item => item.avg_time_on_page_seconds!);
                if (validTimes.length === 0) return '0s';
                const avg = validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length;
                return formatDuration(Math.round(avg));
              })()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const validLoadTimes = analytics
                  .filter(item => item.avg_load_time_ms)
                  .map(item => item.avg_load_time_ms!);
                if (validLoadTimes.length === 0) return '0ms';
                const avg = validLoadTimes.reduce((sum, time) => sum + time, 0) / validLoadTimes.length;
                return formatLoadTime(Math.round(avg));
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Post Performance</CardTitle>
          <CardDescription>Click on a blog post to see detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  No analytics data available yet. Visit some blog posts to start collecting data.
                </div>
                <div className="text-sm text-gray-400">
                  💡 Tip: Create a blog post and visit it to start tracking analytics!
                </div>
              </div>
            ) : (
              analytics.map((item) => (
                <div
                  key={item.slug}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => loadDetailedAnalytics(item.slug)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.slug}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Views: {item.total_views}</span>
                        <span>Unique: {item.unique_visitors}</span>
                        {item.avg_time_on_page_seconds && (
                          <span>Avg Time: {formatDuration(Math.round(item.avg_time_on_page_seconds))}</span>
                        )}
                        {item.avg_load_time_ms && (
                          <span>Load Time: {formatLoadTime(Math.round(item.avg_load_time_ms))}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>First: {formatDate(item.first_view)}</div>
                      <div>Last: {formatDate(item.last_view)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Modal */}
      {selectedSlug && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analytics: {selectedSlug}</CardTitle>
            <CardDescription>
              Individual visitor data for this blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detailedAnalytics.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No detailed data available for this post.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Time</th>
                        <th className="text-left py-2">User Agent</th>
                        <th className="text-left py-2">Referrer</th>
                        <th className="text-left py-2">Load Time</th>
                        <th className="text-left py-2">Time on Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedAnalytics.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">{formatDate(item.created_at)}</td>
                          <td className="py-2 max-w-xs truncate" title={item.user_agent}>
                            {item.user_agent}
                          </td>
                          <td className="py-2 max-w-xs truncate" title={item.referrer || 'Direct'}>
                            {item.referrer || 'Direct'}
                          </td>
                          <td className="py-2">
                            {item.page_load_time_ms ? formatLoadTime(item.page_load_time_ms) : '-'}
                          </td>
                          <td className="py-2">
                            {item.time_on_page_seconds ? formatDuration(item.time_on_page_seconds) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
