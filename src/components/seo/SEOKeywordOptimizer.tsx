import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, TrendingUp, AlertCircle } from 'lucide-react';
import { 
  fetchSEOPages, 
  fetchSEOQueries, 
  getOptimizationOpportunities,
  getPagePath,
  type SEOPage, 
  type SEOQuery 
} from '@/services/seoAnalytics';

type SortField = 'impressions' | 'clicks';
type SortDirection = 'asc' | 'desc';

export const SEOKeywordOptimizer: React.FC = () => {
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [queries, setQueries] = useState<SEOQuery[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [pageSortField, setPageSortField] = useState<SortField>('impressions');
  const [pageSortDirection, setPageSortDirection] = useState<SortDirection>('desc');
  const [querySortField, setQuerySortField] = useState<SortField>('impressions');
  const [querySortDirection, setQuerySortDirection] = useState<SortDirection>('desc');

  // Load pages on mount
  useEffect(() => {
    loadPages();
  }, []);

  // Load queries when page is selected
  useEffect(() => {
    if (selectedPage) {
      loadQueries(selectedPage);
    } else {
      setQueries([]);
    }
  }, [selectedPage]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await fetchSEOPages();
      setPages(data);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQueries = async (pageUrl: string) => {
    setQueriesLoading(true);
    try {
      const data = await fetchSEOQueries(pageUrl);
      setQueries(data);
    } catch (error) {
      console.error('Error loading queries:', error);
    } finally {
      setQueriesLoading(false);
    }
  };

  const handlePageSort = (field: SortField) => {
    if (pageSortField === field) {
      setPageSortDirection(pageSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setPageSortField(field);
      setPageSortDirection('desc');
    }
  };

  const handleQuerySort = (field: SortField) => {
    if (querySortField === field) {
      setQuerySortDirection(querySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setQuerySortField(field);
      setQuerySortDirection('desc');
    }
  };

  // Sort pages
  const sortedPages = [...pages].sort((a, b) => {
    const multiplier = pageSortDirection === 'asc' ? 1 : -1;
    if (pageSortField === 'impressions') {
      return (a.impressions - b.impressions) * multiplier;
    } else {
      return (a.clicks - b.clicks) * multiplier;
    }
  });

  // Sort queries
  const sortedQueries = [...queries].sort((a, b) => {
    const multiplier = querySortDirection === 'asc' ? 1 : -1;
    if (querySortField === 'impressions') {
      return (a.impressions - b.impressions) * multiplier;
    } else {
      return (a.clicks - b.clicks) * multiplier;
    }
  });

  // Get optimization opportunities
  const opportunities = getOptimizationOpportunities(queries);

  const getPositionColor = (position: number): string => {
    if (position >= 2 && position <= 10) {
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    } else if (position === 1) {
      return 'bg-green-50 text-green-800 border-green-200';
    } else if (position > 10) {
      return 'bg-gray-50 text-gray-600 border-gray-200';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">SEO Keyword Optimization</h2>
        <p className="text-sm text-gray-600 mt-1">
          Follow the workflow: Select a page → Check queries → Optimize keywords close to position 1
        </p>
      </div>

      {/* Optimization Opportunities Summary */}
      {selectedPage && opportunities.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-700 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  {opportunities.length} Optimization Opportunity{opportunities.length !== 1 ? 'ies' : ''}
                </h3>
                <p className="text-sm text-yellow-800">
                  These keywords are between positions 2-10 and can be optimized to reach position 1.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Top Pages
            </CardTitle>
            <CardDescription>
              Pages sorted by impressions. Click to view queries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading pages...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handlePageSort('impressions')}
                        >
                          Impressions
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handlePageSort('clicks')}
                        >
                          Clicks
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                          No pages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedPages.map((page, index) => (
                        <TableRow
                          key={index}
                          className={`cursor-pointer hover:bg-blue-50 ${
                            selectedPage === page.url ? 'bg-blue-100' : ''
                          }`}
                          onClick={() => setSelectedPage(page.url)}
                        >
                          <TableCell className="font-medium max-w-xs truncate">
                            {getPagePath(page.url)}
                          </TableCell>
                          <TableCell className="text-purple-600 font-medium">
                            {page.impressions.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-blue-600 font-medium">
                            {page.clicks}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queries Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Queries
            </CardTitle>
            <CardDescription>
              {selectedPage 
                ? `Search queries for ${getPagePath(selectedPage)}`
                : 'Select a page to view queries'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedPage ? (
              <div className="text-center py-8 text-gray-500">
                Select a page from the left to view its queries
              </div>
            ) : queriesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading queries...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Query</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleQuerySort('impressions')}
                        >
                          Impressions
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleQuerySort('clicks')}
                        >
                          Clicks
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Avg Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedQueries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No queries found for this page
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedQueries.map((query, index) => {
                        const isOpportunity = query.avgPosition >= 2 && query.avgPosition <= 10;
                        return (
                          <TableRow
                            key={index}
                            className={isOpportunity ? 'bg-yellow-50 hover:bg-yellow-100' : ''}
                          >
                            <TableCell className="font-medium">{query.query}</TableCell>
                            <TableCell className="text-purple-600 font-medium">
                              {query.impressions.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-blue-600 font-medium">
                              {query.clicks}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded border text-sm font-medium ${
                                  getPositionColor(query.avgPosition)
                                }`}
                              >
                                {query.avgPosition.toFixed(1)}
                                {isOpportunity && (
                                  <TrendingUp className="ml-1 h-3 w-3" />
                                )}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Workflow Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>View pages sorted by most impressions</li>
            <li>Click on a page to see its search queries</li>
            <li>Check the "Avg Position" column for each query</li>
            <li>
              <strong>If close to 1 (positions 2-10):</strong> Add the missing query to the page content
            </li>
            <li>Repeat until you optimize all opportunities</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

