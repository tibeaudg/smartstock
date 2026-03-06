import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Package,
  Users,
  Truck,
  Settings,
  Plus,
  Upload,
  ChevronRight,
  Check,
  ScanLine,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAccountChecklist, type ChecklistTask } from '@/hooks/useAccountChecklist';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const TASK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  account: Building2,
  products: Package,
  customers: Users,
  suppliers: Truck,
};

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.25 },
  }),
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

export interface AccountChecklistProps {
  /** Optional callback to open the barcode scanner (e.g. from Dashboard) */
  onOpenScanner?: () => void;
}

export function AccountChecklist({ onOpenScanner }: AccountChecklistProps) {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const {
    tasks,
    completedCount,
    totalCount,
    isChecklistComplete,
    isLoading,
    skipTask,
    markTaskDone,
  } = useAccountChecklist();

  const handleAction = (task: ChecklistTask) => {
    navigate(task.actionPath);
  };

  const handleSecondaryAction = (task: ChecklistTask) => {
    if (task.actionPathSecondary) {
      navigate(task.actionPathSecondary, { state: { openImport: true } });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-2/5" />
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1  gap-4">
            <div className="h-32 bg-muted rounded-xl" />
            <div className="h-32 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isChecklistComplete) {
    return null;
  }

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pt-4 sm:pt-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Complete your account setup
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {completedCount} of {totalCount} steps completed
        </p>
        <Progress value={progressPercent} className="h-2.5" />
      </div>

      {/* Task grid - show all tasks for full context */}
      <div className="grid grid-cols-1  gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map((task, index) => {
            const Icon = TASK_ICONS[task.id] ?? Settings;
            const isCompleted = task.completed;

            return (
              <motion.div
                key={task.id}
                custom={index}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <Card
                  className={cn(
                    'overflow-hidden transition-all',
                    isCompleted
                      ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800'
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                          isCompleted
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6" strokeWidth={2.5} />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle
                          className={cn(
                            'text-base font-semibold',
                            isCompleted && 'text-gray-600 dark:text-gray-400'
                          )}
                        >
                          {task.step}. {task.title}
                        </CardTitle>
                        <CardDescription
                          className={cn(
                            'mt-0.5 text-sm',
                            isCompleted && 'text-gray-500 dark:text-gray-500'
                          )}
                        >
                          {task.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  {!isCompleted && (
                    <CardContent className="flex flex-col gap-3 pt-0">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleAction(task)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {task.id === 'account' ? (
                            <>
                              <Settings className="h-4 w-4 mr-1.5" />
                              {task.actionLabel}
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1.5" />
                              {task.actionLabel}
                            </>
                          )}
                          <ChevronRight className="h-4 w-4 ml-0.5" />
                        </Button>
                        {task.actionPathSecondary && (
                          <Button
                            onClick={() => handleSecondaryAction(task)}
                            variant="outline"
                            size="sm"
                          >
                            <Upload className="h-4 w-4 mr-1.5" />
                            {task.actionLabelSecondary}
                          </Button>
                        )}
                        {task.id === 'products' && onOpenScanner && (
                          <Button
                            onClick={onOpenScanner}
                            variant="outline"
                            size="sm"
                          >
                            <ScanLine className="h-4 w-4 mr-1.5" />
                            Scan
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => markTaskDone(task.id)}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline-offset-2 hover:underline"
                        >
                          Mark as done
                        </button>
                        {task.optional && (
                          <button
                            type="button"
                            onClick={() => skipTask(task.id as 'customers' | 'suppliers')}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline-offset-2 hover:underline"
                          >
                            Skip for now
                          </button>
                        )}
                      </div>
                    </CardContent>
                  )}

                  {isCompleted && (
                    <CardContent className="pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        onClick={() => handleAction(task)}
                      >
                        View
                        <ChevronRight className="h-4 w-4 ml-0.5" />
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
