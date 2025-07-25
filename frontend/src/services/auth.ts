import axios, { AxiosInstance } from 'axios';
import { ApiResponse, AuthResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          data: {} as AuthResponse,
          message: error.response?.data?.message || 'Login failed',
        };
      }
      return {
        status: 500,
        data: {} as AuthResponse,
        message: 'An unexpected error occurred',
      };
    }
  },

  signup: async (name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', {
        name,
        email,
        password,
      });
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          data: {} as AuthResponse,
          message: error.response?.data?.message || 'Signup failed',
        };
      }
      return {
        status: 500,
        data: {} as AuthResponse,
        message: 'An unexpected error occurred',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};