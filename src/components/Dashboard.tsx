import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateMonthSummary, calculateCategorySummary, calculateMonthlyTrend, formatCurrency, getMonthName } from '../utils/calculations';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, TrendingDown, TrendingUp, Calendar, PlusCircle } from 'lucide-react';
// Importar o componente de formulário de transação
import TransactionForm from './TransactionForm';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard: React.FC = () => {
  const { monthsData, currentMonthIndex, creditCards } = useFinance();
  
  // Estado para controlar a exibição do formulário de transação
  const [showTransactionForm, setShowTransactionForm] = useState<boolean>(false);
  
  // Se não houver meses disponíveis, exibe uma mensagem para começar a adicionar dados
  if (monthsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-dark-bg px-4">
        <div className="text-center max-w-md">
          <div className="bg-accent-orange bg-opacity-10 rounded-full p-3 sm:p-4 mb-4 sm:mb-6 mx-auto w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <PlusCircle className="h-6 w-6 sm:h-8 sm:w-8 text-accent-orange" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-dark-text">Comece a adicionar suas finanças</h2>
          <p className="text-sm text-dark-text-secondary mb-4 sm:mb-6">
            Você ainda não possui dados financeiros. Comece adicionando transações, cartões de crédito ou itens a pagar.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setShowTransactionForm(true)}
              className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200 w-full sm:w-auto"
            >
              Adicionar Transação
            </button>
          </div>
        </div>
        
        {/* Renderizar o formulário de transação condicionalmente */}
        {showTransactionForm && (
          <TransactionForm onClose={() => setShowTransactionForm(false)} />
        )}
      </div>
    );
  }
  
  const currentMonthData = monthsData[currentMonthIndex];
  const previousMonthData = currentMonthIndex > 0 ? monthsData[currentMonthIndex - 1] : undefined;
  
  const summary = calculateMonthSummary(currentMonthData);
  const categorySummary = calculateCategorySummary(currentMonthData.transactions);
  const trend = calculateMonthlyTrend(currentMonthData, previousMonthData);
  
  // Prepare data for monthly comparison chart
  const monthlyComparisonData = {
    labels: monthsData.slice(-6).map(data => `${getMonthName(data.month).substring(0, 3)}/${data.year}`),
    datasets: [
      {
        label: 'Receitas',
        data: monthsData.slice(-6).map(data => {
          const monthlySummary = calculateMonthSummary(data);
          return monthlySummary.income;
        }),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: 1,
      },
      {
        label: 'Despesas',
        data: monthsData.slice(-6).map(data => {
          const monthlySummary = calculateMonthSummary(data);
          return monthlySummary.expenses;
        }),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 0.8)',
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for category distribution chart
  const categoryDistributionData = {
    labels: categorySummary.map(category => category.category),
    datasets: [
      {
        data: categorySummary.map(category => category.amount),
        backgroundColor: [
          'rgba(255, 123, 0, 0.7)',    // accent-orange base
          'rgba(255, 154, 68, 0.7)',    // accent-orange-light
          'rgba(204, 98, 0, 0.7)',      // accent-orange-dark
          'rgba(255, 183, 77, 0.7)',    // Outro tom de laranja
          'rgba(239, 68, 68, 0.7)',     // Manter accent-red para despesas
          'rgba(255, 99, 71, 0.7)',     // Variação de vermelho/laranja
          'rgba(255, 140, 0, 0.7)',     // Outra variação de laranja
          'rgba(255, 165, 0, 0.7)',     // Outra variação de laranja
          'rgba(16, 185, 129, 0.7)',    // Manter accent-green para receitas
          'rgba(255, 69, 0, 0.7)',      // Mais uma variação de laranja
        ],
        borderColor: [
          'rgba(255, 123, 0, 0.9)',
          'rgba(255, 154, 68, 0.9)',
          'rgba(204, 98, 0, 0.9)',
          'rgba(255, 183, 77, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(255, 99, 71, 0.9)',
          'rgba(255, 140, 0, 0.9)',
          'rgba(255, 165, 0, 0.9)',
          'rgba(16, 185, 129, 0.9)',
          'rgba(255, 69, 0, 0.9)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
          boxWidth: window.innerWidth < 640 ? 10 : 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(71, 85, 105, 0.2)',
        borderWidth: 1,
        padding: window.innerWidth < 640 ? 8 : 12,
        boxPadding: window.innerWidth < 640 ? 4 : 6,
        usePointStyle: true,
        callbacks: {
          labelPointStyle: () => ({
            pointStyle: 'circle',
            rotation: 0,
          }),
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: window.innerWidth < 640 ? 9 : 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: window.innerWidth < 640 ? 9 : 11,
          },
        },
      },
    },
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: window.innerWidth < 640 ? 'bottom' : 'right' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          padding: window.innerWidth < 640 ? 10 : 20,
          boxWidth: window.innerWidth < 640 ? 10 : 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(71, 85, 105, 0.2)',
        borderWidth: 1,
        padding: window.innerWidth < 640 ? 8 : 12,
        boxPadding: window.innerWidth < 640 ? 4 : 6,
        usePointStyle: true,
      },
    },
    cutout: '70%',
  };
  
  return (
    <>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 mt-4 sm:mt-6 md:mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 px-1 sm:px-2"> 
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-0 py-1">Dashboard</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center bg-dark-card bg-opacity-50 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-accent-orange mr-1 sm:mr-2" />
              <span className="text-dark-text-secondary">
                {getMonthName(currentMonthData.month)} {currentMonthData.year}
              </span>
            </div>
            <button
              onClick={() => setShowTransactionForm(true)}
              className="glass-button flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200 ml-auto"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Transação
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="glass-card rounded-xl p-3 sm:p-4 md:p-5 animate-fade-in" style={{animationDelay: '0ms'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dark-text-secondary mb-1">Receitas</p>
                <p className="text-lg sm:text-xl font-bold text-accent-green">{formatCurrency(summary.income)}</p>
              </div>
              <div className="bg-accent-green bg-opacity-10 p-2 sm:p-3 rounded-lg">
                <ArrowUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-accent-green" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-3 sm:p-4 md:p-5 animate-fade-in" style={{animationDelay: '100ms'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dark-text-secondary mb-1">Despesas</p>
                <p className="text-lg sm:text-xl font-bold text-accent-red">{formatCurrency(summary.expenses)}</p>
              </div>
              <div className="bg-accent-red bg-opacity-10 p-2 sm:p-3 rounded-lg">
                <ArrowDownIcon className="h-5 w-5 sm:h-6 sm:w-6 text-accent-red" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-3 sm:p-4 md:p-5 animate-fade-in" style={{animationDelay: '200ms'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dark-text-secondary mb-1">Saldo Atual</p>
                <p className={`text-lg sm:text-xl font-bold ${summary.balance >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {formatCurrency(summary.balance)}
                </p>
              </div>
              <div className={`${summary.balance >= 0 ? 'bg-accent-green bg-opacity-10' : 'bg-accent-red bg-opacity-10'} p-2 sm:p-3 rounded-lg`}>
                <DollarSign className={`h-5 w-5 sm:h-6 sm:w-6 ${summary.balance >= 0 ? 'text-accent-green' : 'text-accent-red'}`} />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-3 sm:p-4 md:p-5 animate-fade-in" style={{animationDelay: '300ms'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dark-text-secondary mb-1">Tendência</p>
                <p className={`text-lg sm:text-xl font-bold ${trend >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {trend.toFixed(1)}%
                </p>
              </div>
              <div className={`${trend >= 0 ? 'bg-accent-green bg-opacity-10' : 'bg-accent-red bg-opacity-10'} p-2 sm:p-3 rounded-lg`}>
                {trend >= 0 ? (
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent-green" />
                ) : (
                  <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-accent-red" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="glass-card rounded-xl p-3 sm:p-5 animate-fade-in" style={{animationDelay: '400ms'}}>
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Comparativo Mensal</h2>
            <Bar data={monthlyComparisonData} options={chartOptions} />
          </div>
          
          <div className="glass-card rounded-xl p-3 sm:p-5 animate-fade-in" style={{animationDelay: '500ms'}}>
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Distribuição de Despesas</h2>
            {categorySummary.length > 0 ? (
              <div className="h-48 sm:h-52 md:h-64">
                <Doughnut data={categoryDistributionData} options={doughnutOptions} />
              </div>
            ) : (
              <div className="h-48 sm:h-52 md:h-64 flex items-center justify-center">
                <p className="text-dark-text-secondary text-sm">Sem despesas no período</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div className="glass-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6 md:mb-8 animate-fade-in overflow-hidden" style={{animationDelay: '600ms'}}>
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Detalhamento por Categoria</h2>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full divide-y divide-dark-border">
              <thead>
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Percentual
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {categorySummary.length > 0 ? (
                  categorySummary.map((category, index) => (
                    <tr key={index} className="hover:bg-dark-card hover:bg-opacity-40 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-dark-text">
                        {category.category}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-dark-text-secondary">
                        {formatCurrency(category.amount)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-dark-text-secondary">
                        <div className="flex items-center">
                          <div className="w-12 sm:w-16 bg-dark-card rounded-full h-1.5 sm:h-2 mr-2">
                            <div
                              className="h-1.5 sm:h-2 rounded-full bg-accent-orange"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          {category.percentage.toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-3 sm:px-6 py-8 sm:py-10 text-center text-xs sm:text-sm text-dark-text-secondary">
                      Sem despesas para mostrar neste período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* To Be Paid */}
        <div className="glass-card rounded-xl p-3 sm:p-5 animate-fade-in overflow-hidden" style={{animationDelay: '700ms'}}>
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">A Pagar</h2>
            <p className="text-accent-red text-sm sm:text-base font-semibold">{formatCurrency(summary.toBePaid)}</p>
          </div>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full divide-y divide-dark-border">
              <thead>
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {currentMonthData.toBePaid.length > 0 ? (
                  currentMonthData.toBePaid.map((item, index) => (
                    <tr key={index} className="hover:bg-dark-card hover:bg-opacity-40 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-dark-text">
                        {item.description}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-dark-text-secondary">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'paid' ? 'bg-accent-green bg-opacity-10 text-accent-green' : 
                          item.status === 'pending' ? 'bg-accent-yellow bg-opacity-10 text-accent-yellow' : 
                          'bg-dark-card text-dark-text-secondary'
                        }`}>
                          {item.status === 'paid' ? 'Pago' : 
                          item.status === 'pending' ? 'Pendente' : 
                          'Agendado'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-3 sm:px-6 py-8 sm:py-10 text-center text-xs sm:text-sm text-dark-text-secondary">
                      Sem itens a pagar neste período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Renderizar o formulário de transação condicionalmente */}
      {showTransactionForm && (
        <TransactionForm onClose={() => setShowTransactionForm(false)} />
      )}
    </>
  );
};

export default Dashboard;