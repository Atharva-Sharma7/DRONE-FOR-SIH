import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Filter } from 'lucide-react';

export function DiseaseFilters() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm transition-colors">
      <div className="flex items-center gap-2 text-[var(--text-primary)] shrink-0">
        <Filter className="w-5 h-5 text-[var(--accent)]" />
        <span className="font-semibold text-sm">{t('common.filters')}</span>
      </div>
      
      <div className="flex flex-wrap gap-3 w-full">
        <select className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/50 cursor-pointer transition-all">
          <option value="" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('common.allSeverities')}</option>
          <option value="mild" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('disease.mild')}</option>
          <option value="moderate" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('disease.moderate')}</option>
          <option value="severe" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('disease.severe')}</option>
        </select>
        
        <select className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/50 cursor-pointer transition-all">
          <option value="" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('common.allDiseases')}</option>
          <option value="charcoal_rot" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('disease.charcoalRot')}</option>
          <option value="target_spot" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('disease.targetSpot')}</option>
          <option value="root_knot_nematode" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('disease.rkn')}</option>
          <option value="yellow_mosaic" className="bg-[var(--surface)] text-[var(--text-primary)]">{t('disease.ymd')}</option>
        </select>
        
        <input 
          type="date" 
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/50 cursor-pointer [color-scheme:dark] light:[color-scheme:light] transition-all"
        />
      </div>
    </div>
  );
}
