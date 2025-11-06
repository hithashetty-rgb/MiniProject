import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaFire, FaClock, FaTrophy, FaArrowRight } from 'react-icons/fa';
import { PracticeSession, ProgressMetric } from '@/types';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load recent sessions
      const { data: sessions } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentSessions(sessions || []);

      // Load progress metrics
      const { data: progressData } = await supabase
        .from('progress_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

      // Calculate summary metrics
      if (progressData && progressData.length > 0) {
        const avgScore = progressData.find(m => m.metric_type === 'average_score')?.value || 0;
        const totalSessions = progressData.find(m => m.metric_type === 'total_sessions')?.value || 0;
        const streak = progressData.find(m => m.metric_type === 'streak')?.value || 0;
        const practiceTime = progressData.find(m => m.metric_type === 'practice_time')?.value || 0;

        setMetrics({
          averageScore: avgScore,
          totalSessions: totalSessions,
          currentStreak: streak,
          totalMinutes: practiceTime,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    {
      title: 'Start Practice',
      description: 'Begin a mock interview session',
      icon: FaBrain,
      color: 'bg-indigo-500',
      link: '/practice',
    },
    {
      title: 'Browse Questions',
      description: 'Explore question bank',
      icon: FaBrain,
      color: 'bg-purple-500',
      link: '/questions',
    },
    {
      title: 'View Progress',
      description: 'Check your analytics',
      icon: FaChartLine,
      color: 'bg-blue-500',
      link: '/analytics',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'there'}!
        </h1>
        <p className="text-indigo-100">
          Ready to practice and improve your interview skills?
        </p>
      </motion.div>

      {/* Stats Cards */}
      {!loading && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{Math.round(metrics.averageScore)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaTrophy className="text-blue-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalSessions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaBrain className="text-purple-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.currentStreak}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaFire className="text-orange-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Practice Time</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalMinutes}m</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaClock className="text-green-600 text-2xl" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  to={action.link}
                  className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group"
                >
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <div className="flex items-center text-indigo-600 font-medium">
                    <span>Get started</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {recentSessions.length === 0 ? (
            <div className="p-8 text-center">
              <FaBrain className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No practice sessions yet. Start practicing to see your activity here!</p>
              <Link
                to="/practice"
                className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Start Practice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentSessions.map((session) => (
                <div key={session.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {session.session_type.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {session.questions_answered} questions • {session.duration_minutes} minutes
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {session.score !== null && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">{session.score}</p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
