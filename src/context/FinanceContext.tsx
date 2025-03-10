import React, { createContext, useContext, useState, useEffect } from 'react';
import { MonthData, Transaction, CreditCard, TransactionStatus } from '../types';
import {
  fetchTransactions,
  fetchToBePaid,
  fetchCreditCards,
  addTransactionToSupabase,
  updateTransactionInSupabase,
  deleteTransactionFromSupabase,
  addToBePaidToSupabase,
  updateToBePaidStatusInSupabase,
  deleteToBePaidFromSupabase,
  updateCreditCardInSupabase,
  addCreditCardToSupabase,
  organizeDataByMonth
} from '../services/supabase';

interface FinanceContextType {
  monthsData: MonthData[];
  creditCards: CreditCard[];
  currentMonthIndex: number;
  setCurrentMonthIndex: (index: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addToBePaid: (item: { description: string; amount: number; status: TransactionStatus }) => void;
  updateToBePaidStatus: (id: string, status: TransactionStatus) => void;
  deleteToBePaid: (id: string) => void;
  updateCreditCard: (card: CreditCard) => void;
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  isLoading: boolean;
  error: string | null;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialize com arrays vazios em vez de dados de exemplo
  const [monthsData, setMonthsData] = useState<MonthData[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega os dados do Supabase quando o componente é montado
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null); // Reseta qualquer erro anterior
      
      try {
        // Busca dados do Supabase
        const transactions = await fetchTransactions();
        const toBePaidItems = await fetchToBePaid();
        const cards = await fetchCreditCards();
        
        console.log("Dados carregados do Supabase:", {
          transactions: transactions.length,
          toBePaidItems: toBePaidItems.length,
          cards: cards.length
        });
        
        // Organiza os dados por mês
        const months = organizeDataByMonth(transactions, toBePaidItems);
        
        // Sempre use os dados do Supabase, mesmo que estejam vazios
        setMonthsData(months);
        
        // Se houver meses, configura o índice para o mês mais recente
        if (months.length > 0) {
          setCurrentMonthIndex(months.length - 1);
        }
        
        // Sempre use os cartões do Supabase, mesmo que estejam vazios
        setCreditCards(cards);
        
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      // Adiciona a transação no Supabase e obtém o ID gerado
      const newTransaction = await addTransactionToSupabase(transaction);
      
      if (newTransaction) {
        setMonthsData(prevMonthsData => {
          const newMonthsData = [...prevMonthsData];
          const monthIndex = newMonthsData.findIndex(
            data => data.month === transaction.date.getMonth() && data.year === transaction.date.getFullYear()
          );
          
          if (monthIndex !== -1) {
            newMonthsData[monthIndex] = {
              ...newMonthsData[monthIndex],
              transactions: [
                ...newMonthsData[monthIndex].transactions,
                newTransaction,
              ],
            };
          } else {
            // Cria um novo mês se não existir
            newMonthsData.push({
              month: transaction.date.getMonth(),
              year: transaction.date.getFullYear(),
              transactions: [newTransaction],
              toBePaid: [],
            });
            
            // Ordena os meses em ordem cronológica
            newMonthsData.sort((a, b) => {
              if (a.year !== b.year) return a.year - b.year;
              return a.month - b.month;
            });
          }
          
          return newMonthsData;
        });
      }
    } catch (err: any) {
      console.error("Erro ao adicionar transação:", err);
      setError(err.message || "Não foi possível adicionar a transação.");
      throw err; // Propaga o erro para componentes que possam querer tratar
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      // Atualiza a transação no Supabase
      const success = await updateTransactionInSupabase(transaction);
      
      if (success) {
        setMonthsData(prevMonthsData => {
          const newMonthsData = [...prevMonthsData];
          const monthIndex = newMonthsData.findIndex(
            data => data.month === transaction.date.getMonth() && data.year === transaction.date.getFullYear()
          );
          
          if (monthIndex !== -1) {
            const transactionIndex = newMonthsData[monthIndex].transactions.findIndex(
              t => t.id === transaction.id
            );
            
            if (transactionIndex !== -1) {
              newMonthsData[monthIndex].transactions[transactionIndex] = transaction;
            }
          }
          
          return newMonthsData;
        });
      }
    } catch (err) {
      console.error("Erro ao atualizar transação:", err);
      setError("Não foi possível atualizar a transação.");
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      // Exclui a transação do Supabase
      const success = await deleteTransactionFromSupabase(id);
      
      if (success) {
        setMonthsData(prevMonthsData => {
          return prevMonthsData.map(monthData => ({
            ...monthData,
            transactions: monthData.transactions.filter(transaction => transaction.id !== id),
          }));
        });
      }
    } catch (err) {
      console.error("Erro ao excluir transação:", err);
      setError("Não foi possível excluir a transação.");
    }
  };

