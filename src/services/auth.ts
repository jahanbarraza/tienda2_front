// Servicio de autenticación

import { apiService } from './api';
import { LOCAL_STORAGE_KEYS } from '../constants';
import type { LoginCredentials, AuthUser, ApiResponse } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await apiService.post<ApiResponse<AuthUser>>('/auth/login', credentials);
    
    if (response.success && response.data) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error(response.message || 'Error en el login');
  }

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
  }

  getCurrentUser(): AuthUser | null {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  }
}

export const authService = new AuthService();

