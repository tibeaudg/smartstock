import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import type { IntegrationDefinition } from '@/lib/integrations/catalog';
import { IntegrationIcon } from '@/lib/integrations/icons';

interface IntegrationComingSoonDialogProps {
  integration: IntegrationDefinition | null;
  open: boolean;
  onClose: () => void;
}

export function IntegrationComingSoonDialog({
  integration,
  open,
  onClose,
}: IntegrationComingSoonDialogProps) {
  if (!integration) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
              <IntegrationIcon iconKey={integration.iconKey} />
            </div>
            <div>
              <DialogTitle>{integration.name}</DialogTitle>
              <DialogDescription className="text-left pt-1">
                {integration.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Coming soon</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            We&apos;re building a direct connection to {integration.name}. Your interest has been
            recorded — we&apos;ll notify you when it&apos;s ready.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
