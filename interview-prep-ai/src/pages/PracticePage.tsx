import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaBrain, FaClock, FaPlay, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Question, PracticeSession } from '@/types';

export default function PracticePage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'select' | 'practice' | 'review'>('select');
  const [selectedCategory, setSelectedCategory] = useState<string>('behavioral');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('beginner');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const categories = [
    { value: 'behavioral', label: 'Behavioral', icon: '💼' },
    { value: 'technical', label: 'Technical', icon: '💻' },
    { value: 'case_study', label: 'Case Study', icon: '📊' },
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-500' },
  ];

  async function startPractice() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: {
          category: selectedCategory,
          difficulty: selectedDifficulty,
          count: 5,
        },
      });

      if (error) throw error;

      const generatedQuestions = data?.data?.questions || [];
      if (generatedQuestions.length === 0) {
        toast.error('No questions available for this selection');
        return;
      }

      setQuestions(generatedQuestions);
      setMode('practice');
      setSessionStartTime(new Date());
      setQuestionStartTime(new Date());
      setCurrentQuestionIndex(0);
      setResponses({});
      toast.success('Practice session started!');
    } catch (error: any) {
      console.error('Error starting practice:', error);
      toast.error('Failed to start practice session');
    } finally {
      setLoading(false);
    }
  }

  async function handleNextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const response = responses[currentQuestion.id] || '';

    if (!response.trim()) {
      toast.error('Please provide a response before continuing');
      return;
    }

    // If feedback already exists for this question, move to next
    if (aiAnalysis && aiAnalysis[currentQuestion.id]) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestionStartTime(new Date());
      } else {
        await finishSession();
      }
      return;
    }

    // Analyze the current response
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-response', {
        body: {
          questionText: currentQuestion.question_text,
          questionCategory: currentQuestion.category,
          userResponse: response,
          expectedPoints: currentQuestion.expected_points || [],
        },
      });

      if (error) throw error;
      
      const analysis = data?.data;
      setAiAnalysis({ ...aiAnalysis, [currentQuestion.id]: analysis });

      // Save response to database
      if (user) {
        const responseTime = questionStartTime
          ? Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)
          : 0;

        await supabase.from('user_responses').insert({
          question_id: currentQuestion.id,
          user_id: user.id,
          response_text: response,
          response_time_seconds: responseTime,
          ai_feedback: analysis?.feedback,
          self_rating: null,
          session_id: 'temp-session-' + Date.now(),
        });
      }

      toast.success('Response analyzed! Review feedback below, then click Next.');
    } catch (error) {
      console.error('Error analyzing response:', error);
      toast.error('Failed to analyze response');
    } finally {
      setAnalyzing(false);
    }
  }

  async function finishSession() {
    if (!user || !sessionStartTime) return;

    try {
      const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000);
      const scores = Object.values(aiAnalysis || {}).map((a: any) => a?.score || 0);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      await supabase.from('practice_sessions').insert({
        user_id: user.id,
        session_type: 'mock_interview',
        duration_minutes: duration,
        questions_answered: questions.length,
        score: averageScore,
        feedback: 'Session completed successfully',
        session_data: {
          category: selectedCategory,
          difficulty: selectedDifficulty,
          responses: Object.keys(responses).length,
        },
      });

      setMode('review');
      toast.success('Practice session completed!');
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {mode === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Practice Session</h1>
              <p className="text-gray-600">Choose your category and difficulty level</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Select Category
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`p-6 rounded-xl border-2 transition ${
                        selectedCategory === cat.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{cat.icon}</div>
                      <div className="font-semibold text-gray-900">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Select Difficulty
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setSelectedDifficulty(diff.value)}
                      className={`p-6 rounded-xl border-2 transition ${
                        selectedDifficulty === diff.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${diff.color} mb-2 mx-auto`} />
                      <div className="font-semibold text-gray-900">{diff.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startPractice}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <FaPlay />
                <span>{loading ? 'Loading Questions...' : 'Start Practice'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'practice' && currentQuestion && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaClock />
                  <span>
                    {sessionStartTime
                      ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000)
                      : 0}{' '}
                    min
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold capitalize">
                  {currentQuestion.category.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold capitalize">
                  {currentQuestion.difficulty}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.question_text}</h2>

              {currentQuestion.expected_points && currentQuestion.expected_points.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">Points to Consider:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {currentQuestion.expected_points.map((point, idx) => (
                      <li key={idx} className="text-blue-800 text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Your Response</label>
                <textarea
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) =>
                    setResponses({ ...responses, [currentQuestion.id]: e.target.value })
                  }
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Type your response here..."
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setMode('select')}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition flex items-center space-x-2"
                >
                  <FaArrowLeft />
                  <span>Exit Practice</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={analyzing}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center space-x-2"
                >
                  <span>
                    {analyzing
                      ? 'Analyzing...'
                      : aiAnalysis && aiAnalysis[currentQuestion.id]
                      ? currentQuestionIndex < questions.length - 1
                        ? 'Next Question'
                        : 'Finish Session'
                      : 'Submit & Analyze'}
                  </span>
                  {!analyzing && aiAnalysis && aiAnalysis[currentQuestion.id] && (
                    currentQuestionIndex < questions.length - 1 ? <FaArrowRight /> : <FaCheck />
                  )}
                </button>
              </div>
            </div>

            {/* AI Feedback for current question */}
            {aiAnalysis && aiAnalysis[currentQuestion.id] && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">AI Feedback</h3>
                <p className="text-green-800 whitespace-pre-line">{aiAnalysis[currentQuestion.id].feedback}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="px-4 py-2 bg-white rounded-lg">
                    <span className="text-sm text-gray-600">Score: </span>
                    <span className="font-bold text-green-600">{aiAnalysis[currentQuestion.id].score}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {mode === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
              <p className="text-green-100">Great job on completing your practice session</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Session Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sessionStartTime
                      ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000)
                      : 0}m
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Category</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {selectedCategory.replace('_', ' ')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Difficulty</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{selectedDifficulty}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setMode('select')}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Start New Session
                </button>
                <button
                  onClick={() => window.location.href = '/analytics'}
                  className="flex-1 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
