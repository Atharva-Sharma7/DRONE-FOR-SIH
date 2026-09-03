import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Filter } from 'lucide-react';

export function DiseaseFilters() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-surface p-4 rounded-xl border border-border">
      <div className="flex items-center gap-2 text-text-primary shrink-0">
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filters</span>
      </div>
      
      <div className="flex flex-wrap gap-4 w-full">
        <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand-primary/50">
          <option value="">All Severities</option>
          <option value="mild">{t('disease.mild')}</option>
          <option value="moderate">{t('disease.moderate')}</option>
          <option value="severe">{t('disease.severe')}</option>
        </select>
        
        <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand-primary/50">
          <option value="">All Diseases</option>
          <option value="charcoal_rot">{t('disease.charcoalRot')}</option>
          <option value="target_spot">{t('disease.targetSpot')}</option>
          <option value="root_knot_nematode">{t('disease.rkn')}</option>
          <option value="yellow_mosaic">{t('disease.ymd')}</option>
        </select>
        
        <input 
          type="date" 
          className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand-primary/50"
        />
      </div>
    </div>
  );
}
