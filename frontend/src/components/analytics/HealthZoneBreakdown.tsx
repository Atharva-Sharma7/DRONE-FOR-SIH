'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { NDVI_COLOR_SCALE } from '@/lib/constants';

export function HealthZoneBreakdown() {
  const { t } = useTranslation();

  const data = [
    { name: t('analytics.healthy'), value: 45, color: NDVI_COLOR_SCALE[4] },
    { name: t('analytics.mildStress'), value: 30, color: NDVI_COLOR_SCALE[2] },
    { name: t('analytics.moderateStress'), value: 15, color: NDVI_COLOR_SCALE[1] },
    { name: t('analytics.severeStress'), value: 10, color: NDVI_COLOR_SCALE[0] },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('dashboard.overallHealth')}</CardTitle>
      </CardHeader>
      <CardContent className="h-80 w-full flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}%`, '']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 w-full px-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-text-secondary truncate">{item.name}</span>
              <span className="text-xs font-semibold ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
