import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BranchManagement } from './settings/BranchManagement';
import { ProfileSettings } from './settings/ProfileSettings';
import { UserManagement } from './settings/UserManagement';
import { LicenseOverview } from './settings/LicenseOverview';
import { InvoicingOverview } from '@/components/settings/InvoicingOverview';
import { useAuth } from '@/hooks/useAuth';
import {
  Building2,
  User,
  Banknote,
  Users,
  FileText,
} from 'lucide-react';

export const Settings = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-600 mt-2">
          {isAdmin
            ? 'Beheer uw account, filialen en facturering'
            : 'Beheer uw persoonlijke accountinstellingen'}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y"
      >
        {/* Tab buttons */}
        {isAdmin && (
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profiel</span>
            </TabsTrigger>
            <TabsTrigger value="license" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Licentie</span>
            </TabsTrigger>
              <TabsTrigger value="invoicing" className="flex items-center space-x-2">
              <Banknote className="w-4 h-4" />
              <span>Facturatie</span>
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Filialen</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Gebruikers</span>
            </TabsTrigger>
          </TabsList>
        )}

        {!isAdmin && (
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profiel</span>
            </TabsTrigger>
          </TabsList>
        )}
        {/* Add extra margin below tab buttons for all views */}
        <div className="mb-10" />

        {/* Profiel tab - zichtbaar voor iedereen */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profiel Instellingen</CardTitle>
              <CardDescription>
                Beheer uw persoonlijke informatie en account instellingen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettings />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alleen zichtbaar voor admins */}
        {isAdmin && (
          <>
            <TabsContent value="license" className="space-y-6">
              <LicenseOverview />
            </TabsContent>

            <TabsContent value="invoicing" className="space-y-6">
              <InvoicingOverview />
            </TabsContent>


            <TabsContent value="branches" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Filiaal Beheer</CardTitle>
                  <CardDescription>
                    Beheer uw filialen, voeg nieuwe toe of bewerk bestaande informatie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BranchManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gebruikers Beheer</CardTitle>
                  <CardDescription>
                    Beheer gebruikers toegang tot uw filialen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
