export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const WARANGA_CENTER = {
  lng: 76.5667,
  lat: 20.5500
};

export const DEFAULT_ZOOM = 14;

export const DISEASE_COLORS: Record<string, string> = {
  'charcoal_rot': '#4b5563', // gray
  'target_spot': '#b91c1c', // red
  'root_knot_nematode': '#d97706', // orange
  'yellow_mosaic': '#eab308', // yellow
};

export const SEVERITY_COLORS: Record<string, string> = {
  'mild': '#3b82f6', // blue
  'moderate': '#eab308', // yellow
  'severe': '#ef4444', // red
  'critical': '#7f1d1d', // dark red
  'low': '#3b82f6',
  'medium': '#eab308',
  'high': '#f97316',
};

export const NDVI_COLOR_SCALE = [
  '#d73027', // Severe Stress (<0.2)
  '#f46d43', // Moderate Stress (0.2-0.4)
  '#fdae61', // Mild Stress (0.4-0.6)
  '#a6d96a', // Healthy (0.6-0.8)
  '#1a9850'  // Very Healthy (>0.8)
];
