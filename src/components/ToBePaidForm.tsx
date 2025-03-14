import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionStatus } from '../types';
import { X, CheckCircle } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

interface ToBePaidFormProps {
  onClose: () => void;
  editItem?: {
    id: string;
    description: string;
    amount: number;
    status: TransactionStatus;
  };
}

const ToBePaidForm: React.FC<ToBePaidFormProps> = ({ onClose, editItem }) => {
  const { addToBePaid, updateToBePaidStatus } = useFinance();
  
  const [description, setDescription] = useState<string>(editItem?.description || '');
  const [amount, setAmount] = useState<string>(editItem?.amount.toString() || '');
  const [status, setStatus] = useState<TransactionStatus>(editItem?.status || 'pending');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editItem) {
      updateToBePaidStatus(editItem.id, status);
    } else {
      addToBePaid({
        description,
        amount: parseFloat(amount),
        status,
      });
    }
    
    onClose();
  };
  
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
          <h2 className="text-xl font-semibold mb-6 gradient-text">
            {editItem ? 'Editar Item a Pagar' : 'Novo Item a Pagar'}
          </h2>
          
          <form onSubmit={handleSubmit}>
          <div className="mb-4 md:mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                required
                disabled={!!editItem}
              />
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Valor</label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary font-medium">
                   R$
                 </span>
                 <NumericFormat
                  value={amount}
                  onValueChange={(values) => {
                    setAmount(values.floatValue ? values.floatValue.toString() : '');
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  disabled={!!editItem}
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  required
                />
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Status</label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                  className="glass-input appearance-none w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  required
                >
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-dark-text-secondary hover:text-dark-text border border-dark-border hover:border-dark-text-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
              >
                {editItem ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ToBePaidForm;