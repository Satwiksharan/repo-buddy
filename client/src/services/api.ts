import axios from 'axios';

const defaultApiUrl = import.meta.env.PROD
  ? 'https://repo-buddy.onrender.com/api'
  : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 25000
});

export interface HealthResponse {
  success: boolean;
  message: string;
}

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};

export default api;
