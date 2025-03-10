import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-dark-bg">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-blue mb-4"></div>
        <p className="text-dark-text-secondary">Carregando dados...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;