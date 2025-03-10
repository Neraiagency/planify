export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'Nubank' | 'Inter' | 'C6 Bank' | 'PAN' | 'Debit' | 'Cash' | 'Other';
export type TransactionStatus = 'paid' | 'pending' | 'scheduled';

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  installments?: {
    current: number;
    total: number;
  };
}

export interface CreditCard {
  id: string;
  name: PaymentMethod;
  credit_limit: number; // Alterado de 'limit' para 'credit_limit'
  used: number;
  dueDate: number; // Day of month
  closingDate: number; // Day of month
}

export interface MonthData {
  month: number; // 0-11
  year: number;
  transactions: Transaction[];
  toBePaid: {
    id: string;
    description: string;
    amount: number;
    status: TransactionStatus;
  }[];
}

export interface FinancialSummary {
  income: number;
  expenses: number;
  balance: number;
  toBePaid: number;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}