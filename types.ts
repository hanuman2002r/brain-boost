
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserStats {
  points: number;
  streak: number;
  quizzesCompleted: number;
  cardsMastered: number;
  rank: string;
}

export enum AppMode {
  LEARNING = 'LEARNING',
  CHALLENGE = 'CHALLENGE'
}

export type ImageSize = '1K' | '2K' | '4K';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
