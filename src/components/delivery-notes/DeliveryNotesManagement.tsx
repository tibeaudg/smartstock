import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDeliveryNotesStats } from '@/hooks/useDeliveryNotesStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Upload, 
  Download, 
  Plus, 
  FileText, 
  ArrowDown, 
  ArrowUp,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { IncomingDeliveryNotes } from './IncomingDeliveryNotes';
import { OutgoingDeliveryNotes } from './OutgoingDeliveryNotes';

export const DeliveryNotesManagement: React.FC = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDeliveryNotesStats();
  const navigate = useNavigate();
  const location = useLocation();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leveringsbonnen Beheer</h1>
          <p className="text-gray-600 mt-2">Beheer inkomende en uitgaande leveringsbonnen</p>
        </div>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ArrowDown className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inkomend</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.incoming || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Uitgaand</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.outgoing || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Behandeling</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.inProgress || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Deze Maand</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.thisMonth || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs 
          value={location.pathname.includes('outgoing') ? 'outgoing' : 'incoming'} 
          onValueChange={(value) => navigate(`/dashboard/delivery-notes/${value}`)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="incoming" className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4" />
              Inkomende Leveringsbonnen
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4" />
              Uitgaande Leveringsbonnen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-6">
            <Outlet />
          </TabsContent>

          <TabsContent value="outgoing" className="space-y-6">
            <Outlet />
          </TabsContent>
        </Tabs>
    </div>
  );
};
