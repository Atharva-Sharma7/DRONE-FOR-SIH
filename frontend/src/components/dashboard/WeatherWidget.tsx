'use client';
import React, { useEffect, useState } from 'react';
import { Cloud, Wind, Droplets, Thermometer } from 'lucide-react';
import { WMO_CODES, WARANGA_CENTER } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';

interface WeatherData {
  current: {
    temperature_c: number;
    feels_like_c: number;
    humidity_pct: number;
    precipitation_mm: number;
    wind_speed_kmh: number;
    cloud_cover_pct: number;
    weather_code: number;
  };
  forecast_3day: Array<{
    date: string;
    max_temp_c: number;
    min_temp_c: number;
    rain_probability_pct: number;
  }>;
}

export function WeatherWidget() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = (
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${WARANGA_CENTER.lat}&longitude=${WARANGA_CENTER.lng}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,apparent_temperature,cloud_cover` +
      `&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min` +
      `&timezone=Asia%2FKolkata&forecast_days=3`
    );
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const c = data.current || {};
        const d = data.daily || {};
        setWeather({
          current: {
            temperature_c: c.temperature_2m,
            feels_like_c: c.apparent_temperature,
            humidity_pct: c.relative_humidity_2m,
            precipitation_mm: c.precipitation,
            wind_speed_kmh: c.wind_speed_10m,
            cloud_cover_pct: c.cloud_cover,
            weather_code: c.weather_code,
          },
          forecast_3day: (d.time || []).slice(0, 3).map((date: string, i: number) => ({
            date,
            max_temp_c: d.temperature_2m_max?.[i],
            min_temp_c: d.temperature_2m_min?.[i],
            rain_probability_pct: d.precipitation_probability_max?.[i],
          }))
        });
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const wmo = weather ? (WMO_CODES[weather.current.weather_code] || { label: 'Unknown', icon: '🌡️' }) : null;

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--text-muted)] lowercase tracking-wide">
          weather · waranga
        </span>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          live · open-meteo
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {loading && (
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 rounded-full border-2 border-[var(--text-muted)] border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="text-xs font-mono text-[var(--rust)] text-center py-4">unable to fetch weather</div>
        )}

        {weather && !loading && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{wmo?.icon}</span>
              <div>
                <div className="text-[32px] font-mono font-medium text-[var(--text-primary)] leading-none tabular-nums">
                  {Math.round(weather.current.temperature_c)}°
                </div>
                <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
                  {wmo?.label.toLowerCase()} · {t('common.feelsLike')} {Math.round(weather.current.feels_like_c)}°
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-0 border-t border-l border-[var(--border)] mb-6">
              <div className="flex flex-col items-center gap-1 p-3 border-b border-r border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] capitalize">{t('common.humidity')}</span>
                <span className="text-sm font-mono text-[var(--text-primary)]">{weather.current.humidity_pct}%</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 border-b border-r border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] capitalize">{t('common.wind')}</span>
                <span className="text-sm font-mono text-[var(--text-primary)]">{Math.round(weather.current.wind_speed_kmh)}<span className="text-[10px] text-[var(--text-muted)] ml-0.5">km/h</span></span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 border-b border-r border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] capitalize">{t('common.cloud')}</span>
                <span className="text-sm font-mono text-[var(--text-primary)]">{weather.current.cloud_cover_pct}%</span>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wide font-semibold">{t('common.forecast3Day')}</p>
              <div className="grid grid-cols-3 gap-3">
                {weather.forecast_3day.map((day) => {
                  const label = new Date(day.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' });
                  return (
                    <div key={day.date} className="flex flex-col border border-[var(--border)] rounded-sm p-2 bg-[var(--surface-2)]">
                      <div className="text-[10px] font-mono text-[var(--text-secondary)]">{label}</div>
                      <div className="text-sm font-mono text-[var(--text-primary)] mt-0.5">{Math.round(day.max_temp_c)}°<span className="text-[var(--text-muted)]">/{Math.round(day.min_temp_c)}°</span></div>
                      <div className="text-[10px] font-mono text-[var(--overcast)] mt-1">{day.rain_probability_pct}% {t('common.rain')}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
