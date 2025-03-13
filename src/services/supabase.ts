import { createClient } from '@supabase/supabase-js';
import { Transaction, CreditCard, MonthData, TransactionStatus } from '../types';

// Recupera as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Valida as credenciais do Supabase
if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Credenciais do Supabase não encontradas. Verifique suas variáveis de ambiente.');
}

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Função auxiliar para verificar autenticação
const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Usuário não autenticado. Por favor, faça login novamente.');
  }
  return data.user;
};

// Funções para manipular transações
export const fetchTransactions = async () => {
  try {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id); // Filtra por user_id
    
    if (error) {
      throw new Error(`Erro ao buscar transações: ${error.message}`);
    }
    
    // Converte as datas de string para objeto Date e trata os campos adequadamente
    return data.map((transaction: any) => ({
      id: transaction.id,
      date: new Date(transaction.date),
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      paymentMethod: transaction.payment_method, // Converte snake_case para camelCase
      status: transaction.status,
      // Manipulação segura do JSON
      installments: transaction.installments ? 
        (typeof transaction.installments === 'string' ? 
          JSON.parse(transaction.installments) : 
          transaction.installments) : 
        undefined
    })) as Transaction[];
  } catch (err) {
    console.error('Erro ao buscar transações:', err);
    throw err; // Propaga o erro para ser tratado no componente
  }
};

