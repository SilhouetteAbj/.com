import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '@/types/index';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch data' };
    }
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to post data' };
    }
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to update data' };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to delete data' };
    }
  }
}

export const apiClient = new ApiClient();
