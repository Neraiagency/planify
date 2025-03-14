import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, getMonthName } from '../utils/calculations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2, Plus, CreditCard, Calendar, Filter, PlusCircle, ChevronRight } from 'lucide-react';
import TransactionForm from './TransactionForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Transaction } from '../types';

const TransactionList: React.FC = () => {
  const { monthsData, currentMonthIndex, setCurrentMonthIndex, deleteTransaction } = useFinance();
  const [showTransactionForm, setShowTransactionForm] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [filter, setFilter] = useState<string>('all');
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  
  // States for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactionToDelete(id);
    setDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setTransactionToDelete(null);
    }
    setDeleteModalOpen(false);
  };
  
  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setShowTransactionForm(true);
  };
  
  const handleCloseForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(undefined);
  };

  const toggleExpandTransaction = (id: string) => {
    setExpandedTransaction(expandedTransaction === id ? null : id);
  };
  
  // Se não houver meses disponíveis, exibe uma mensagem para começar a adicionar dados
  if (monthsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg px-4">
        <div className="text-center max-w-md">
          <div className="bg-accent-blue bg-opacity-10 rounded-full p-4 mb-6 mx-auto w-16 h-16 flex items-center justify-center">
            <PlusCircle className="h-8 w-8 text-accent-blue" />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-dark-text">Adicione sua primeira transação</h2>
          <p className="text-dark-text-secondary mb-6">
            Você ainda não registrou nenhuma transação. Clique no botão abaixo para adicionar sua primeira receita ou despesa.
          </p>
          <button 
            onClick={handleAddTransaction}
            className="glass-button w-full sm:w-auto px-4 py-3 rounded-lg text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Nova Transação
          </button>
        </div>
        
        {showTransactionForm && (
          <TransactionForm
            onClose={handleCloseForm}
            editTransaction={editingTransaction}
          />
        )}
      </div>
    );
  }
  
  const currentMonthData = monthsData[currentMonthIndex];
  
  const filteredTransactions = currentMonthData.transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense';
    return true;
  });
  
  return (
    <>
      <div className="p-3 sm:p-5 md:p-6 lg:p-8">
        <div className="flex flex-col mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 py-1">Transações</h1>
          
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3 w-full">
            <div className="relative flex-grow sm:flex-grow-0">
              <select
                value={`${currentMonthData.year}-${currentMonthData.month}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split('-').map(Number);
                  const index = monthsData.findIndex(data => data.year === year && data.month === month);
                  if (index !== -1) {
                    setCurrentMonthIndex(index);
                  }
                }}
                className="glass-input appearance-none w-full pl-10 pr-10 py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                {monthsData.map((data, index) => (
                  <option key={index} value={`${data.year}-${data.month}`}>
                    {getMonthName(data.month)} {data.year}
                  </option>
                ))}
              </select>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue pointer-events-none" size={16} />
            </div>
            
            <div className="relative flex-grow sm:flex-grow-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="glass-input appearance-none w-full pl-10 pr-10 py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                <option value="all">Todas</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue pointer-events-none" size={16} />
            </div>
            
            <button
              onClick={handleAddTransaction}
              className="glass-button flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue transition-all duration-200 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </button>
          </div>
        </div>
        
        {/* Versão Desktop - Tabela visível apenas em telas maiores */}
        <div className="glass-card rounded-xl overflow-hidden animate-fade-in hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Método
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
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-dark-card hover:bg-opacity-40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">
                        {format(transaction.date, 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text">
                        {transaction.description}
                        {transaction.installments && (
                          <span className="ml-2 text-xs text-dark-text-secondary">
                            ({transaction.installments.current}/{transaction.installments.total})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">
                        {transaction.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'income' ? 'text-accent-green' : 'text-accent-red'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1 text-accent-blue" />
                          {transaction.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'paid' ? 'bg-accent-green bg-opacity-10 text-accent-green' : 
                          transaction.status === 'pending' ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow' : 
                          'bg-dark-card text-dark-text-secondary'
                        }`}>
                          {transaction.status === 'paid' ? 'Pago' : 
                           transaction.status === 'pending' ? 'Pendente' : 
                           'Agendado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="text-accent-blue hover:text-accent-purple mr-3 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-accent-red hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-dark-text-secondary">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-dark-card bg-opacity-30 rounded-full p-3 mb-3">
                          <Plus className="h-5 w-5 text-dark-text-secondary" />
                        </div>
                        <p className="mb-2">Nenhuma transação encontrada</p>
                        <p className="text-xs">Clique em "Nova Transação" para adicionar</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Versão Mobile - Lista de cards visível apenas em telas menores */}
        <div className="md:hidden animate-fade-in">
          {filteredTransactions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="glass-card rounded-xl p-4 overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-dark-text">{transaction.description}</h3>
                      <p className="text-xs text-dark-text-secondary">
                        {format(transaction.date, 'dd/MM/yyyy', { locale: ptBR })}
                        {transaction.installments && (
                          <span className="ml-2">
                            ({transaction.installments.current}/{transaction.installments.total})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'income' ? 'text-accent-green' : 'text-accent-red'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'paid' ? 'bg-accent-green bg-opacity-10 text-accent-green' : 
                        transaction.status === 'pending' ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow' : 
                        'bg-dark-card text-dark-text-secondary'
                      }`}>
                        {transaction.status === 'paid' ? 'Pago' : 
                         transaction.status === 'pending' ? 'Pendente' : 
                         'Agendado'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => toggleExpandTransaction(transaction.id)}
                      className="text-accent-blue p-1"
                    >
                      <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${
                        expandedTransaction === transaction.id ? 'transform rotate-90' : ''
                      }`} />
                    </button>
                  </div>
                  
                  {expandedTransaction === transaction.id && (
                    <div className="mt-3 pt-3 border-t border-dark-border">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-xs text-dark-text-secondary">Categoria</p>
                          <p className="text-sm">{transaction.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-secondary">Método</p>
                          <p className="text-sm flex items-center">
                            <CreditCard className="h-3 w-3 mr-1 text-accent-blue" />
                            {transaction.paymentMethod}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="flex items-center justify-center p-2 rounded-full bg-accent-blue bg-opacity-10 text-accent-blue"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="flex items-center justify-center p-2 rounded-full bg-accent-red bg-opacity-10 text-accent-red"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-dark-card bg-opacity-30 rounded-full p-3 mb-3">
                  <Plus className="h-5 w-5 text-dark-text-secondary" />
                </div>
                <p className="mb-2">Nenhuma transação encontrada</p>
                <p className="text-xs">Clique em "Nova Transação" para adicionar</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Formulário de transação */}
      {showTransactionForm && (
        <TransactionForm
          onClose={handleCloseForm}
          editTransaction={editingTransaction}
        />
      )}
      
      {/* Modal de confirmação de exclusão */}
      {deleteModalOpen && (
        <DeleteConfirmationModal 
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Excluir Transação"
          message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
          itemName={transactionToDelete ? filteredTransactions.find(t => t.id === transactionToDelete)?.description : ''}
        />
      )}
    </>
  );
};

export default TransactionList;