export const addTransactionToSupabase = async (transaction: Omit<Transaction, 'id'>) => {
  try {
    const user = await getCurrentUser();
    
    // Preparando o objeto para o formato que o Supabase espera
    const transactionData = {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      payment_method: transaction.paymentMethod, // Converte camelCase para snake_case
      status: transaction.status,
      installments: transaction.installments ? JSON.stringify(transaction.installments) : null,
      user_id: user.id,
      email: user.email
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select();
    
    if (error) {
      throw new Error(`Erro ao adicionar transação: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('Nenhum dado retornado após inserção');
    }
    
    // Retorna o objeto com o ID gerado pelo Supabase
    return {
      ...transaction,
      id: data[0].id,
    } as Transaction;
  } catch (err) {
    console.error('Erro ao adicionar transação:', err);
    throw err;
  }
};

export const updateTransactionInSupabase = async (transaction: Transaction) => {
  try {
    const user = await getCurrentUser();
    
    // Preparando o objeto para o formato que o Supabase espera
    const transactionData = {
      date: transaction.date.toISOString(),
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      payment_method: transaction.paymentMethod, // Converte camelCase para snake_case
      status: transaction.status,
      installments: transaction.installments ? JSON.stringify(transaction.installments) : null
    };
    
    const { error } = await supabase
      .from('transactions')
      .update(transactionData)
      .eq('id', transaction.id)
      .eq('user_id', user.id); // Garantir que o usuário só atualize suas próprias transações
    
    if (error) {
      throw new Error(`Erro ao atualizar transação: ${error.message}`);
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao atualizar transação:', err);
    throw err;
  }
};

export const deleteTransactionFromSupabase = async (id: string) => {
  try {
    const user = await getCurrentUser();
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Garantir que o usuário só delete suas próprias transações
    
    if (error) {
      throw new Error(`Erro ao excluir transação: ${error.message}`);
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao excluir transação:', err);
    throw err;
  }
};

// Funções para manipular itens "a pagar"
export const fetchToBePaid = async () => {
  try {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('to_be_paid')
      .select('*')
      .eq('user_id', user.id); // Filtra por user_id
    
    if (error) {
      throw new Error(`Erro ao buscar itens a pagar: ${error.message}`);
    }
    
    return data.map(item => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      status: item.status,
      month: item.month,
      year: item.year
    }));
  } catch (err) {
    console.error('Erro ao buscar itens a pagar:', err);
    throw err;
  }
};

export const addToBePaidToSupabase = async (item: {
  description: string;
  amount: number;
  status: string;
  month: number;
  year: number;
}) => {
  try {
    const user = await getCurrentUser();
    
    const itemData = {
      ...item,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('to_be_paid')
      .insert([itemData])
      .select();
    
    if (error) {
      throw new Error(`Erro ao adicionar item a pagar: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('Nenhum dado retornado após inserção');
    }
    
    return data[0];
  } catch (err) {
    console.error('Erro ao adicionar item a pagar:', err);
    throw err;
  }
};

export const updateToBePaidStatusInSupabase = async (id: string, status: TransactionStatus) => {
  try {
    const user = await getCurrentUser();
    
    const { error } = await supabase
      .from('to_be_paid')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id); // Garantir que o usuário só atualize seus próprios itens
    
    if (error) {
      throw new Error(`Erro ao atualizar status do item a pagar: ${error.message}`);
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao atualizar status do item a pagar:', err);
    throw err;
  }
};

export const deleteToBePaidFromSupabase = async (id: string) => {
  try {
    const user = await getCurrentUser();
    
    const { error } = await supabase
      .from('to_be_paid')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Garantir que o usuário só delete seus próprios itens
    
    if (error) {
      throw new Error(`Erro ao excluir item a pagar: ${error.message}`);
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao excluir item a pagar:', err);
    throw err;
  }
};

// Funções para manipular cartões de crédito
export const fetchCreditCards = async () => {
  try {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', user.id); // Filtra por user_id
    
    if (error) {
      throw new Error(`Erro ao buscar cartões de crédito: ${error.message}`);
    }
    
    // Converte os nomes das colunas do snake_case para camelCase
    return data.map(card => ({
      id: card.id,
      name: card.name,
      credit_limit: card.credit_limit,
      used: card.used,
      dueDate: card.due_date,
      closingDate: card.closing_date
    })) as CreditCard[];
  } catch (err) {
    console.error('Erro ao buscar cartões de crédito:', err);
    throw err;
  }
};

export const addCreditCardToSupabase = async (card: Omit<CreditCard, 'id'>) => {
  try {
    const user = await getCurrentUser();
    
    const cardData = {
      name: card.name,
      credit_limit: card.credit_limit,
      used: card.used,
      due_date: card.dueDate, // Converte camelCase para snake_case
      closing_date: card.closingDate, // Converte camelCase para snake_case
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('credit_cards')
      .insert([cardData])
      .select();
    
    if (error) {
      throw new Error(`Erro ao adicionar cartão de crédito: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('Nenhum dado retornado após inserção');
    }
    
    return {
      id: data[0].id,
      name: data[0].name,
      credit_limit: data[0].credit_limit,
      used: data[0].used,
      dueDate: data[0].due_date,
      closingDate: data[0].closing_date
    } as CreditCard;
  } catch (err) {
    console.error('Erro ao adicionar cartão de crédito:', err);
    throw err;
  }
};

export const updateCreditCardInSupabase = async (card: CreditCard) => {
  try {
    const user = await getCurrentUser();
    
    const cardData = {
      name: card.name,
      credit_limit: card.credit_limit,
      used: card.used,
      due_date: card.dueDate, // Converte camelCase para snake_case
      closing_date: card.closingDate // Converte camelCase para snake_case
    };
    
    const { error } = await supabase
      .from('credit_cards')
      .update(cardData)
      .eq('id', card.id)
      .eq('user_id', user.id); // Garantir que o usuário só atualize seus próprios cartões
    
    if (error) {
      throw new Error(`Erro ao atualizar cartão de crédito: ${error.message}`);
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao atualizar cartão de crédito:', err);
    throw err;
  }
};

// Função para organizar os dados em formato de meses
export const organizeDataByMonth = (
  transactions: Transaction[],
  toBePaidItems: any[]
): MonthData[] => {
  const monthsMap = new Map<string, MonthData>();
  
  // Processa transações
  transactions.forEach(transaction => {
    const month = transaction.date.getMonth();
    const year = transaction.date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!monthsMap.has(key)) {
      monthsMap.set(key, {
        month,
        year,
        transactions: [],
        toBePaid: []
      });
    }
    
    const monthData = monthsMap.get(key)!;
    monthData.transactions.push(transaction);
  });
  
  // Processa itens a pagar
  toBePaidItems.forEach(item => {
    const key = `${item.year}-${item.month}`;
    
    if (!monthsMap.has(key)) {
      monthsMap.set(key, {
        month: item.month,
        year: item.year,
        transactions: [],
        toBePaid: []
      });
    }
    
    const monthData = monthsMap.get(key)!;
    monthData.toBePaid.push({
      id: item.id,
      description: item.description,
      amount: item.amount,
      status: item.status
    });
  });
  
  // Converte para array e ordena
  return Array.from(monthsMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
};