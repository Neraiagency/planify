import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import CreditCardList from './components/CreditCardList';
import ToBePaidList from './components/ToBePaidList';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
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
    <FinanceProvider>
      <div className="flex h-screen bg-dark-bg text-dark-text">
        <Navbar currentPage={currentPage} onChangePage={setCurrentPage} />
        
        <div className="flex-1 md:ml-64 flex flex-col">
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </FinanceProvider>
  );
}

export default App;