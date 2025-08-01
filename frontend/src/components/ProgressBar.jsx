import React from 'react';

/**
 * ProgressBar Component
 * Displays user progress through questions and current accuracy
 */
const ProgressBar = ({ total, current, accuracy }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            Progress: {current}/{total} questions
          </span>
          <span className="text-sm font-medium text-gray-700">
            Accuracy: {accuracy}%
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {Math.round(progressPercentage)}% complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Accuracy Indicator */}
      <div className="mt-2 flex items-center justify-center">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          accuracy >= 80 ? 'bg-green-100 text-green-800' :
          accuracy >= 60 ? 'bg-yellow-100 text-yellow-800' :
          accuracy >= 40 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          <span className="mr-1">
            {accuracy >= 80 ? '🌟' : accuracy >= 60 ? '💪' : accuracy >= 40 ? '📚' : '🌱'}
          </span>
          {accuracy >= 80 ? 'Excellent' : 
           accuracy >= 60 ? 'Good' : 
           accuracy >= 40 ? 'Learning' : 'Keep Going'}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 