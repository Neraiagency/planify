import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/calculations';
import { Edit2, Trash2, Plus, Check, Calendar, PlusCircle } from 'lucide-react';
import ToBePaidForm from './ToBePaidForm';

const ToBePaidList: React.FC = () => {
  const { monthsData, currentMonthIndex, updateToBePaidStatus, deleteToBePaid } = useFinance();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'scheduled';
  } | undefined>(undefined);
  
  // Se não houver meses disponíveis, exibe uma mensagem para começar a adicionar dados
  if (monthsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black px-4">
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
  };
  
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      deleteToBePaid(id);
    }
  };
  
  const handleMarkAsPaid = (id: string) => {
    updateToBePaidStatus(id, 'paid');
  };
  
  const handleAddItem = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };
  
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">A Pagar</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-dark-card bg-opacity-50 rounded-lg px-3 py-1.5">
            <Calendar className="h-4 w-4 text-accent-orange mr-2" />
            <span className="text-sm text-dark-text-secondary">
              {new Date(currentMonthData.year, currentMonthData.month).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={handleAddItem}
            className="glass-button flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
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
                      >
                        <Edit2 className="h-4 w-4 text-accent-orange" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="glass-button-danger p-1.5 rounded-lg transition-colors"
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