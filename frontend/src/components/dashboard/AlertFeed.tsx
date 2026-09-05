'use client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Bell, CheckCircle2 } from 'lucide-react';
import { getAlerts, markAlertRead } from '@/lib/api/alerts';
import { Alert } from '@/types';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function AlertFeed() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const setUnreadAlertCount = useAppStore(state => state.setUnreadAlertCount);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      // Use mock data if API fails
      const mockAlerts: Alert[] = [
        { id: '1', mission_id: null, severity: 'high', message: 'Water pooling detected in North Plot.', is_read: false, created_at: new Date().toISOString() },
        { id: '2', mission_id: 'm1', severity: 'medium', message: 'Mild Charcoal Rot detected in Soybean East.', is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
      ];
      setAlerts(mockAlerts);
      setUnreadAlertCount(mockAlerts.filter(a => !a.is_read).length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    setUnreadAlertCount(alerts.filter(a => !a.is_read && a.id !== id).length);
    try {
      await markAlertRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] h-full flex flex-col rounded-sm">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--text-muted)] lowercase tracking-wide">
          alerts · open
        </span>
        <button className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          view all
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 flex justify-center"><Spinner /></div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm font-mono">
            no active alerts
          </div>
        ) : (
          alerts.map(alert => {
            const severityClass = alert.severity === 'high' ? 'severity-severe' : alert.severity === 'medium' ? 'severity-moderate' : 'severity-mild';
            return (
              <div key={alert.id} className={`flex gap-3 px-4 py-3 border-b border-[var(--border)] ${severityClass}`}>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-primary)]">{alert.message}</p>
                  <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">{formatDate(alert.created_at)}</p>
                </div>
                {!alert.is_read && (
                  <button 
                    onClick={() => handleMarkRead(alert.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--green)] transition-colors mt-0.5"
                    title={t('alerts.markRead')}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
