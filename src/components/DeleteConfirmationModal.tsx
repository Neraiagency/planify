import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card rounded-xl w-full max-w-md p-5 relative">
        <div className="flex items-center mb-4">
          <div className="bg-accent-red bg-opacity-10 p-2 rounded-full mr-3">
            <AlertTriangle className="h-6 w-6 text-accent-red" />
          </div>
          <h2 className="text-xl font-semibold text-dark-text">{title}</h2>
        </div>
        
        <p className="text-dark-text-secondary mb-3">{message}</p>
        {itemName && (
          <p className="font-medium text-dark-text mb-5 px-3 py-2 bg-dark-card bg-opacity-50 rounded-lg">
            {itemName}
          </p>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-dark-text-secondary hover:text-dark-text border border-dark-border hover:border-dark-text-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="glass-button-danger px-4 py-2 rounded-lg text-sm font-medium text-accent-red hover:text-white hover:bg-accent-red transition-all duration-200"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;