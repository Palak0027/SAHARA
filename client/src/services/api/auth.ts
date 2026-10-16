const API_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const post = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
};

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: 'donor' | 'receiver' | 'volunteer' | 'admin';
}

export const registerUser = (payload: Record<string, unknown>) =>
  post<{ message: string }>('/api/auth/register', payload);

export const loginUser = (credentials: { phone: string; password: string }) =>
  post<{ token: string; user: AuthUser }>('/api/auth/login', {
    identifier: credentials.phone,
    password: credentials.password
  });

import { http } from './http';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = (payload: ChangePasswordPayload) =>
  http.put<{ success: boolean; message: string }>('/api/auth/change-password', payload);