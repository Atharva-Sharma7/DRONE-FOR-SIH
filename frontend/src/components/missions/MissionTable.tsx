import React from 'react';
import { Mission } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate, formatHectares } from '@/lib/utils';
import { MissionStatusBadge } from './MissionStatusBadge';
import { SyncProgressBar } from './SyncProgressBar';
import { MoreVertical, Download } from 'lucide-react';

export function MissionTable({ missions }: { missions: Mission[] }) {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto bg-surface rounded-xl border border-border shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-background border-b border-border text-text-secondary">
          <tr>
            <th className="px-6 py-4 font-medium">{t('missions.missionId')}</th>
            <th className="px-6 py-4 font-medium">{t('missions.date')}</th>
            <th className="px-6 py-4 font-medium">{t('missions.status')}</th>
            <th className="px-6 py-4 font-medium">{t('missions.coverageArea')}</th>
            <th className="px-6 py-4 font-medium">{t('missions.sensors')}</th>
            <th className="px-6 py-4 font-medium text-right">{t('missions.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {missions.map((mission) => (
            <tr key={mission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4">
                <span className="font-mono text-text-primary">#{mission.id.split('-')[1]}</span>
              </td>
              <td className="px-6 py-4 text-text-secondary">
                {formatDate(mission.start_time)}
              </td>
              <td className="px-6 py-4">
                <MissionStatusBadge status={mission.status} />
                {mission.status === 'syncing' && (
                  <div className="mt-2 w-32">
                    <SyncProgressBar missionId={mission.id} />
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-text-primary">
                {formatHectares(mission.coverage_area_ha)}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  {mission.sensors_used.map(sensor => (
                    <span key={sensor} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-text-secondary rounded text-xs">
                      {sensor}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-1.5 text-text-secondary hover:text-brand-primary rounded-md hover:bg-brand-primary/10 transition-colors" title="Download Report">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
