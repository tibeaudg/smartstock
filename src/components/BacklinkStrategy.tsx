import React, { useState } from 'react';

interface BacklinkOpportunity {
  id: string;
  type: 'guest-post' | 'resource-link' | 'partnership' | 'local-directory' | 'industry-forum';
  title: string;
  description: string;
  url?: string;
  status: 'pending' | 'contacted' | 'published' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export const BacklinkStrategy: React.FC = () => {
  const [opportunities, setOpportunities] = useState<BacklinkOpportunity[]>([
    {
      id: '1',
      type: 'guest-post',
      title: 'Voorraadbeheer voor KMO\'s - Complete Gids',
      description: 'Guest post over voorraadbeheer best practices voor KMO\'s',
      status: 'pending',
      priority: 'high',
      notes: 'Focus op praktische tips en case studies'
    },
    {
      id: '2',
      type: 'resource-link',
      title: 'KMO Resource Directory',
      description: 'Lijst van nuttige tools en resources voor KMO\'s',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '3',
      type: 'local-directory',
      title: 'Vlaamse KMO Directory',
      description: 'Lokale directory voor Vlaamse bedrijven',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'industry-forum',
      title: 'KMO Forum Vlaanderen',
      description: 'Forum discussies over voorraadbeheer',
      status: 'pending',
      priority: 'medium'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<Partial<BacklinkOpportunity>>({});

  const addOpportunity = () => {
    if (newOpportunity.title && newOpportunity.type) {
      const opportunity: BacklinkOpportunity = {
        id: Date.now().toString(),
        title: newOpportunity.title,
        description: newOpportunity.description || '',
        type: newOpportunity.type as BacklinkOpportunity['type'],
        status: 'pending',
        priority: newOpportunity.priority || 'medium',
        notes: newOpportunity.notes
      };
      setOpportunities([...opportunities, opportunity]);
      setNewOpportunity({});
      setShowForm(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Backlink Strategie</h2>
      
      {/* Strategy Overview */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Backlink Strategieën</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">🎯 Hoge Prioriteit</h4>
            <ul className="text-sm space-y-1">
              <li>• Guest posts op relevante KMO blogs</li>
              <li>• Resource directories en linkpagina's</li>
              <li>• Industry partnerships</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">📈 Middelmatige Prioriteit</h4>
            <ul className="text-sm space-y-1">
              <li>• Lokale business directories</li>
              <li>• Industry forums en communities</li>
              <li>• Social media mentions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add New Opportunity */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Annuleren' : 'Nieuwe Kans Toevoegen'}
        </button>
        
        {showForm && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newOpportunity.type || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, type: e.target.value as any})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecteer type</option>
                  <option value="guest-post">Guest Post</option>
                  <option value="resource-link">Resource Link</option>
                  <option value="partnership">Partnership</option>
                  <option value="local-directory">Lokale Directory</option>
                  <option value="industry-forum">Industry Forum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prioriteit</label>
                <select
                  value={newOpportunity.priority || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, priority: e.target.value as any})}
                  className="w-full p-2 border rounded"
                >
                  <option value="high">Hoog</option>
                  <option value="medium">Medium</option>
                  <option value="low">Laag</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Titel</label>
                <input
                  type="text"
                  value={newOpportunity.title || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Titel van de backlink kans"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Beschrijving</label>
                <textarea
                  value={newOpportunity.description || ''}
                  onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Beschrijving van de kans"
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

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{opportunity.title}</h3>
                <p className="text-sm text-gray-600">{opportunity.description}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(opportunity.priority)}`}>
                  {opportunity.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(opportunity.status)}`}>
                  {opportunity.status}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
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
            </div>
          </div>
        ))}
      </div>

      {/* Backlink Tips */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Backlink Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold">✅ Do's</h4>
            <ul className="space-y-1">
              <li>• Focus op kwaliteit boven kwantiteit</li>
              <li>• Zoek relevante, autoritaire websites</li>
              <li>• Bied waardevolle content aan</li>
              <li>• Bouw echte relaties op</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">❌ Don'ts</h4>
            <ul className="space-y-1">
              <li>• Koop geen links</li>
              <li>• Spam niet met link requests</li>
              <li>• Gebruik geen link farms</li>
              <li>• Negeer relevante niet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklinkStrategy; 