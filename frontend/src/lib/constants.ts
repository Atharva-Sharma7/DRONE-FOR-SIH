export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/** Real Waranga village center — Hingna Taluka, Nagpur District, Maharashtra (IIIT Nagpur campus) */
export const WARANGA_CENTER = { lat: 21.1458, lng: 79.0530 };

export const DEFAULT_ZOOM = 13.5;

/** Disease class → fill color mapping */
export const DISEASE_COLORS: Record<string, string> = {
  charcoal_rot:  '#dc2626',   // red
  target_spot:   '#ea580c',   // orange
  yellow_mosaic: '#eab308',   // yellow
  rkn:           '#7c3aed',   // purple (root-knot nematodes)
  ymd:           '#eab308',   // alias
};

/** Map layer keys matching useMapStore */
export const LAYER_KEYS = ['boundary', 'disease', 'ndvi', 'terrain', 'flightPath', 'telemetry'] as const;

/** Open-Meteo weather code → description */
export const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear Sky',        icon: '☀️' },
  1:  { label: 'Mainly Clear',     icon: '🌤️' },
  2:  { label: 'Partly Cloudy',    icon: '⛅' },
  3:  { label: 'Overcast',         icon: '☁️' },
  45: { label: 'Foggy',            icon: '🌫️' },
  51: { label: 'Light Drizzle',    icon: '🌦️' },
  61: { label: 'Slight Rain',      icon: '🌧️' },
  63: { label: 'Moderate Rain',    icon: '🌧️' },
  80: { label: 'Rain Showers',     icon: '🌦️' },
  95: { label: 'Thunderstorm',     icon: '⛈️' },
};

/** NDVI health zone color scale: 0=severe, 1=moderate, 2=mild, 3=healthy, 4=very healthy */
export const NDVI_COLOR_SCALE = [
  '#C4531A', // 0: Severe stress (rust)
  '#E8C84A', // 1: Moderate stress (gold)
  '#84cc16', // 2: Mild stress (lime)
  '#4A7C42', // 3: Healthy (canopy green)
  '#166534', // 4: Very healthy (deep green)
];

