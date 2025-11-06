export interface User {
  id: string;
  email?: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  target_role: string | null;
  experience_level: string | null;
  company_preferences: string[] | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  category: string;
  difficulty: string;
  question_text: string;
  expected_points: string[] | null;
  tags: string[] | null;
  created_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  session_type: string;
  duration_minutes: number | null;
  questions_answered: number | null;
  score: number | null;
  feedback: string | null;
  session_data: any;
  created_at: string;
}

export interface UserResponse {
  id: string;
  session_id: string;
  question_id: string;
  user_id: string;
  response_text: string | null;
  audio_url: string | null;
  response_time_seconds: number | null;
  ai_feedback: string | null;
  self_rating: number | null;
  created_at: string;
}

export interface ProgressMetric {
  id: string;
  user_id: string;
  metric_type: string;
  category: string | null;
  value: number;
  date: string;
}

export interface AIFeedback {
  id: string;
  user_id: string;
  feedback_type: string;
  content: string;
  context: any;
  helpful: boolean | null;
  created_at: string;
}

export interface AnalyzeResponseResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  keyPointsCovered: string[];
  missedPoints: string[];
}

export interface ProgressMetrics {
  totalSessions: number;
  totalResponses: number;
  averageScore: number;
  totalMinutes: number;
  averageResponseTime: number;
  categoryBreakdown: Record<string, any>;
  improvementTrend: number;
  currentStreak: number;
  lastPracticeDate: string | null;
}
