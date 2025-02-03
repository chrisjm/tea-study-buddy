// Database Models
export interface TeaSession {
  id: number;
  threadId: string;
  teaType: string;
  teaStyle: string;
  brewingTemp?: number | null;
  steepTime?: number | null;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
}

export interface Message {
  id: number;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date | string;
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  threadId: string;
}

// Form Types
export interface TeaSessionFormData {
  teaType: string;
  teaStyle: string;
  brewingTemp?: number | null;
  steepTime?: number | null;
  notes?: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TeaSessionResponse extends ApiResponse<TeaSession> {}
export interface TeaSessionListResponse extends ApiResponse<TeaSession[]> {}
export interface MessageResponse extends ApiResponse<Message> {}
export interface MessageListResponse extends ApiResponse<Message[]> {}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
export interface ThemeState {
  theme: Theme;
  systemTheme: 'light' | 'dark';
}
