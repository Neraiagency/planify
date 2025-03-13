import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  autoCloseTime?: number; // Time in ms after which the modal should auto-close
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  icon,
  autoCloseTime 
}) => {
  useEffect(() => {
    if (isOpen && autoCloseTime) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card rounded-xl w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-text-secondary hover:text-dark-text transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-4">
            {icon && <div className="mr-3">{icon}</div>}
            <h2 className="text-xl font-semibold gradient-text">{title}</h2>
          </div>
          
          <div className="text-dark-text mb-6">
            {children}
          </div>
          
          <button
            onClick={onClose}
            className="glass-button w-full px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;