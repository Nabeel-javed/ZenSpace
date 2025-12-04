export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
}
