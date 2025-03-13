import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/calculations';
import { CreditCard as CreditCardIcon, AlertCircle, Edit2, DollarSign, Calendar, PlusCircle } from 'lucide-react';
import { CreditCard } from '../types';

const CreditCardList: React.FC = () => {
  const { creditCards, updateCreditCard, addCreditCard } = useFinance();
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
  
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

  const handleAddClick = () => {
    setIsAddingCard(true);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newCard = {
      name: formData.get('name') as string,
      credit_limit: parseFloat(formData.get('credit_limit') as string),
      used: parseFloat(formData.get('used') as string),
      dueDate: parseInt(formData.get('dueDate') as string),
      closingDate: parseInt(formData.get('closingDate') as string),
    };
    
    addCreditCard(newCard);
    setIsAddingCard(false);
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
  
  // Se não houver cartões, exibe mensagem para adicionar o primeiro
  if (creditCards.length === 0 && !isAddingCard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black px-4">
        <div className="text-center max-w-md">
          <div className="bg-accent-orange bg-opacity-10 rounded-full p-4 mb-6 mx-auto w-16 h-16 flex items-center justify-center">
            <PlusCircle className="h-8 w-8 text-accent-orange" />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-dark-text">Adicione seu primeiro cartão</h2>
          <p className="text-dark-text-secondary mb-6">
            Você ainda não registrou nenhum cartão de crédito. Clique no botão abaixo para adicionar seu primeiro cartão.
          </p>
          <button 
            onClick={handleAddClick}
            className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
          >
            <CreditCardIcon className="h-4 w-4 mr-2 inline" />
            Adicionar Cartão
          </button>
        </div>
      </div>
    );
  }

  // Formulário para adicionar novo cartão
  if (isAddingCard) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-8">Adicionar Novo Cartão</h1>
        
        <div className="glass-card rounded-xl p-6 max-w-lg mx-auto">
          <form onSubmit={handleAddCardSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Nome do Cartão</label>
              <input
                type="text"
                name="name"
                required
                className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">Limite</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                  <input
                    type="number"
                    step="0.01"
                    name="credit_limit"
                    required
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">Utilizado</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                  <input
                    type="number"
                    step="0.01"
                    name="used"
                    required
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">Dia de Vencimento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                  <input
                    type="number"
                    min="1"
                    max="31"
                    name="dueDate"
                    required
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">Dia de Fechamento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                  <input
                    type="number"
                    min="1"
                    max="31"
                    name="closingDate"
                    required
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-dark-text-secondary hover:text-dark-text border border-dark-border hover:border-dark-text-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 px-6 pb-6 md:pt-24 md:px-8 md:pb-8">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold">Cartões de Crédito</h1>
        <button
          onClick={handleAddClick}
          className="glass-button flex items-center justify-center p-2 md:px-4 md:py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className=" md:inline ml-2">Novo Cartão</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {creditCards.map((card) => (
          <div key={card.id} className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-accent-orange to-accent-orange-light p-5 text-white">
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
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        value={editingCard.credit_limit}
                        onChange={(e) => handleInputChange('credit_limit', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Utilizado</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        value={editingCard.used}
                        onChange={(e) => handleInputChange('used', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Dia de Vencimento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={editingCard.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Dia de Fechamento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={editingCard.closingDate}
                        onChange={(e) => handleInputChange('closingDate', e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
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
                    className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
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
                      {formatCurrency(card.credit_limit - card.used)} / {formatCurrency(card.credit_limit)}
                    </span>
                  </div>
                  <div className="w-full bg-dark-card bg-opacity-50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${
                        (card.used / card.credit_limit) > 0.8 ? 'bg-accent-red' : 'bg-accent-orange'
                      }`}
                      style={{ width: `${(card.used / card.credit_limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="glass-card bg-opacity-30 p-3 rounded-lg">
                    <p className="text-sm text-dark-text-secondary mb-1">Vencimento</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-accent-orange mr-2" />
                      <p className="font-medium text-dark-text">Dia {card.dueDate}</p>
                    </div>
                  </div>
                  <div className="glass-card bg-opacity-30 p-3 rounded-lg">
                    <p className="text-sm text-dark-text-secondary mb-1">Fechamento</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-accent-orange mr-2" />
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
                  className="glass-button w-full px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200 flex items-center justify-center"
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