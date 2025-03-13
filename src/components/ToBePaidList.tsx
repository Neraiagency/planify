import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/calculations';
import { Edit2, Trash2, Plus, Check, Calendar, PlusCircle, MoreVertical } from 'lucide-react';
import ToBePaidForm from './ToBePaidForm';

const ToBePaidList: React.FC = () => {
  const { monthsData, currentMonthIndex, updateToBePaidStatus, deleteToBePaid } = useFinance();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'scheduled';
  } | undefined>(undefined);
  
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  
  // Click outside handler to close actions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsFor(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Se não houver meses disponíveis, exibe uma mensagem para começar a adicionar dados
  if (monthsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 py-8">
        <div className="text-center max-w-md">
          <div className="bg-accent-orange bg-opacity-10 rounded-full p-4 mb-6 mx-auto w-16 h-16 flex items-center justify-center">
            <PlusCircle className="h-8 w-8 text-accent-orange" />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-dark-text">Adicione seu primeiro item a pagar</h2>
          <p className="text-dark-text-secondary mb-6">
            Você ainda não registrou nenhum item a pagar. Clique no botão abaixo para adicionar seu primeiro item.
          </p>
          <button 
            onClick={() => setShowForm(true)}
            className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Adicionar Item a Pagar
          </button>
        </div>
        
        {showForm && (
          <ToBePaidForm
            onClose={() => setShowForm(false)}
            editItem={editingItem}
          />
        )}
      </div>
    );
  }
  
  const currentMonthData = monthsData[currentMonthIndex];
  
  const handleEditItem = (item: {
    id: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'scheduled';
  }) => {
    setEditingItem(item);
    setShowForm(true);
    setShowActionsFor(null);
  };
  
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      deleteToBePaid(id);
    }
    setShowActionsFor(null);
  };
  
  const handleMarkAsPaid = (id: string) => {
    updateToBePaidStatus(id, 'paid');
    setShowActionsFor(null);
  };
  
  const handleAddItem = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };
  
  const toggleActions = (id: string) => {
    setShowActionsFor(showActionsFor === id ? null : id);
  };
  
  return (
    <div className="pt-16 px-4 pb-4 sm:p-5 md:p-6 lg:p-8">
      {/* Header - Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb- sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">A Pagar</h1>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center bg-dark-card bg-opacity-50 rounded-lg px-3 py-1.5">
            <Calendar className="h-4 w-4 text-accent-orange mr-2" />
            <span className="text-sm text-dark-text-secondary">
              {new Date(currentMonthData.year, currentMonthData.month).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={handleAddItem}
            className="glass-button flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200 sm:inline-flex"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Novo Item</span>
          </button>
        </div>
      </div>
      
      {/* Visualização em tabela para telas maiores */}
      <div className="hidden sm:block glass-card rounded-xl overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {currentMonthData.toBePaid.length > 0 ? (
                currentMonthData.toBePaid.map((item) => (
                  <tr key={item.id} className="hover:bg-dark-card hover:bg-opacity-40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-accent-red">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'paid' ? 'bg-accent-green bg-opacity-10 text-accent-green' : 
                        item.status === 'pending' ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow' : 
                        'bg-dark-card text-dark-text-secondary'
                      }`}>
                        {item.status === 'paid' ? 'Pago' : 
                         item.status === 'pending' ? 'Pendente' : 
                         'Agendado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(item.id)}
                          className="glass-button-success p-1.5 rounded-lg mr-2 transition-colors"
                          title="Marcar como pago"
                        >
                          <Check className="h-4 w-4 text-accent-green" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditItem(item)}
                        className="glass-button p-1.5 rounded-lg mr-2 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4 text-accent-orange" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="glass-button-danger p-1.5 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4 text-accent-red" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-dark-text-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-dark-card bg-opacity-30 rounded-full p-3 mb-3">
                        <Plus className="h-5 w-5 text-dark-text-secondary" />
                      </div>
                      <p className="mb-2">Nenhum item a pagar encontrado</p>
                      <p className="text-xs">Clique em "Novo Item" para adicionar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Visualização em cards para dispositivos móveis */}
      <div className="sm:hidden space-y-4">
        {currentMonthData.toBePaid.length > 0 ? (
          currentMonthData.toBePaid.map((item) => (
            <div key={item.id} className="glass-card rounded-xl p-4 animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-medium text-dark-text truncate pr-2 max-w-[70%]">{item.description}</h3>
                <div className="relative" ref={item.id === showActionsFor ? actionsMenuRef : undefined}>
                  <button
                    onClick={() => toggleActions(item.id)}
                    className="glass-button p-1.5 rounded-lg transition-colors"
                    aria-label="Menu de ações"
                  >
                    <MoreVertical className="h-4 w-4 text-dark-text-secondary" />
                  </button>
                  
                  {/* Menu dropdown de ações */}
                  {showActionsFor === item.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-dark-card z-10 origin-top-right transition-transform duration-200 ease-out">
                      <div className="py-1 rounded-md bg-dark-card divide-y divide-dark-border">
                        {item.status !== 'paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(item.id)}
                            className="flex w-full items-center px-4 py-3 text-sm text-dark-text hover:bg-dark-card hover:bg-opacity-50 transition-colors"
                          >
                            <Check className="h-4 w-4 text-accent-green mr-3" />
                            Marcar como pago
                          </button>
                        )}
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex w-full items-center px-4 py-3 text-sm text-dark-text hover:bg-dark-card hover:bg-opacity-50 transition-colors"
                        >
                          <Edit2 className="h-4 w-4 text-accent-orange mr-3" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="flex w-full items-center px-4 py-3 text-sm text-dark-text hover:bg-dark-card hover:bg-opacity-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-accent-red mr-3" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-accent-red">
                  {formatCurrency(item.amount)}
                </span>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.status === 'paid' ? 'bg-accent-green bg-opacity-10 text-accent-green' : 
                  item.status === 'pending' ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow' : 
                  'bg-dark-card text-dark-text-secondary'
                }`}>
                  {item.status === 'paid' ? 'Pago' : 
                   item.status === 'pending' ? 'Pendente' : 
                   'Agendado'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-xl p-6 text-center animate-fade-in">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-dark-card bg-opacity-30 rounded-full p-3 mb-3">
                <Plus className="h-5 w-5 text-dark-text-secondary" />
              </div>
              <p className="mb-2 text-dark-text-secondary">Nenhum item a pagar encontrado</p>
              <p className="text-xs text-dark-text-secondary">Clique em "Novo Item" para adicionar</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Botão de ação fixo para dispositivos móveis */}
      <div className="sm:hidden fixed bottom-6 right-6">
        <button
          onClick={handleAddItem}
          className="glass-button bg-accent-orange text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 active:bg-opacity-100 transition-all"
          aria-label="Adicionar item"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
      
      {showForm && (
        <ToBePaidForm
          onClose={handleCloseForm}
          editItem={editingItem}
        />
      )}
    </div>
  );
};

export default ToBePaidList;