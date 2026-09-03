import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { Clock, RefreshCw, CheckCircle2, CheckCircle } from 'lucide-react';

export function MissionStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (status) {
      case 'scheduled': return <Clock className="w-3 h-3 mr-1" />;
      case 'syncing': return <RefreshCw className="w-3 h-3 mr-1 animate-spin" />;
      case 'processed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <Badge variant="status" value={status} className="capitalize flex items-center w-max">
      {getIcon()}
      {t(`missions.${status}`)}
    </Badge>
  );
}
