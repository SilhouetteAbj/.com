// Common types used across the application
export type ServiceId = '4d-ultrasound' | 'ct-scan' | 'mammogram' | 'endoscopy' | 'colonoscopy' | 'eeg';
export type DnaTestType = 'paternity' | 'immigration' | 'family' | 'wellness';
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
