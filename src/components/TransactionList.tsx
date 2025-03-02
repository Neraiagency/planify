import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, getMonthName } from '../utils/calculations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2, Plus, CreditCard, Calendar, Filter } from 'lucide-react';
import TransactionForm from './TransactionForm';
import { Transaction } from '../types';

const TransactionList: React.FC = () => {
  const { monthsData, currentMonthIndex, setCurrentMonthIndex, deleteTransaction } = useFinance();
  const [showTransactionForm, setShowTransactionForm] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [filter, setFilter] = useState<string>('all');
  
  const currentMonthData = monthsData[currentMonthIndex];
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };
  
  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setShowTransactionForm(true);
  };
  
  const handleCloseForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(undefined);
  };
  
  const filteredTransactions = currentMonthData.transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense';
    return true;
  });
  
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <select
              value={`${currentMonthData.year}-${currentMonthData.month}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-').map(Number);
                const index = monthsData.findIndex(data => data.year === year && data.month === month);
                if (index !== -1) {
                  setCurrentMonthIndex(index);
                }
              }}
              className="glass-input appearance-none w-full md:w-auto pl-10 pr-10 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
            >
              {monthsData.map((data, index) => (
                <option key={index} value={`${data.year}-${data.month}`}>
                  {getMonthName(data.month)} {data.year}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue pointer-events-none" size={16} />
          </div>
          
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="glass-input appearance-none w-full md:w-auto pl-10 pr-10 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
            >
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-blue pointer-events-none" size={16} />
          </div>
          
          <button
            onClick={handleAddTransaction}
            className="glass-button flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
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
                    Nenhuma transação encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {showTransactionForm && (
        <TransactionForm
          onClose={handleCloseForm}
          editTransaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default TransactionList;