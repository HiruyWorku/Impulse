import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { getQuestion, submitAnswer, getMotivationNudge } from '../services/api';
import MotivationNudge from './MotivationNudge';
import ProgressBar from './ProgressBar';

/**
 * QuizInterface Component
 * Main quiz interface with adaptive questions and real-time feedback
 */
const QuizInterface = () => {
  const { state, dispatch } = useAppContext();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState('');

  // Load initial question when component mounts
  useEffect(() => {
    loadQuestion();
    loadMotivation();
  }, []);

  // Load a new question from the backend
  const loadQuestion = async () => {
    setIsLoading(true);
    try {
      // Start with medium difficulty, backend will adjust based on performance
      const questionData = await getQuestion('medium', state.sessionId);
      dispatch({ type: 'SET_QUESTION', payload: questionData });
      setSelectedAnswer(null);
      setIsAnswered(false);
      setExplanation('');
    } catch (error) {
      console.error('Failed to load question:', error);
      alert('Failed to load question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load motivation message
  const loadMotivation = async () => {
    try {
      const motivationData = await getMotivationNudge(state.sessionId);
      setMotivationMessage(motivationData.message);
      setShowMotivation(true);
    } catch (error) {
      console.error('Failed to load motivation:', error);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isAnswered) return;

    setIsLoading(true);
    try {
      const isAnswerCorrect = selectedAnswer === state.currentQuestion.correct_answer;
      
      // Submit answer to backend
      const response = await submitAnswer({
        question_id: state.currentQuestion.question_id,
        user_answer: selectedAnswer,
        is_correct: isAnswerCorrect,
        time_taken: 0 // Could track actual time taken
      }, state.sessionId);

      // Update local state
      setIsAnswered(true);
      setIsCorrect(isAnswerCorrect);
      setExplanation(response.explanation);
      
      // Update global stats
      dispatch({ type: 'SET_STATS', payload: response.session_stats });

      // Show motivation after a short delay
      setTimeout(() => {
        loadMotivation();
      }, 2000);

    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    setShowMotivation(false);
    loadQuestion();
  };

  // Handle return to welcome
  const handleReturnToWelcome = () => {
    dispatch({ type: 'SET_PAGE', payload: 'welcome' });
  };

  if (isLoading && !state.currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading your first question...</p>
        </div>
      </div>
    );
  }

  if (!state.currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No question available</p>
          <button onClick={handleReturnToWelcome} className="btn-outline mt-4">
            Return to Welcome
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-primary-600">Impulse</h1>
            <button
              onClick={handleReturnToWelcome}
              className="btn-outline text-sm"
            >
              ← Back to Welcome
            </button>
          </div>
          <ProgressBar 
            total={state.userStats.totalQuestions + 1}
            current={state.userStats.totalQuestions}
            accuracy={state.userStats.accuracy}
          />
        </div>

        {/* Main Quiz Card */}
        <div className="card mb-6">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Question {state.userStats.totalQuestions + 1}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                state.currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                state.currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {state.currentQuestion.difficulty.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {state.currentQuestion.question_text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {state.currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered || isLoading}
                className={`option-button ${
                  selectedAnswer === option ? 'selected' : ''
                } ${
                  isAnswered && option === state.currentQuestion.correct_answer ? 'correct' : ''
                } ${
                  isAnswered && selectedAnswer === option && option !== state.currentQuestion.correct_answer ? 'incorrect' : ''
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!isAnswered && (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || isLoading}
              className={`btn-primary w-full ${
                !selectedAnswer || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Submitting...' : 'Submit Answer'}
            </button>
          )}

          {/* Feedback Section */}
          {isAnswered && (
            <div className={`mt-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">
                  {isCorrect ? '✅' : '❌'}
                </span>
                <h3 className={`font-semibold ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
              </div>
              <p className="text-gray-700 mb-4">{explanation}</p>
              <button
                onClick={handleNextQuestion}
                className="btn-secondary"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>

        {/* Motivation Nudge */}
        {showMotivation && (
          <MotivationNudge 
            message={motivationMessage}
            onClose={() => setShowMotivation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default QuizInterface; 