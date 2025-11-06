import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaRocket, FaTrophy, FaClock, FaUsers } from 'react-icons/fa';

export default function LandingPage() {
  const features = [
    {
      icon: FaBrain,
      title: 'AI-Powered Feedback',
      description: 'Get instant, intelligent feedback on your interview responses',
    },
    {
      icon: FaChartLine,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and insights',
    },
    {
      icon: FaRocket,
      title: 'Practice Sessions',
      description: 'Realistic mock interviews tailored to your target role',
    },
    {
      icon: FaTrophy,
      title: 'Question Bank',
      description: 'Access hundreds of curated interview questions',
    },
    {
      icon: FaClock,
      title: 'Flexible Learning',
      description: 'Practice anytime, anywhere at your own pace',
    },
    {
      icon: FaUsers,
      title: 'Personalized Path',
      description: 'Customized preparation based on your experience level',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FaBrain className="text-indigo-600 text-2xl" />
              <span className="text-xl font-bold text-gray-900">Interview Prep AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your Interview Skills with{' '}
            <span className="text-indigo-600">AI-Powered Practice</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Prepare for your dream job with personalized interview practice, instant feedback,
            and comprehensive progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-lg"
            >
              Start Practicing Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold text-lg"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Interview Prep AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold mb-2">18+</p>
              <p className="text-indigo-200">Question Categories</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">AI-Powered</p>
              <p className="text-indigo-200">Instant Feedback</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">24/7</p>
              <p className="text-indigo-200">Practice Availability</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of professionals improving their interview skills
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FaBrain className="text-indigo-400 text-2xl" />
            <span className="text-xl font-bold">Interview Prep AI</span>
          </div>
          <p className="text-gray-400">
            Your AI-powered interview preparation platform
          </p>
        </div>
      </footer>
    </div>
  );
}
