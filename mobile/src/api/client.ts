import axios from 'axios';
import { Platform } from 'react-native';

// In production, use EXPO_PUBLIC_API_URL; for Android emulator 10.0.2.2 maps to host localhost; for iOS/Web localhost works directly
const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();

let activeToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  activeToken = token;
};

export const getAuthToken = (): string | null => activeToken;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (activeToken) {
    config.headers.Authorization = `Bearer ${activeToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default apiClient;
