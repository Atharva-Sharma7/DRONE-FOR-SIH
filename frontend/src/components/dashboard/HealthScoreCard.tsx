import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export function HealthScoreCard() {
  const { t } = useTranslation();
  // In a real app, this would be fetched from the API
  const score = 73; 
  
  let scoreColor = 'text-green-500';
  let strokeColor = 'stroke-green-500';
  if (score < 60) {
    scoreColor = 'text-red-500';
    strokeColor = 'stroke-red-500';
  } else if (score < 80) {
    scoreColor = 'text-yellow-500';
    strokeColor = 'stroke-yellow-500';
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-primary" />
          {t('dashboard.healthScore')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8">
        <div className="relative w-40 h-40">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              className={cn("transition-all duration-1000 ease-out", strokeColor)}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold", scoreColor)}>{score}</span>
            <span className="text-sm text-text-secondary">/ 100</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="font-medium text-text-primary">Patil Sheti</h3>
          <p className="text-xs text-text-secondary mt-1">
            {t('common.lastSync')}: {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
