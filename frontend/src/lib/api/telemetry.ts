import { apiGet, apiPost } from './client';
import { DroneTelemetry } from '@/types';

export async function getLiveTelemetry(droneId: string): Promise<DroneTelemetry | null> {
  return apiGet(`/telemetry/live/${droneId}`);
}

export async function ingestTelemetry(data: Partial<DroneTelemetry>): Promise<DroneTelemetry> {
  return apiPost('/telemetry/ingest', data);
}
