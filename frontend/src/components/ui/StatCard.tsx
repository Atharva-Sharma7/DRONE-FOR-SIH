import React from 'react';
import { Card, CardContent } from './Card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, unit, trend, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <h4 className="text-2xl font-bold text-text-primary">{value}</h4>
            {unit && <span className="text-sm font-medium text-text-secondary">{unit}</span>}
          </div>
          
          {trend !== undefined && (
            <div className={cn(
              "flex items-center text-xs mt-2 font-medium",
              trend > 0 ? "text-green-600 dark:text-green-400" : 
              trend < 0 ? "text-red-600 dark:text-red-400" : "text-gray-500"
            )}>
              {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : 
               trend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
              <span>{Math.abs(trend)}% from last week</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-brand-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-brand-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
