import React, { useState, useEffect } from 'react';
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
  
  // Ajuste para telas pequenas - impedir scroll do body quando modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
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
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto pt-4 pb-4 px-2 sm:pt-10 sm:items-center">
      <div className="glass-card rounded-xl w-full max-w-sm sm:max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-dark-text-secondary hover:text-dark-text transition-colors p-2 z-10 bg-black bg-opacity-10 rounded-full"
          aria-label="Fechar"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        
        <div className="p-3 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-5 gradient-text text-center sm:text-left">
            {editTransaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Tipo de transação */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Tipo</label>
              <div className="flex space-x-2">
                <label className="flex-1 glass-card rounded-lg p-2 cursor-pointer transition-all duration-200 ease-in-out border border-transparent hover:border-accent-blue flex items-center justify-center">
                  <input
                    type="radio"
                    className="sr-only"
                    name="type"
                    value="income"
                    checked={type === 'income'}
                    onChange={() => setType('income')}
                  />
                  <span className={`${type === 'income' ? 'text-accent-green' : 'text-dark-text-secondary'} text-xs sm:text-sm font-medium`}>Receita</span>
                </label>
                <label className="flex-1 glass-card rounded-lg p-2 cursor-pointer transition-all duration-200 ease-in-out border border-transparent hover:border-accent-blue flex items-center justify-center">
                  <input
                    type="radio"
                    className="sr-only"
                    name="type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => setType('expense')}
                  />
                  <span className={`${type === 'expense' ? 'text-accent-red' : 'text-dark-text-secondary'} text-xs sm:text-sm font-medium`}>Despesa</span>
                </label>
              </div>
            </div>
            
            {/* Data */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Data</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent-orange" size={14} />
                <DatePicker
                  selected={date}
                  onChange={(date: Date) => setDate(date)}
                  className="glass-input w-full pl-7 pr-2 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            
            {/* Valor */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Valor</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent-orange" size={14} />
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-input w-full pl-7 pr-2 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
                  required
                />
              </div>
            </div>
            
            {/* Descrição */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
                required
              />
            </div>
            
            {/* Categoria */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent-orange" size={14} />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input appearance-none w-full pl-7 pr-2 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
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
            
            {/* Método de Pagamento e Status em duas colunas em telas pequenas */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Método</label>
                <div className="relative">
                  <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent-orange" size={14} />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="glass-input appearance-none w-full pl-7 pr-1 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
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
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Status</label>
                <div className="relative">
                  <CheckCircle className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent-orange" size={14} />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                    className="glass-input appearance-none w-full pl-7 pr-1 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
                    required
                  >
                    <option value="paid">Pago</option>
                    <option value="pending">Pendente</option>
                    <option value="scheduled">Agendado</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Checkbox Parcelado */}
            <div>
              <label className="flex items-center touch-manipulation">
                <input
                  type="checkbox"
                  checked={hasInstallments}
                  onChange={(e) => setHasInstallments(e.target.checked)}
                  className="sr-only"
                />
                <span className={`flex h-5 w-5 items-center justify-center rounded border ${hasInstallments ? 'bg-accent-orange border-accent-orange' : 'border-dark-border'}`}>
                  {hasInstallments && <span className="text-white text-xs">✓</span>}
                </span>
                <span className="ml-2 text-xs sm:text-sm text-dark-text-secondary">Parcelado</span>
              </label>
            </div>
            
            {/* Campos de parcelas */}
            {hasInstallments && (
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Parcela Atual</label>
                  <div className="relative">
                    <Layers className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent-orange" size={14} />
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={currentInstallment}
                      onChange={(e) => setCurrentInstallment(e.target.value)}
                      className="glass-input w-full pl-7 pr-2 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
                      required={hasInstallments}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-dark-text-secondary mb-1 sm:mb-2">Total Parcelas</label>
                  <div className="relative">
                    <Layers className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent-orange" size={14} />
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={totalInstallments}
                      onChange={(e) => setTotalInstallments(e.target.value)}
                      className="glass-input w-full pl-7 pr-2 py-2 sm:py-2.5 rounded-lg text-dark-text focus:outline-none focus:ring-1 focus:ring-accent-orange text-xs sm:text-sm"
                      required={hasInstallments}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Botões */}
            <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-dark-text-secondary hover:text-dark-text border border-dark-border hover:border-dark-text-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="glass-button px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
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