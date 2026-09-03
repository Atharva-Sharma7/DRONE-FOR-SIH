'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';

export function NDVITrendChart() {
  const { t } = useTranslation();

  // Mock data for last 14 days
  const data = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ndvi: 0.5 + Math.random() * 0.3,
      ndre: 0.4 + Math.random() * 0.25,
    };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('analytics.ndviTrend')}</CardTitle>
      </CardHeader>
      <CardContent className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
            <ReferenceLine y={0.3} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Stress', position: 'insideBottomLeft', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={0.6} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Healthy', position: 'insideTopLeft', fill: '#10b981', fontSize: 10 }} />
            
            <Line type="monotone" dataKey="ndvi" name="NDVI" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="ndre" name="NDRE" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
