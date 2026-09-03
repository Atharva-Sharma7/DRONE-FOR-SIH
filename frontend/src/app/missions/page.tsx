'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MissionTable } from '@/components/missions/MissionTable';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plane, Plus } from 'lucide-react';
import { Mission } from '@/types';
import * as Tabs from '@radix-ui/react-tabs';

export default function MissionsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data
    const mockData: Mission[] = [
      { id: 'm-1234', farm_id: 'f-1', drone_id: 'd-1', field_id: null, start_time: new Date(Date.now() - 3600000).toISOString(), end_time: null, status: 'completed', coverage_area_ha: 12.5, sensors_used: ['RGB', 'Multispectral'] },
      { id: 'm-1235', farm_id: 'f-1', drone_id: 'd-2', field_id: null, start_time: new Date().toISOString(), end_time: null, status: 'syncing', coverage_area_ha: 8.2, sensors_used: ['LiDAR'] },
      { id: 'm-1236', farm_id: 'f-1', drone_id: 'd-1', field_id: null, start_time: new Date(Date.now() + 86400000).toISOString(), end_time: null, status: 'scheduled', coverage_area_ha: 15.0, sensors_used: ['RGB'] },
    ];
    
    setTimeout(() => {
      setMissions(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const filteredMissions = filter === 'all' ? missions : missions.filter(m => m.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">{t('missions.title')}</h1>
        
        <button 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Not available in demo"
          disabled
        >
          <Plus className="w-4 h-4" />
          {t('missions.createMission')}
        </button>
      </div>

      <Tabs.Root value={filter} onValueChange={setFilter}>
        <Tabs.List className="flex gap-2 border-b border-border pb-px mb-6 overflow-x-auto">
          {['all', 'scheduled', 'syncing', 'processed', 'completed'].map((status) => (
            <Tabs.Trigger 
              key={status} 
              value={status} 
              className="px-4 py-2 font-medium text-sm text-text-secondary border-b-2 border-transparent hover:text-text-primary data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary transition-colors whitespace-nowrap capitalize"
            >
              {t(`missions.${status}`)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      {loading ? (
        <div className="py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredMissions.length === 0 ? (
        <EmptyState 
          icon={Plane}
          titleKey="missions.noMissions"
        />
      ) : (
        <MissionTable missions={filteredMissions} />
      )}
    </div>
  );
}
