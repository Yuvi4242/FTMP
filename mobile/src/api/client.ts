import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator 10.0.2.2 maps to host localhost; for iOS/Web localhost works directly
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${DEFAULT_HOST}:5000/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer demo_token_alex_morgan',
  },
});

export default apiClient;
