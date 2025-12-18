import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ClipboardCheck, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CycleCount } from '@/types/stockTypes';
import { CreateCycleCountModal } from '@/components/cycle-count/CreateCycleCountModal';
import { CycleCountDetail } from '@/components/cycle-count/CycleCountDetail';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CycleCountPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCount, setSelectedCount] = useState<CycleCount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: cycleCounts = [], isLoading, refetch } = useQuery<CycleCount[]>({
    queryKey: ['cycleCounts', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch?.branch_id) return [];
      
      let query = supabase
        .from('cycle_counts')
        .select(`
          *,
          items:cycle_count_items(*)
        `)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeBranch?.branch_id,
  });

  const filteredCounts = cycleCounts.filter(count => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        count.count_number.toLowerCase().includes(query) ||
        count.notes?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCountCreated = () => {
    setShowCreateModal(false);
    refetch();
    queryClient.invalidateQueries({ queryKey: ['cycleCounts'] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || !activeBranch) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please select a branch to view cycle counts.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cycle Counts</h1>
          <p className="text-sm text-gray-600 mt-1">Perform inventory audits and track discrepancies</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Cycle Count
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by count number or notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cycle Counts List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCounts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No cycle counts found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Create your first cycle count to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Cycle Count
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCounts.map((count) => (
            <Card key={count.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCount(count)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{count.count_number}</h3>
                      <Badge className={getStatusColor(count.status)}>
                        {count.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Items: {count.total_items_counted} | 
                      Discrepancies: {count.discrepancy_count}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(count.count_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateCycleCountModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCountCreated={handleCountCreated}
        />
      )}

      {selectedCount && (
        <CycleCountDetail
          cycleCount={selectedCount}
          isOpen={!!selectedCount}
          onClose={() => setSelectedCount(null)}
          onCountUpdated={refetch}
        />
      )}
    </div>
  );
}



