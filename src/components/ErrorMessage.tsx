import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const handleRetry = () => {
    if (message.includes('Usuário não autenticado')) {
      window.location.href = '/login'; // Redirect to login page
    } else if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="glass-card rounded-xl p-8 max-w-md text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-accent-red mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-dark-text">Ocorreu um erro</h2>
        <p className="text-dark-text-secondary mb-6">{message}</p>
        <button
          onClick={handleRetry}
          className="glass-button-success px-4 py-2 rounded-lg text-sm font-medium text-accent-green hover:text-white hover:bg-accent-green transition-all duration-200"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;