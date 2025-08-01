import React, { useEffect } from 'react';

/**
 * MotivationNudge Component
 * Displays motivational messages to encourage users during their learning session
 */
const MotivationNudge = ({ message, onClose }) => {
  // Auto-hide the motivation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 max-w-sm animate-bounce-slow">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-xl p-4 border-l-4 border-yellow-300">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">💪</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              {message}
            </p>
          </div>
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationNudge; 