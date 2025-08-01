import React, { createContext, useContext, useReducer } from 'react';
import WelcomePage from './components/WelcomePage';
import QuizInterface from './components/QuizInterface';
import './App.css';

// Impulse - AI-Enhanced Physics Study Companion (Deployment Ready)

// Context for global state management
const AppContext = createContext();

// Initial state
const initialState = {
  currentPage: 'welcome',
  sessionId: null,
  currentQuestion: null,
  userStats: {
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0
  },
  motivationMessage: '',
  isLoading: false,
  error: null
};

// Reducer for state management
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };
    case 'SET_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'SET_STATS':
      return { ...state, userStats: action.payload };
    case 'SET_MOTIVATION':
      return { ...state, motivationMessage: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Custom hook to use app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Render different pages based on current state
  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'welcome':
        return <WelcomePage />;
      case 'quiz':
        return <QuizInterface />;
      default:
        return <WelcomePage />;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App min-h-screen">
        {renderCurrentPage()}
      </div>
    </AppContext.Provider>
  );
}

export default App;
