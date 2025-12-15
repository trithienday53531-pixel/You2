export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizConfig {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  enableTimer: boolean;
  timeMinutes: number;
}

export interface QuizState {
  status: 'upload' | 'config' | 'playing' | 'result';
  questions: Question[];
  userAnswers: Record<string, string>; // questionId -> selectedOption
  timeRemaining: number;
  score: number;
  fileName?: string;
}

export enum FileType {
  TXT = 'text/plain',
  PDF = 'application/pdf',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}