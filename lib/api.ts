import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// Poll types
export interface PollOption {
  id: number;
  text: string;
  votes: number;
  voters: Array<User>;
}

export interface Poll {
  id: number;
  question: string;
  createdAt: string;
  author: User;
  options: PollOption[];
}

export interface PollsMeta {
  totalPolls: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface PollsResponse {
  data: Poll[];
  meta: PollsMeta;
}

export interface GetPollsParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'question' | 'votes';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface CreatePollRequest {
  question: string;
  options: string[];
}

export interface VoteRequest {
  pollId: number;
  optionId: number;
}

// Auth API functions
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/signup', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/users/me');
    return response.data;
  },

  updateUser: async (data: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<User>('/api/users/me', data);
    return response.data;
  },
};

// Polls API functions
export const pollsApi = {
  createPoll: async (data: CreatePollRequest): Promise<Poll> => {
    const response = await api.post<Poll>('/api/polls', data);
    return response.data;
  },

  getPolls: async (params: GetPollsParams = {}): Promise<PollsResponse> => {
    const response = await api.get<PollsResponse>('/api/polls', { params });
    return response.data;
  },

  getPoll: async (id: number): Promise<Poll> => {
    const response = await api.get<Poll>(`/api/polls/${id}`);
    return response.data;
  },

  deletePoll: async (id: number): Promise<void> => {
    await api.delete(`/api/polls/${id}`);
  },

  updatePoll: async (id: number, data: UpdatePollRequest): Promise<Poll> => {
    const response = await api.patch<Poll>(`/api/polls/${id}`, data);
    return response.data;
  },
};

// Votes API functions
export const votesApi = {
  vote: async (data: VoteRequest): Promise<Poll> => {
    const response = await api.post<Poll>('/api/votes', data);
    return response.data;
  },

  retractVote: async (pollId: number): Promise<Poll> => {
    const response = await api.delete<Poll>(`/api/votes/poll/${pollId}`);
    return response.data;
  },
};

export interface UpdateUserRequest {
  name: string;
}

export interface UpdatePollRequest {
  question: string;
}



