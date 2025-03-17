/**
 * 公式数据模型
 */
export interface Formula {
  id: string;
  title: string;
  content: string;
  category: string;
  subject: string;
  grade: string;
  accuracy: number; // 掌握度百分比 0-100
  isFavorite: boolean;
  practiceCount: number;
  lastPracticeDate?: string;
}

/**
 * 练习记录数据模型
 */
export interface PracticeRecord {
  id: string;
  formulaId: string;
  date: string;
  accuracy: number;
  timeTaken: number; // 秒
  questionCount: number;
  correctCount: number;
}

/**
 * 练习题目数据模型
 */
export interface PracticeQuestion {
  id: string;
  formulaId: string;
  question: string;
  answer: string;
  options?: string[]; // 选择题选项
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * 用户答题记录
 */
export interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number; // 秒
}

/**
 * 错题记录
 */
export interface ErrorRecord {
  id: string;
  formulaId: string;
  formulaTitle: string;
  questionId: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  date: string;
  reviewCount: number; // 复习次数
  lastReviewDate?: string;
}

/**
 * 用户搜索历史
 */
export interface SearchHistory {
  id: string;
  keyword: string;
  timestamp: string;
}

/**
 * 用户设置
 */
export interface UserSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  defaultSubject?: string;
  defaultGrade?: string;
} 