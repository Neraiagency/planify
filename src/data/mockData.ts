import { addDays, subDays } from 'date-fns';
import { CreditCard, MonthData, Transaction } from '../types';

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Credit cards data
export const creditCards: CreditCard[] = [
  {
    id: generateId(),
    name: 'Nubank',
    limit: 5000,
    used: 2300,
    dueDate: 10,
    closingDate: 3,
  },
  {
    id: generateId(),
    name: 'Inter',
    limit: 3500,
    used: 1200,
    dueDate: 15,
    closingDate: 8,
  },
  {
    id: generateId(),
    name: 'C6 Bank',
    limit: 4000,
    used: 1800,
    dueDate: 20,
    closingDate: 13,
  },
  {
    id: generateId(),
    name: 'PAN',
    limit: 2500,
    used: 900,
    dueDate: 5,
    closingDate: 28,
  },
];

// Categories
export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other Income',
];

export const expenseCategories = [
  'Food',
  'Housing',
  'Transportation',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Utilities',
  'Travel',
  'Other Expenses',
];

// Generate transactions for the current month
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const generateTransactions = (month: number, year: number): Transaction[] => {
  const transactions: Transaction[] = [];
  
  // Income transactions
  transactions.push({
    id: generateId(),
    date: new Date(year, month, 5),
    amount: 3500,
    description: 'Monthly Salary',
    category: 'Salary',
    type: 'income',
    paymentMethod: 'Other',
    status: 'paid',
  });
  
  transactions.push({
    id: generateId(),
    date: new Date(year, month, 15),
    amount: 800,
    description: 'Freelance Project',
    category: 'Freelance',
    type: 'income',
    paymentMethod: 'Other',
    status: 'paid',
  });
  
  // Expense transactions
  transactions.push({
    id: generateId(),
    date: new Date(year, month, 10),
    amount: 1200,
    description: 'Rent',
    category: 'Housing',
    type: 'expense',
    paymentMethod: 'Debit',
    status: 'paid',
  });
  
  transactions.push({
    id: generateId(),
    date: new Date(year, month, 12),
    amount: 350,
    description: 'Groceries',
    category: 'Food',
    type: 'expense',
    paymentMethod: 'Nubank',
    status: 'paid',
  });
  
  transactions.push({
    id: generateId(),
    date: new Date(year, month, 18),
    amount: 200,
    description: 'Electricity Bill',
    category: 'Utilities',
    type: 'expense',
    paymentMethod: 'Inter',
    status: 'paid',
  });
  
  transactions.push({
    id: generateId(),
    date: new Date(year, month, 20),
    amount: 150,
    description: 'Internet',
    category: 'Utilities',
    type: 'expense',
    paymentMethod: 'C6 Bank',
    status: 'paid',
  });
  
  transactions.push({
    id: generateId(),
    date: new Date(year, month, 22),
    amount: 500,
    description: 'New Headphones',
    category: 'Shopping',
    type: 'expense',
    paymentMethod: 'PAN',
    status: 'paid',
    installments: {
      current: 1,
      total: 3,
    },
  });
  
  return transactions;
};

// Generate data for the last 6 months
export const monthsData: MonthData[] = [];

for (let i = 0; i < 6; i++) {
  const monthIndex = (currentMonth - i + 12) % 12;
  const yearOffset = currentMonth - i < 0 ? -1 : 0;
  
  monthsData.push({
    month: monthIndex,
    year: currentYear + yearOffset,
    transactions: generateTransactions(monthIndex, currentYear + yearOffset),
    toBePaid: [
      {
        id: generateId(),
        description: 'Internet Bill',
        amount: 150,
        status: 'pending',
      },
      {
        id: generateId(),
        description: 'Water Bill',
        amount: 80,
        status: 'pending',
      },
    ],
  });
}

// Sort months in chronological order
monthsData.sort((a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
});