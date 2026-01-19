// Course Types for Content Transformer Enhancement
// Enables Udemy-style micromodule generation with visualizations

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleVisualization {
  type: 'flowchart' | 'mindmap' | 'diagram' | 'timeline' | 'sequence';
  mermaidCode: string;
  description: string;
}

export interface CourseModule {
  id: string;
  order: number;
  title: string;
  duration: string;
  objectives: string[];
  content: string;
  keyPoints: string[];
  visualization: ModuleVisualization;
  quiz: QuizQuestion[];
  videoQuery?: string;
  isCompleted: boolean;
}

export interface GeneratedCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  totalDuration: string;
  totalModules: number;
  modules: CourseModule[];
  createdAt: string;
  sourceFileName?: string;
}

export interface CourseGenerationInput {
  content: string;
  title?: string;
  subject: string;
  gradeLevel: string;
  numberOfModules?: number;
  language: string;
  region: string;
  ncertContext?: string;
  isNcertMode?: boolean;
}

export interface NCERTSource {
  id: string;
  title: string;
  type: 'json' | 'pdf';
  subject: string;
  grade: string;
  path: string;
}

export interface FileUploadState {
  file: File | null;
  fileName: string;
  fileType: string;
  content: string;
  isProcessing: boolean;
  error: string | null;
}

// Supported file types for upload
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

export const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF Document',
  'text/plain': 'Text File',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'image/png': 'PNG Image',
  'image/jpeg': 'JPEG Image',
  'image/jpg': 'JPG Image'
};

// Live Quiz & Leaderboard Types
export interface QuizParticipant {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  lastAnsweredCorrectly: boolean | null;
  responseTime: number; // in milliseconds
  status: 'joined' | 'answering' | 'finished';
}

export interface LiveQuizSession {
  id: string;
  moduleId: string;
  currentQuestionIndex: number;
  participants: QuizParticipant[];
  isActive: boolean;
  startTime: string;
}
