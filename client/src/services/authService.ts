import api from './api';

export interface UserProfile {
  id: string;
  githubId: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  targetRole: string;
}

export const fetchCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const response = await api.get<{ success: boolean; data: UserProfile }>('/auth/me');
    return response.data.data;
  } catch (error) {
    return null;
  }
};

export const logoutUser = async (): Promise<boolean> => {
  try {
    const response = await api.post<{ success: boolean }>('/auth/logout');
    return response.data.success;
  } catch (error) {
    return false;
  }
};
