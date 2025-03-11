import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import CreditCardList from './components/CreditCardList';
import ToBePaidList from './components/ToBePaidList';
import Login from './components/Login';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

// Componente interno que usa os hooks useFinance e useAuth
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const { isLoading, error } = useFinance();
  
  // Se estiver carregando os dados financeiros, mostra o spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Se houver erro, mostra a mensagem de erro
  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'credit-cards':
        return <CreditCardList />;
      case 'to-be-paid':
        return <ToBePaidList />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="flex h-screen bg-black text-dark-text">
      <Navbar currentPage={currentPage} onChangePage={setCurrentPage} />
      
      <div className="flex-1 md:ml-64 flex flex-col">
        <main className="flex-1 overflow-y-auto bg-black">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// Componente que só carrega o FinanceProvider se o usuário estiver autenticado
const AuthenticatedApp = () => {
  const { session, loading } = useAuth();
  
  // Se estiver carregando a autenticação, mostra o spinner
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Se não houver sessão, mostra a tela de login
  if (!session) {
    return <Login />;
  }
  
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

// Componente principal que fornece o contexto de autenticação
function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;