import { MonthData, Transaction, FinancialSummary, CategorySummary } from '../types';

export const calculateMonthSummary = (monthData: MonthData): FinancialSummary => {
  const income = monthData.transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const expenses = monthData.transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const toBePaid = monthData.toBePaid
    .filter(item => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses,
    toBePaid,
  };
};

export const calculateCategorySummary = (transactions: Transaction[]): CategorySummary[] => {
  const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const categorySummary: Record<string, number> = {};
  
  expenseTransactions.forEach(transaction => {
    if (!categorySummary[transaction.category]) {
      categorySummary[transaction.category] = 0;
    }
    categorySummary[transaction.category] += transaction.amount;
  });
  
  return Object.entries(categorySummary).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
  })).sort((a, b) => b.amount - a.amount);
};

export const calculateMonthlyTrend = (currentMonth: MonthData, previousMonth: MonthData | undefined): number => {
  if (!previousMonth) return 0;
  
  const currentSummary = calculateMonthSummary(currentMonth);
  const previousSummary = calculateMonthSummary(previousMonth);
  
  if (previousSummary.balance === 0) return 0;
  
  return ((currentSummary.balance - previousSummary.balance) / Math.abs(previousSummary.balance)) * 100;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getMonthName = (month: number): string => {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return monthNames[month];
};