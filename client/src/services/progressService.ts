import api from './api';

export interface ProgressHistoryItem {
  interview: string;
  score: number;
  explanation: number;
  architecture: number;
  database?: number;
  date?: string;
}

export interface CategoryGrowthItem {
  category: string;
  initialScore: number;
  currentScore: number;
  growth: string;
}

export interface ProgressMetricsResponse {
  success: boolean;
  repositoryId?: string;
  data: {
    currentReadinessScore: number;
    totalInterviewsTaken: number;
    history: ProgressHistoryItem[];
    categoryGrowth: CategoryGrowthItem[];
  };
}

export const fetchGlobalProgress = async (): Promise<ProgressMetricsResponse> => {
  const response = await api.get<ProgressMetricsResponse>('/progress');
  return response.data;
};

export const fetchRepositoryProgress = async (repoId: string): Promise<ProgressMetricsResponse> => {
  const response = await api.get<ProgressMetricsResponse>(`/repositories/${repoId}/progress`);
  return response.data;
};
