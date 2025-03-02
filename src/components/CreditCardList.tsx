import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/calculations';
import { CreditCard as CreditCardIcon, AlertCircle, Edit2, DollarSign, Calendar } from 'lucide-react';
import { CreditCard } from '../types';

const CreditCardList: React.FC = () => {
  const { creditCards, updateCreditCard } = useFinance();
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  
  const handleEditCard = (card: CreditCard) => {
    setEditingCard({ ...card });
  };
  
  const handleSaveCard = () => {
    if (editingCard) {
      updateCreditCard(editingCard);
      setEditingCard(null);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingCard(null);
  };
  
  const handleInputChange = (field: keyof CreditCard, value: string | number) => {
    if (editingCard) {
      setEditingCard({
        ...editingCard,
        [field]: typeof value === 'string' && field !== 'name' ? parseFloat(value) : value,
      });
    }
  };
  
  const calculateDaysUntilDue = (dueDate: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    
    if (dueDate < currentDay) {
      // Due date is in the next month
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, dueDate);
      const diffTime = nextMonth.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      // Due date is in the current month
      const dueThisMonth = new Date(today.getFullYear(), today.getMonth(), dueDate);
      const diffTime = dueThisMonth.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  };
  
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Cartões de Crédito</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {creditCards.map((card) => (
          <div key={card.id} className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-accent-blue to-accent-purple p-5 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{card.name}</h3>
                <CreditCardIcon className="h-6 w-6" />
              </div>
              <p className="text-sm opacity-80 mt-1">**** **** **** 1234</p>
            </div>
            
            {editingCard && editingCard.id === card.id ? (
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Limite</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        value={editingCard.limit}
                        onChange={(e) => handleInputChange('limit', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Utilizado</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        value={editingCard.used}
                        onChange={(e) => handleInputChange('used', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Dia de Vencimento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue" size={16} />
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={editingCard.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Dia de Fechamento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue" size={16} />
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={editingCard.closingDate}
                        onChange={(e) => handleInputChange('closingDate', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-dark-text-secondary hover:text-dark-text border border-dark-border hover:border-dark-text-secondary transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveCard}
                    className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue transition-all duration-200"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-dark-text-secondary">Limite Disponível</span>
                    <span className="text-sm font-medium text-dark-text">
                      {formatCurrency(card.limit - card.used)} / {formatCurrency(card.limit)}
                    </span>
                  </div>
                  <div className="w-full bg-dark-card bg-opacity-50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${
                        (card.used / card.limit) > 0.8 ? 'bg-accent-red' : 'bg-accent-blue'
                      }`}
                      style={{ width: `${(card.used / card.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="glass-card bg-opacity-30 p-3 rounded-lg">
                    <p className="text-sm text-dark-text-secondary mb-1">Vencimento</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-accent-blue mr-2" />
                      <p className="font-medium text-dark-text">Dia {card.dueDate}</p>
                    </div>
                  </div>
                  <div className="glass-card bg-opacity-30 p-3 rounded-lg">
                    <p className="text-sm text-dark-text-secondary mb-1">Fechamento</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-accent-purple mr-2" />
                      <p className="font-medium text-dark-text">Dia {card.closingDate}</p>
                    </div>
                  </div>
                </div>
                
                {calculateDaysUntilDue(card.dueDate) <= 5 && (
                  <div className="flex items-center p-3 mb-5 bg-accent-yellow bg-opacity-10 text-accent-yellow rounded-lg">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      Fatura vence em {calculateDaysUntilDue(card.dueDate)} dias
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => handleEditCard(card)}
                  className="glass-button w-full px-4 py-2 rounded-lg text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue transition-all duration-200 flex items-center justify-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar Cartão
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditCardList;