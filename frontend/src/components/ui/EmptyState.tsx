import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface EmptyStateProps {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, titleKey, descriptionKey, action }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-border rounded-xl">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-text-secondary" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-1">{t(titleKey)}</h3>
      {descriptionKey && (
        <p className="text-sm text-text-secondary max-w-sm mb-4">{t(descriptionKey)}</p>
      )}
      {action}
    </div>
  );
}
