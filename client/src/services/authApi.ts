import apiClient from './api';
import { AuthResponse } from '../types';

export const authApi = {
  /**
   * Log into account with email and password
   * Demo bypass credentials: demo@overturn.justice / demo1234
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register a new policyholder or advocate account
   */
  async register(name: string, email: string, password: string, role: string = 'policyholder'): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse>('/auth/me');
    return response.data;
  },
};

export default authApi;

