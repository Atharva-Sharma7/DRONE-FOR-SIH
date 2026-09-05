import { apiGet, apiPost } from './client';
import { SoilSensorStation, SoilMetricReading } from '@/types';

export async function getSoilSensorStations(): Promise<SoilSensorStation[]> {
  return apiGet('/soil-sensors');
}

export async function ingestLoRaWANPayload(stationCode: string, hexPayload: str): Promise<SoilMetricReading> {
  return apiPost('/soil-sensors/lorawan-ingest', { station_code: stationCode, hex_payload: hexPayload });
}