  const addToBePaid = async (item: { description: string; amount: number; status: TransactionStatus }) => {
    try {
      // Se não houver meses disponíveis, crie um para o mês atual
      if (monthsData.length === 0) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Adiciona o item no Supabase
        const newItem = await addToBePaidToSupabase({
          ...item,
          month: currentMonth,
          year: currentYear
        });
        
        if (newItem) {
          // Cria um novo mês com o item a pagar
          setMonthsData([{
            month: currentMonth,
            year: currentYear,
            transactions: [],
            toBePaid: [{
              id: newItem.id,
              description: newItem.description,
              amount: newItem.amount,
              status: newItem.status
            }]
          }]);
          setCurrentMonthIndex(0);
        }
      } else {
        const currentMonth = monthsData[currentMonthIndex];
        
        // Adiciona o item no Supabase
        const newItem = await addToBePaidToSupabase({
          ...item,
          month: currentMonth.month,
          year: currentMonth.year
        });
        
        if (newItem) {
          setMonthsData(prevMonthsData => {
            const newMonthsData = [...prevMonthsData];
            
            newMonthsData[currentMonthIndex].toBePaid.push({
              id: newItem.id,
              description: newItem.description,
              amount: newItem.amount,
              status: newItem.status,
            });
            
            return newMonthsData;
          });
        }
      }
    } catch (err) {
      console.error("Erro ao adicionar item a pagar:", err);
      setError("Não foi possível adicionar o item a pagar.");
    }
  };

  const updateToBePaidStatus = async (id: string, status: TransactionStatus) => {
    try {
      // Atualiza o status no Supabase
      const success = await updateToBePaidStatusInSupabase(id, status);
      
      if (success) {
        setMonthsData(prevMonthsData => {
          const newMonthsData = [...prevMonthsData];
          const currentMonth = newMonthsData[currentMonthIndex];
          
          const itemIndex = currentMonth.toBePaid.findIndex(item => item.id === id);
          
          if (itemIndex !== -1) {
            currentMonth.toBePaid[itemIndex].status = status;
          }
          
          return newMonthsData;
        });
      }
    } catch (err) {
      console.error("Erro ao atualizar status do item a pagar:", err);
      setError("Não foi possível atualizar o status do item.");
    }
  };

  const deleteToBePaid = async (id: string) => {
    try {
      // Exclui o item do Supabase
      const success = await deleteToBePaidFromSupabase(id);
      
      if (success) {
        setMonthsData(prevMonthsData => {
          const newMonthsData = [...prevMonthsData];
          const currentMonth = newMonthsData[currentMonthIndex];
          
          currentMonth.toBePaid = currentMonth.toBePaid.filter(item => item.id !== id);
          
          return newMonthsData;
        });
      }
    } catch (err) {
      console.error("Erro ao excluir item a pagar:", err);
      setError("Não foi possível excluir o item.");
    }
  };

  const addCreditCard = async (card: Omit<CreditCard, 'id'>) => {
    try {
      // Adiciona o cartão no Supabase
      const newCard = await addCreditCardToSupabase(card);
      
      if (newCard) {
        setCreditCards(prevCards => [...prevCards, newCard]);
      }
    } catch (err) {
      console.error("Erro ao adicionar cartão de crédito:", err);
      setError("Não foi possível adicionar o cartão de crédito.");
    }
  };

  const updateCreditCard = async (card: CreditCard) => {
    try {
      // Atualiza o cartão no Supabase
      const success = await updateCreditCardInSupabase(card);
      
      if (success) {
        setCreditCards(prevCards => {
          const newCards = [...prevCards];
          const cardIndex = newCards.findIndex(c => c.id === card.id);
          
          if (cardIndex !== -1) {
            newCards[cardIndex] = card;
          }
          
          return newCards;
        });
      }
    } catch (err) {
      console.error("Erro ao atualizar cartão de crédito:", err);
      setError("Não foi possível atualizar o cartão de crédito.");
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        monthsData,
        creditCards,
        currentMonthIndex,
        setCurrentMonthIndex,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addToBePaid,
        updateToBePaidStatus,
        deleteToBePaid,
        addCreditCard,
        updateCreditCard,
        isLoading,
        error
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};