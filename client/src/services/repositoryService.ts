import api from './api';

export interface RepositoryData {
  githubId: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  defaultBranch: string;
  language: string;
  isPrivate: boolean;
  stars: number;
  forks?: number;
  updatedAt: string;
}

export interface FetchRepositoriesResponse {
  success: boolean;
  isDemo?: boolean;
  count?: number;
  data: RepositoryData[];
}

export interface AnalysisReportResponse {
  success: boolean;
  data: {
    githubId: string;
    healthScore: {
      overall: number;
      architecture: number;
      codeQuality: number;
      security: number;
      testing: number;
      documentation: number;
      dependencies: number;
    };
    architecture: {
      primaryPattern: string;
      structure: Record<string, boolean>;
      patterns: Array<{ pattern: string; status: string; confidence: string }>;
      summary: string;
    };
    technologies: {
      frontend: string[];
      backend: string[];
      database: string[];
      authentication: string[];
      testing: string[];
      deployment: string[];
    };
    importantFiles: string[];
    projectContext: any;
  };
}

export interface ExplanationResponse {
  success: boolean;
  repositoryId?: string;
  data: {
    isFallback?: boolean;
    summary30s: string;
    summary1m: string;
    summary3m: string;
    techDecisions?: Array<{ technology: string; question: string; explanation: string }>;
    sections?: Record<string, string>;
  };
}

export interface EvaluationResponse {
  success: boolean;
  repositoryId?: string;
  data: {
    scores: {
      projectUnderstanding: number;
      structure: number;
      technicalDepth: number;
      clarity: number;
      completeness: number;
      overall: number;
    };
    strengths: string[];
    missingConcepts: string[];
    feedback: string;
    followUpQuestion?: string;
  };
}

export const fetchUserRepositories = async (): Promise<FetchRepositoriesResponse> => {
  const response = await api.get<FetchRepositoriesResponse>('/github/repositories');
  return response.data;
};

export const scanRepository = async (id: string): Promise<AnalysisReportResponse> => {
  const response = await api.post<AnalysisReportResponse>(`/repositories/${id}/scan`);
  return response.data;
};

export const fetchRepositoryAnalysis = async (id: string): Promise<AnalysisReportResponse> => {
  const response = await api.get<AnalysisReportResponse>(`/repositories/${id}/analysis`);
  return response.data;
};

export const fetchProjectExplanation = async (id: string): Promise<ExplanationResponse> => {
  const response = await api.get<ExplanationResponse>(`/repositories/${id}/explanation`);
  return response.data;
};

export const evaluateExplanation = async (id: string, answer: string): Promise<EvaluationResponse> => {
  const response = await api.post<EvaluationResponse>(`/repositories/${id}/explanation/evaluate`, { answer });
  return response.data;
};

export const importGithubRepository = async (url: string, token?: string) => {
  const response = await api.post('/github/import', { url, token });
  return response.data;
};
