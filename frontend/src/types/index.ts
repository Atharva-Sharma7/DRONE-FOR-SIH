export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'agronomist' | 'admin';
}

export interface Farm {
  id: string;
  name: string;
  location_name: string;
  boundary: GeoJSON.Feature;
  created_at: string;
}

export interface Field {
  id: string;
  farm_id: string;
  name: string;
  crop_type: 'cotton' | 'soybean' | 'mixed';
  boundary: GeoJSON.Feature;
  created_at?: string;
}

export interface Mission {
  id: string;
  farm_id: string;
  drone_id: string;
  field_id: string | null;
  start_time: string;
  end_time: string | null;
  status: 'scheduled' | 'syncing' | 'processed' | 'completed';
  coverage_area_ha: number;
  sensors_used: string[];
}

export interface Prediction {
  id: string;
  mission_id: string;
  disease_class: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  affected_area_ha: number;
  geom: GeoJSON.Feature;
  recommended_action: string;
  created_at: string;
}

export interface TerrainMetric {
  id: string;
  field_id: string;
  metric_type: 'slope' | 'water_risk' | 'drainage';
  value: number;
  description: string;
  geom: GeoJSON.Feature;
}

export interface Alert {
  id: string;
  user_id?: string;
  mission_id: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NDVIDataPoint {
  date: string;
  ndvi: number;
  ndre: number;
}

export interface SoilMetricReading {
  id: string;
  station_id: string;
  moisture_percentage: number;
  temperature_celsius: number;
  nitrogen_mg_kg: number;
  phosphorus_mg_kg: number;
  potassium_mg_kg: number;
  ec_ds_m: number;
  recorded_at: string;
}

export interface SoilSensorStation {
  id: string;
  field_id: string;
  station_code: string;
  location?: GeoJSON.Feature;
  soil_type: string;
  created_at: string;
  latest_reading?: SoilMetricReading;
}

export interface DroneTelemetry {
  id: string;
  drone_id: string;
  mission_id?: string;
  location?: GeoJSON.Feature;
  altitude_m: number;
  velocity_m_s: number;
  heading_deg: number;
  pitch_deg: number;
  roll_deg: number;
  battery_percentage: number;
  rtk_fix_status: string;
  signal_rssi_dbm: number;
  jetson_temp_celsius: number;
  rpi_temp_celsius?: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/** Item in the offline sync queue stored in IndexedDB */
export interface SyncQueueItem {
  id?: number;              // auto-increment PK
  type: 'laz' | 'geotiff' | 'metadata';
  missionId: string;
  payload: string;          // JSON-serialized or base64 blob reference
  chunkOffset: number;      // bytes uploaded so far
  totalSize: number;        // total bytes
  status: 'pending' | 'uploading' | 'complete' | 'error';
  createdAt: number;        // epoch ms
}


