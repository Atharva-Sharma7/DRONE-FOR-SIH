import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Bug, RefreshCw, Plane } from 'lucide-react';
import { useSyncQueue } from '@/hooks/useSyncQueue';

export function QuickActionCards() {
  const { t } = useTranslation();
  const { totalPending } = useSyncQueue();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Link href="/diseases" className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl hover:shadow-md transition-shadow">
        <Bug className="w-6 h-6 text-red-500 mb-2" />
        <span className="font-medium text-red-700 dark:text-red-400 text-center text-sm">
          2 {t('dashboard.inspectionRequired')}
        </span>
      </Link>
      
      <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
        <RefreshCw className="w-6 h-6 text-blue-500 mb-2" />
        <span className="font-medium text-blue-700 dark:text-blue-400 text-center text-sm">
          {totalPending} {t('dashboard.syncQueue')}
        </span>
      </div>

      <Link href="/missions" className="flex flex-col items-center justify-center p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl hover:shadow-md transition-shadow">
        <Plane className="w-6 h-6 text-brand-primary mb-2" />
        <span className="font-medium text-brand-primary text-center text-sm">
          {t('dashboard.scheduleMission')}
        </span>
      </Link>
    </div>
  );
}
