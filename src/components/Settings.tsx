import React, { useState, useEffect } from 'react';
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
import { ModuleManagement } from './settings/ModuleManagement';
import { LicenseOverview } from './settings/LicenseOverview';
import { InvoicingOverview } from '@/components/settings/InvoicingOverview';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  Building2,
  User,
  Banknote,
  Users,
  FileText,
  Key,
} from 'lucide-react';

export const Settings = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  
  // Gebruik de page refresh hook
  usePageRefresh();
  
  // Get tab from URL query parameter or router state
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab');
  const initialTab = tabFromUrl || (location.state && location.state.tab) || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Dispatch event bij mount of route-verandering naar settings
  useEffect(() => {
    // Alleen dispatchen als de licentie-tab zichtbaar is (admin)
    // of altijd als je wilt dat het altijd refetcht bij settings bezoek
    window.dispatchEvent(new Event('license-refetch'));
  }, [location.key]);

  const isAdmin = userProfile?.role === 'admin';
  const isBlocked = userProfile?.blocked;

  // If blocked, only show invoicing tab
  if (isBlocked) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instellingen</h1>
          <p className="font-bold p-2 items-center justify-center text-blue-700 mt-2 bg-blue-50 border border-blue-200">Uw account is geblokkeerd. U kunt alleen uw facturen bekijken en betalen.</p>
        </div>
        <Tabs value={"invoicing"} onValueChange={() => {}} className="space-y-24 md:space-y-0">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="invoicing" className="flex items-center space-x-2">
              <Banknote className="w-4 h-4" />
              <span>Facturatie</span>
            </TabsTrigger>
          </TabsList>
          <div className="mb-10" />
          <TabsContent value="invoicing" className="space-y-6">
            <InvoicingOverview />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-24 md:space-y-0"
      >
        {/* Tab buttons */}
        {isAdmin && (
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1 mb-10">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profiel</span>
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Filialen</span>
            </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Gebruikers</span>
              </TabsTrigger>

              <TabsTrigger value="license" className="flex items-center space-x-2 hidden">
                <Key className="w-4 h-4" />
                <span>Licentie</span>
              </TabsTrigger>

              <TabsTrigger value="invoicing" className="flex items-center space-x-2 hidden">
                <Banknote className="w-4 h-4" />
                <span>Facturatie</span>
              </TabsTrigger>





            <TabsTrigger value="modules" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Modules</span>
            </TabsTrigger>
          </TabsList>
        )}

        {!isAdmin && (
          <TabsList className="grid w-full grid-cols-1 ">
            <TabsTrigger value="profile" className="flex items-center space-x-2 ">
              <User className="w-4 h-4" />
              <span>Profiel</span>
            </TabsTrigger>
          </TabsList>
        )}
        {/* Add extra margin below tab buttons for all views */}
        <div className="mb-10" />

        {/* Profiel tab - zichtbaar voor iedereen */}
        <TabsContent value="profile" className="space-y-6 ">
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

            <TabsContent value="modules" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modules</CardTitle>
                  <CardDescription>
                    Stem op toekomstige modules en bekijk de status van de huidige modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModuleManagement />
                </CardContent>
              </Card>
            </TabsContent>



          </>
        )}
      </Tabs>
    </div>
  );
};
