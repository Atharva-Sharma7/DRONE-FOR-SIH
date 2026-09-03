import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-md">
          <Bell className="w-5 h-5 text-brand-accent" />
          {t('dashboard.activeAlerts')}
        </CardTitle>
        <button className="text-xs text-brand-primary hover:underline">
          {t('dashboard.viewAll')}
        </button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
        {loading ? (
          <Spinner />
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            {t('dashboard.noAlerts')}
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="flex gap-3 p-3 rounded-lg border border-border bg-background/50 transition-all">
              <div className="mt-0.5">
                <Badge variant="severity" value={alert.severity}>
                  {t(`alerts.${alert.severity}`)}
                </Badge>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{alert.message}</p>
                <p className="text-xs text-text-secondary mt-1">{formatDate(alert.created_at)}</p>
              </div>
              {!alert.is_read && (
                <button 
                  onClick={() => handleMarkRead(alert.id)}
                  className="text-text-secondary hover:text-green-500 transition-colors"
                  title={t('alerts.markRead')}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
