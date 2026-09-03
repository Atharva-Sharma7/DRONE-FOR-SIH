import { apiPost, apiGet } from './client';
import { User } from '@/types';

export async function loginUser(email: string, password: string):Promise<{token: string, user: User}> {
  return apiPost('/auth/login', { email, password });
}

export async function getCurrentUser():Promise<User> {
  return apiGet('/auth/me');
}

export async function refreshToken():Promise<{token: string}> {
  return apiPost('/auth/refresh');
}
