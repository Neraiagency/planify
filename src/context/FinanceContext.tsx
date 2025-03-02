import React, { createContext, useContext, useState, useEffect } from 'react';
import { MonthData, Transaction, CreditCard, TransactionStatus } from '../types';
import { monthsData as initialMonthsData, creditCards as initialCreditCards } from '../data/mockData';

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
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [monthsData, setMonthsData] = useState<MonthData[]>(initialMonthsData);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(initialCreditCards);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(monthsData.length - 1);

  // Generate a unique ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
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
            { ...transaction, id: generateId() },
          ],
        };
      } else {
        // Create a new month entry if it doesn't exist
        newMonthsData.push({
          month: transaction.date.getMonth(),
          year: transaction.date.getFullYear(),
          transactions: [{ ...transaction, id: generateId() }],
          toBePaid: [],
        });
        
        // Sort months in chronological order
        newMonthsData.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return a.month - b.month;
        });
      }
      
      return newMonthsData;
    });
  };

  const updateTransaction = (transaction: Transaction) => {
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
  };

  const deleteTransaction = (id: string) => {
    setMonthsData(prevMonthsData => {
      return prevMonthsData.map(monthData => ({
        ...monthData,
        transactions: monthData.transactions.filter(transaction => transaction.id !== id),
      }));
    });
  };

  const addToBePaid = (item: { description: string; amount: number; status: TransactionStatus }) => {
    setMonthsData(prevMonthsData => {
      const newMonthsData = [...prevMonthsData];
      const currentMonth = newMonthsData[currentMonthIndex];
      
      currentMonth.toBePaid.push({
        id: generateId(),
        ...item,
      });
      
      return newMonthsData;
    });
  };

  const updateToBePaidStatus = (id: string, status: TransactionStatus) => {
    setMonthsData(prevMonthsData => {
      const newMonthsData = [...prevMonthsData];
      const currentMonth = newMonthsData[currentMonthIndex];
      
      const itemIndex = currentMonth.toBePaid.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        currentMonth.toBePaid[itemIndex].status = status;
      }
      
      return newMonthsData;
    });
  };

  const deleteToBePaid = (id: string) => {
    setMonthsData(prevMonthsData => {
      const newMonthsData = [...prevMonthsData];
      const currentMonth = newMonthsData[currentMonthIndex];
      
      currentMonth.toBePaid = currentMonth.toBePaid.filter(item => item.id !== id);
      
      return newMonthsData;
    });
  };

  const updateCreditCard = (card: CreditCard) => {
    setCreditCards(prevCards => {
      const newCards = [...prevCards];
      const cardIndex = newCards.findIndex(c => c.id === card.id);
      
      if (cardIndex !== -1) {
        newCards[cardIndex] = card;
      }
      
      return newCards;
    });
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
        updateCreditCard,
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