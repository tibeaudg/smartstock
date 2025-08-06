import React, { useState, useEffect } from 'react';

interface BacklinkMetric {
  date: string;
  totalBacklinks: number;
  domainAuthority: number;
  organicTraffic: number;
  newBacklinks: number;
}

interface BacklinkOpportunity {
  id: string;
  website: string;
  url: string;
  domainAuthority: number;
  status: 'pending' | 'contacted' | 'published' | 'rejected';
  contactDate: string;
  followUpDate?: string;
  notes: string;
}

export const BacklinkMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<BacklinkMetric[]>([
    {
      date: '2024-01-01',
      totalBacklinks: 15,
      domainAuthority: 25,
      organicTraffic: 1200,
      newBacklinks: 0
    },
    {
      date: '2024-01-15',
      totalBacklinks: 18,
      domainAuthority: 26,
      organicTraffic: 1350,
      newBacklinks: 3
    },
    {
      date: '2024-02-01',
      totalBacklinks: 22,
      domainAuthority: 28,
      organicTraffic: 1500,
      newBacklinks: 4
    }
  ]);

  const [opportunities, setOpportunities] = useState<BacklinkOpportunity[]>([
    {
      id: '1',
      website: 'KMO Vlaanderen',
      url: 'https://www.kmo.be',
      domainAuthority: 75,
      status: 'contacted',
      contactDate: '2024-01-20',
      followUpDate: '2024-01-27',
      notes: 'Guest post pitch sent, waiting for response'
    },
    {
      id: '2',
      website: 'Trends Business',
      url: 'https://trends.knack.be/business',
      domainAuthority: 80,
      status: 'pending',
      contactDate: '2024-01-25',
      notes: 'Need to send follow-up email'
    },
    {
      id: '3',
      website: 'Voka',
      url: 'https://www.voka.be',
      domainAuthority: 78,
      status: 'published',
      contactDate: '2024-01-10',
      notes: 'Guest post published successfully'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<Partial<BacklinkOpportunity>>({});

  const addOpportunity = () => {
    if (newOpportunity.website && newOpportunity.url) {
      const opportunity: BacklinkOpportunity = {
        id: Date.now().toString(),
        website: newOpportunity.website!,
        url: newOpportunity.url!,
        domainAuthority: newOpportunity.domainAuthority || 0,
        status: 'pending',
        contactDate: new Date().toISOString().split('T')[0],
        notes: newOpportunity.notes || ''
      };
      setOpportunities([...opportunities, opportunity]);
      setNewOpportunity({});
      setShowAddForm(false);
    }
  };

  const updateStatus = (id: string, status: BacklinkOpportunity['status']) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === id ? { ...opp, status } : opp
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDomainAuthorityColor = (da: number) => {
    if (da >= 70) return 'text-green-600';
    if (da >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate current metrics
  const currentMetrics = metrics[metrics.length - 1];
  const previousMetrics = metrics[metrics.length - 2];
  
  const backlinkGrowth = previousMetrics ? 
    ((currentMetrics.totalBacklinks - previousMetrics.totalBacklinks) / previousMetrics.totalBacklinks * 100).toFixed(1) : 0;
  
  const authorityGrowth = previousMetrics ? 
    ((currentMetrics.domainAuthority - previousMetrics.domainAuthority) / previousMetrics.domainAuthority * 100).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Backlink Monitor</h2>
      
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Backlinks</h3>
          <p className="text-2xl font-bold">{currentMetrics.totalBacklinks}</p>
          <p className={`text-sm ${parseFloat(backlinkGrowth.toString()) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {backlinkGrowth}% from last month
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Domain Authority</h3>
          <p className="text-2xl font-bold">{currentMetrics.domainAuthority}</p>
          <p className={`text-sm ${parseFloat(authorityGrowth.toString()) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {authorityGrowth}% from last month
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Organic Traffic</h3>
          <p className="text-2xl font-bold">{currentMetrics.organicTraffic.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Monthly visitors</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">New Backlinks</h3>
          <p className="text-2xl font-bold">{currentMetrics.newBacklinks}</p>
          <p className="text-sm text-gray-600">This month</p>
        </div>
      </div>

      {/* Add New Opportunity */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? 'Annuleren' : 'Nieuwe Kans Toevoegen'}
        </button>
        
        {showAddForm && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="text"
                  value={newOpportunity.website || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, website: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Website naam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={newOpportunity.url || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, url: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Domain Authority</label>
                <input
                  type="number"
                  value={newOpportunity.domainAuthority || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, domainAuthority: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  placeholder="75"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  type="text"
                  value={newOpportunity.notes || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, notes: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Contact info, strategy, etc."
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={addOpportunity}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Toevoegen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Backlink Opportunities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain Authority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {opportunity.website}
                      </div>
                      <div className="text-sm text-gray-500">
                        <a href={opportunity.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {opportunity.url}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getDomainAuthorityColor(opportunity.domainAuthority)}`}>
                      {opportunity.domainAuthority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opportunity.contactDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={opportunity.status}
                      onChange={(e) => updateStatus(opportunity.id, e.target.value as BacklinkOpportunity['status'])}
                      className="text-xs p-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="published">Published</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Backlink Growth</h3>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{metric.date}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Backlinks: {metric.totalBacklinks}</span>
                <span className="text-sm">DA: {metric.domainAuthority}</span>
                <span className="text-sm">Traffic: {metric.organicTraffic.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BacklinkMonitor; 