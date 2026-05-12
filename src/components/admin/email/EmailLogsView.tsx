import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEmailLogs } from '@/hooks/useEmailLogs';
import { Search, Eye, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export function EmailLogsView() {
  const [filters, setFilters] = useState({
    email_type: '',
    status: '',
    recipient_email: '',
    date_from: '',
    date_to: '',
  });
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: logs, isLoading, isError, error } = useEmailLogs(filters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      email_type: '',
      status: '',
      recipient_email: '',
      date_from: '',
      date_to: '',
    });
  };

  const handleViewLog = (log: any) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700',
      sent: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700',
      bounced: 'bg-orange-100 text-orange-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      welcome: 'bg-purple-100 text-purple-700',
      newsletter: 'bg-blue-100 text-blue-700',
      followup: 'bg-yellow-100 text-yellow-700',
      support: 'bg-green-100 text-green-700',
      lifecycle: 'bg-indigo-100 text-indigo-700',
      deletion_warning: 'bg-red-100 text-red-700',
      custom: 'bg-gray-100 text-gray-700',
    };
    return variants[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Email History</h2>
        <p className="text-sm text-muted-foreground">
          View all sent emails with detailed tracking information
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <CardTitle>Filters</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="filter-type">Type</Label>
              <Select
                value={filters.email_type || 'all'}
                onValueChange={(value) => handleFilterChange('email_type', value === 'all' ? '' : value)}
              >
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="lifecycle">Lifecycle</SelectItem>
                  <SelectItem value="deletion_warning">Deletion Warning</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-status">Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-email">Recipient Email</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-email"
                  placeholder="Search email..."
                  value={filters.recipient_email}
                  onChange={(e) => handleFilterChange('recipient_email', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filter-date-from">Date From</Label>
              <Input
                id="filter-date-from"
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="filter-date-to">Date To</Label>
              <Input
                id="filter-date-to"
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Logs</CardTitle>
          <CardDescription>
            {logs?.length || 0} email(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading email logs...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-red-600">Failed to load email logs</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(error as any)?.message || 'Check your permissions and try again'}
              </p>
            </div>
          ) : logs && logs.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.sent_at), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="text-sm">{log.recipient_email}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{log.subject}</TableCell>
                      <TableCell>
                        <Badge className={getTypeBadge(log.email_type)}>
                          {log.email_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLog(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No email logs found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>
              Detailed information about the sent email
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Recipient</Label>
                  <p className="text-sm font-medium">{selectedLog.recipient_email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusBadge(selectedLog.status)}>
                      {selectedLog.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <div className="mt-1">
                    <Badge className={getTypeBadge(selectedLog.email_type)}>
                      {selectedLog.email_type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Sent At</Label>
                  <p className="text-sm font-medium">
                    {format(new Date(selectedLog.sent_at), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
                {selectedLog.delivered_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Delivered At</Label>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedLog.delivered_at), 'MMM d, yyyy HH:mm:ss')}
                    </p>
                  </div>
                )}
                {selectedLog.opened_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Opened At</Label>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedLog.opened_at), 'MMM d, yyyy HH:mm:ss')}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Subject</Label>
                <p className="text-sm font-medium mt-1">{selectedLog.subject}</p>
              </div>

              {selectedLog.error_message && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <Label className="text-xs text-red-700 font-medium">Error Message</Label>
                  <p className="text-sm text-red-600 mt-1">{selectedLog.error_message}</p>
                </div>
              )}

              {selectedLog.email_templates && (
                <div>
                  <Label className="text-xs text-muted-foreground">Template</Label>
                  <p className="text-sm font-medium mt-1">{selectedLog.email_templates.name}</p>
                </div>
              )}

              {selectedLog.email_campaigns && (
                <div>
                  <Label className="text-xs text-muted-foreground">Campaign</Label>
                  <p className="text-sm font-medium mt-1">{selectedLog.email_campaigns.name}</p>
                </div>
              )}

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Metadata</Label>
                  <pre className="text-xs bg-gray-50 p-3 rounded-md mt-1 overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
