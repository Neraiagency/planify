import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType, PaymentMethod, TransactionStatus } from '../types';
import { incomeCategories, expenseCategories } from '../data/mockData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PlusCircle, X, Calendar, DollarSign, Tag, CreditCard, CheckCircle, Layers } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  editTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editTransaction }) => {
  const { addTransaction, updateTransaction } = useFinance();
  
  const [date, setDate] = useState<Date>(editTransaction?.date || new Date());
  const [amount, setAmount] = useState<string>(editTransaction?.amount.toString() || '');
  const [description, setDescription] = useState<string>(editTransaction?.description || '');
  const [category, setCategory] = useState<string>(editTransaction?.category || '');
  const [type, setType] = useState<TransactionType>(editTransaction?.type || 'expense');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(editTransaction?.paymentMethod || 'Nubank');
  const [status, setStatus] = useState<TransactionStatus>(editTransaction?.status || 'paid');
  const [hasInstallments, setHasInstallments] = useState<boolean>(!!editTransaction?.installments);
  const [currentInstallment, setCurrentInstallment] = useState<string>(
    editTransaction?.installments?.current.toString() || '1'
  );
  const [totalInstallments, setTotalInstallments] = useState<string>(
    editTransaction?.installments?.total.toString() || '1'
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      date,
      amount: parseFloat(amount),
      description,
      category,
      type,
      paymentMethod,
      status,
      ...(hasInstallments && {
        installments: {
          current: parseInt(currentInstallment, 10),
          total: parseInt(totalInstallments, 10),
        },
      }),
    };
    
    if (editTransaction) {
      updateTransaction({
        ...transactionData,
        id: editTransaction.id,
      });
    } else {
      addTransaction(transactionData);
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
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 gradient-text">
            {editTransaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Tipo</label>
              <div className="flex space-x-4">
                <label className="flex-1 glass-card rounded-lg p-3 cursor-pointer transition-all duration-200 ease-in-out border-2 border-transparent hover:border-accent-blue hover:bg-dark-card hover:bg-opacity-40 flex items-center justify-center space-x-2 group">
                  <input
                    type="radio"
                    className="sr-only"
                    name="type"
                    value="income"
                    checked={type === 'income'}
                    onChange={() => setType('income')}
                  />
                  <span className={`${type === 'income' ? 'text-accent-green' : 'text-dark-text-secondary group-hover:text-dark-text'}`}>Receita</span>
                </label>
                <label className="flex-1 glass-card rounded-lg p-3 cursor-pointer transition-all duration-200 ease-in-out border-2 border-transparent hover:border-accent-blue hover:bg-dark-card hover:bg-opacity-40 flex items-center justify-center space-x-2 group">
                  <input
                    type="radio"
                    className="sr-only"
                    name="type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => setType('expense')}
                  />
                  <span className={`${type === 'expense' ? 'text-accent-red' : 'text-dark-text-secondary group-hover:text-dark-text'}`}>Despesa</span>
                </label>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                <DatePicker
                  selected={date}
                  onChange={(date: Date) => setDate(date)}
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Valor</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  required
                />
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                required
              />
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input appearance-none w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {type === 'income' ? (
                    incomeCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  ) : (
                    expenseCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Método de Pagamento</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="glass-input appearance-none w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  required
                >
                  <option value="Nubank">Nubank</option>
                  <option value="Inter">Inter</option>
                  <option value="C6 Bank">C6 Bank</option>
                  <option value="Credit">Credito</option>
                  <option value="Debit">Débito</option>
                  <option value="Cash">Dinheiro</option>
                  <option value="Pix">Pix</option>
                </select>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Status</label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                  className="glass-input appearance-none w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  required
                >
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasInstallments}
                  onChange={(e) => setHasInstallments(e.target.checked)}
                  className="sr-only"
                />
                <span className={`flex h-5 w-5 items-center justify-center rounded border ${hasInstallments ? 'bg-accent-orange border-accent-orange' : 'border-dark-border'}`}>
                  {hasInstallments && <span className="text-white text-xs">✓</span>}
                </span>
                <span className="ml-2 text-sm text-dark-text-secondary">Parcelado</span>
              </label>
            </div>
            
            {hasInstallments && (
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">Parcela Atual</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                    <input
                      type="number"
                      min="1"
                      value={currentInstallment}
                      onChange={(e) => setCurrentInstallment(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                      required={hasInstallments}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">Total de Parcelas</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                    <input
                      type="number"
                      min="1"
                      value={totalInstallments}
                      onChange={(e) => setTotalInstallments(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                      required={hasInstallments}
                    />
                  </div>
                </div>
              </div>
            )}
            
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
                {editTransaction ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;