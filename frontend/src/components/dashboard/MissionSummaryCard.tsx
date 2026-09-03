import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { Plane, Calendar, Map as MapIcon } from 'lucide-react';
import { formatDate, formatHectares } from '@/lib/utils';
import { Mission } from '@/types';

export function MissionSummaryCard() {
  const { t } = useTranslation();
  
  // Mock recent missions
  const recentMissions: Mission[] = [
    {
      id: 'm-1234', farm_id: 'f-1', drone_id: 'd-1', field_id: null,
      start_time: new Date().toISOString(), end_time: null,
      status: 'completed', coverage_area_ha: 12.5, sensors_used: ['RGB', 'Multispectral']
    },
    {
      id: 'm-1235', farm_id: 'f-1', drone_id: 'd-2', field_id: null,
      start_time: new Date(Date.now() + 86400000).toISOString(), end_time: null,
      status: 'scheduled', coverage_area_ha: 8.2, sensors_used: ['LiDAR']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-brand-primary" />
          {t('dashboard.recentMissions')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMissions.map(mission => (
            <div key={mission.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-text-primary">#{mission.id.split('-')[1]}</span>
                  <Badge variant="status" value={mission.status}>
                    {t(`missions.${mission.status}`)}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(mission.start_time).split(' ')[0]}</span>
                  <span className="flex items-center gap-1"><MapIcon className="w-3 h-3" /> {formatHectares(mission.coverage_area_ha)}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {mission.sensors_used.map(sensor => (
                  <span key={sensor} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs">
                    {sensor}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
