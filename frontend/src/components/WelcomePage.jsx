import React, { useState } from 'react';
import { useAppContext } from '../App';
import { startSession } from '../services/api';

/**
 * WelcomePage Component
 * Displays the app introduction and handles session initialization
 */
const WelcomePage = () => {
  const { dispatch } = useAppContext();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      // Start a new session with the backend
      const sessionData = await startSession();
      
      // Update global state with session ID
      dispatch({ type: 'SET_SESSION', payload: sessionData.session_id });
      
      // Navigate to quiz interface
      dispatch({ type: 'SET_PAGE', payload: 'quiz' });
    } catch (error) {
      console.error('Failed to start session:', error);
      // In a real app, you'd show an error message to the user
      alert('Failed to start session. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Content Card */}
        <div className="card max-w-2xl mx-auto fade-in-up">
          {/* App Logo/Title */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-primary-600 mb-4">
              Impulse
            </h1>
            <div className="text-2xl text-gray-600 mb-2">
              AI-Enhanced Physics Study Companion
            </div>
            <div className="text-lg text-gray-500">
              Master physics concepts with personalized learning
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="font-semibold text-gray-800 mb-2">Adaptive Learning</h3>
              <p className="text-sm text-gray-600">
                Questions adjust to your performance level
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Real-time Feedback</h3>
              <p className="text-sm text-gray-600">
                Get instant explanations for every answer
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💪</div>
              <h3 className="font-semibold text-gray-800 mb-2">Motivation Boost</h3>
              <p className="text-sm text-gray-600">
                Encouraging messages to keep you going
              </p>
            </div>
          </div>

          {/* Demo Information */}
          <div className="bg-primary-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-primary-800 mb-3">
              🎯 Demo Features
            </h3>
            <div className="text-sm text-primary-700 space-y-1">
              <p>• Multiple-choice physics questions</p>
              <p>• Adaptive difficulty based on performance</p>
              <p>• Real-time feedback and explanations</p>
              <p>• Motivational nudges throughout the session</p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartSession}
            disabled={isStarting}
            className={`btn-primary text-xl px-8 py-4 ${
              isStarting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isStarting ? (
              <div className="flex items-center">
                <div className="spinner mr-3"></div>
                Starting Session...
              </div>
            ) : (
              '🚀 Start Learning'
            )}
          </button>

          {/* Footer */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Built for introductory physics students</p>
            <p className="mt-1">Click start to begin your personalized learning journey!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 