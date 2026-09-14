import api from './api';

export interface QuestionItem {
  id?: number;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedConcepts: string[];
  sourceFiles: string[];
}

export interface QuestionBankResponse {
  success: boolean;
  count: number;
  data: QuestionItem[];
}

export interface InterviewSession {
  _id: string;
  repositoryId: string;
  questions: Array<{
    questionIndex: number;
    questionText: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    expectedConcepts: string[];
    sourceFiles: string[];
  }>;
  status: string;
}

export const fetchRepositoryQuestions = async (repoId: string): Promise<QuestionBankResponse> => {
  const response = await api.get<QuestionBankResponse>(`/repositories/${repoId}/questions`);
  return response.data;
};

export const createInterviewSession = async (repositoryId: string) => {
  const response = await api.post<{ success: boolean; data: InterviewSession }>('/interviews', { repositoryId });
  return response.data;
};

export const submitInterviewAnswer = async (interviewId: string, questionIndex: number, answer: string) => {
  const response = await api.post(`/interviews/${interviewId}/answer`, { questionIndex, answer });
  return response.data;
};

export const finishInterviewSession = async (interviewId: string) => {
  const response = await api.post(`/interviews/${interviewId}/finish`);
  return response.data;
};
