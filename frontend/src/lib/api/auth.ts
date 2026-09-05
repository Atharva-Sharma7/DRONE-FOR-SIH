import { apiPost, apiGet } from './client';
import { User } from '@/types';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return apiPost('/auth/login', { email, password });
}

export async function getCurrentUser(): Promise<User> {
  return apiGet('/auth/me');
}

export async function refreshToken(): Promise<LoginResponse> {
  return apiPost('/auth/refresh');
}
