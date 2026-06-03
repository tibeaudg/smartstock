import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plug } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import {
  INTEGRATION_CATEGORIES,
  INTEGRATIONS,
  type IntegrationDefinition,
  type IntegrationStatus,
} from '@/lib/integrations/catalog';
import { IntegrationIcon } from '@/lib/integrations/icons';
import { trackIntegrationClick } from '@/lib/integrations/trackClick';
import { IntegrationComingSoonDialog } from './IntegrationComingSoonDialog';

function statusBadgeClass(status: IntegrationStatus): string {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'CSV Import':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
}

export const IntegrationsSettings = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationDefinition | null>(null);

  const filtered = useMemo(
    () =>
      selectedCategory === 'All'
        ? INTEGRATIONS
        : INTEGRATIONS.filter((i) => i.category === selectedCategory),
    [selectedCategory],
  );

  const grouped = useMemo(() => {
    if (selectedCategory !== 'All') return { [selectedCategory]: filtered };
    return filtered.reduce<Record<string, IntegrationDefinition[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [filtered, selectedCategory]);

  const handleIntegrationClick = (integration: IntegrationDefinition) => {
    if (user?.id) {
      trackIntegrationClick(integration, user.id, activeBranch?.branch_id);
    }
    setSelectedIntegration(integration);
    setComingSoonOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Integrations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Connect e-commerce, marketplaces, accounting, shipping, and ERP tools to keep inventory in sync.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INTEGRATION_CATEGORIES.map((category) => (
          <Button
            key={category}
            type="button"
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="space-y-4">
          {selectedCategory === 'All' && (
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">{category}</h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((integration) => (
              <Card key={integration.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                      <IntegrationIcon iconKey={integration.iconKey} />
                    </div>
                    <Badge variant="secondary" className={statusBadgeClass(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{integration.name}</CardTitle>
                  <CardDescription className="text-sm">{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col pt-0">
                  <ul className="mb-4 space-y-1.5 flex-1">
                    {integration.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleIntegrationClick(integration)}
                  >
                    <Plug className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <IntegrationComingSoonDialog
        integration={selectedIntegration}
        open={comingSoonOpen}
        onClose={() => {
          setComingSoonOpen(false);
          setSelectedIntegration(null);
        }}
      />
    </div>
  );
};
