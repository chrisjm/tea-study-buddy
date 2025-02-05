// Database Models
export interface TeaSteep {
  id: number;
  teaSessionId: number;
  steepNumber: number;
  temperature?: number | null;
  steepTimeMin?: number | null;
  steepTimeMax?: number | null;
  actualSteepTime?: number | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface TeaSession {
  id: number;
  threadId?: string | null;
  teaType: string;
  teaStyle: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface Message {
  id: number;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
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

// OpenAI Types
export type MessageContentType = 'text' | 'image_file';

export interface TextContent {
  type: 'text';
  text: {
    value: string;
    annotations: any[];
  };
}

export interface ImageFileContent {
  type: 'image_file';
  image_file: {
    file_id: string;
  };
}

export type MessageContent = TextContent | ImageFileContent;
