export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Real Waranga Farmland Sector — Hingna Taluka, Nagpur District, Maharashtra
 * Centered on agricultural parcels south of Waranga / Dongargaon (Cotton & Soybean farmland)
 */
export const WARANGA_CENTER = { lat: 21.0250, lng: 79.0350 };

export const DEFAULT_ZOOM = 14.5;

/** Disease Class to Color Mapping */
export const DISEASE_COLORS: Record<string, string> = {
  charcoal_rot:  '#DC2626',   // Bold Red
  target_spot:   '#EA580C',   // Orange
  yellow_mosaic: '#F59E0B',   // Amber Gold
  rkn:           '#7C3AED',   // Purple (Root-Knot Nematodes)
  ymd:           '#F59E0B',   // Alias
};

/** Map Layer Keys Matching useMapStore */
export const LAYER_KEYS = ['boundary', 'disease', 'ndvi', 'terrain', 'flightPath', 'telemetry'] as const;

/** Open-Meteo Weather Code to Description */
export const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear Sky',        icon: '☀️' },
  1:  { label: 'Mainly Clear',     icon: '🌤️' },
  2:  { label: 'Partly Cloudy',    icon: '⛅' },
  3:  { label: 'Overcast',         icon: '☁️' },
  45: { label: 'Foggy Mist',       icon: '🌫️' },
  51: { label: 'Light Drizzle',    icon: '🌦️' },
  61: { label: 'Slight Rain',      icon: '🌧️' },
  63: { label: 'Moderate Rain',    icon: '🌧️' },
  80: { label: 'Rain Showers',     icon: '🌦️' },
  95: { label: 'Thunderstorm',     icon: '⛈️' },
};

/** NDVI Health Zone Color Scale: 0=Severe, 1=Moderate, 2=Mild, 3=Healthy, 4=Very Healthy */
export const NDVI_COLOR_SCALE = [
  '#DC2626', // 0: Severe Stress (Vivid Rust Red)
  '#F59E0B', // 1: Moderate Stress (Amber Gold)
  '#84CC16', // 2: Mild Stress (Lime Green)
  '#22C55E', // 3: Healthy Canopy (Green)
  '#15803D', // 4: Very Healthy (Deep Forest Green)
];
