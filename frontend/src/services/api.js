import axios from 'axios';

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Service for Impulse Backend Communication
 * Handles all HTTP requests to the FastAPI backend
 */

// Session Management
export const startSession = async () => {
  try {
    const response = await api.post('/session/start');
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
    throw new Error('Failed to start session');
  }
};

// Question Management
export const getQuestion = async (difficulty, sessionId) => {
  try {
    const response = await api.get(`/questions/${difficulty}`, {
      params: { session_id: sessionId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw new Error('Failed to fetch question');
  }
};

export const submitAnswer = async (questionData, sessionId) => {
  try {
    const response = await api.post('/questions/submit', questionData, {
      params: { session_id: sessionId }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw new Error('Failed to submit answer');
  }
};

// Motivation System
export const getMotivationNudge = async (sessionId) => {
  try {
    const response = await api.get('/motivation/nudge', {
      params: { session_id: sessionId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching motivation:', error);
    throw new Error('Failed to fetch motivation message');
  }
};

// Session Statistics
export const getSessionStats = async (sessionId) => {
  try {
    const response = await api.get(`/session/stats/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session stats:', error);
    throw new Error('Failed to fetch session statistics');
  }
};

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw new Error('Backend is not available');
  }
};

export default api; 