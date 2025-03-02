import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateMonthSummary, calculateCategorySummary, calculateMonthlyTrend, formatCurrency, getMonthName } from '../utils/calculations';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, TrendingDown, TrendingUp, Calendar } from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard: React.FC = () => {
  const { monthsData, currentMonthIndex } = useFinance();
  
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
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(14, 165, 233, 0.7)',
          'rgba(20, 184, 166, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(139, 92, 246, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(16, 185, 129, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(236, 72, 153, 0.9)',
          'rgba(99, 102, 241, 0.9)',
          'rgba(14, 165, 233, 0.9)',
          'rgba(20, 184, 166, 0.9)',
          'rgba(168, 85, 247, 0.9)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(71, 85, 105, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
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
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(71, 85, 105, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    cutout: '70%',
  };
  
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center bg-dark-card bg-opacity-50 rounded-lg px-3 py-1.5">
          <Calendar className="h-4 w-4 text-accent-blue mr-2" />
          <span className="text-sm text-dark-text-secondary">
            {getMonthName(currentMonthData.month)} {currentMonthData.year}
          </span>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{animationDelay: '0ms'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Receitas</p>
              <p className="text-xl font-bold text-accent-green">{formatCurrency(summary.income)}</p>
            </div>
            <div className="bg-accent-green bg-opacity-10 p-3 rounded-lg">
              <ArrowUpIcon className="h-6 w-6 text-accent-green" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{animationDelay: '100ms'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Despesas</p>
              <p className="text-xl font-bold text-accent-red">{formatCurrency(summary.expenses)}</p>
            </div>
            <div className="bg-accent-red bg-opacity-10 p-3 rounded-lg">
              <ArrowDownIcon className="h-6 w-6 text-accent-red" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{animationDelay: '200ms'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Saldo Atual</p>
              <p className={`text-xl font-bold ${summary.balance >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
            <div className={`${summary.balance >= 0 ? 'bg-accent-green bg-opacity-10' : 'bg-accent-red bg-opacity-10'} p-3 rounded-lg`}>
              <DollarSign className={`h-6 w-6 ${summary.balance >= 0 ? 'text-accent-green' : 'text-accent-red'}`} />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{animationDelay: '300ms'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Tendência</p>
              <p className={`text-xl font-bold ${trend >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                {trend.toFixed(1)}%
              </p>
            </div>
            <div className={`${trend >= 0 ? 'bg-accent-green bg-opacity-10' : 'bg-accent-red bg-opacity-10'} p-3 rounded-lg`}>
              {trend >= 0 ? (
                <TrendingUp className="h-6 w-6 text-accent-green" />
              ) : (
                <TrendingDown className="h-6 w-6 text-accent-red" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{animationDelay: '400ms'}}>
          <h2 className="text-lg font-semibold mb-4">Comparativo Mensal</h2>
          <Bar data={monthlyComparisonData} options={chartOptions} />
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{animationDelay: '500ms'}}>
          <h2 className="text-lg font-semibold mb-4">Distribuição de Despesas</h2>
          <div className="h-64">
            <Doughnut data={categoryDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="glass-card rounded-xl p-5 mb-8 animate-fade-in" style={{animationDelay: '600ms'}}>
        <h2 className="text-lg font-semibold mb-4">Detalhamento por Categoria</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Percentual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {categorySummary.map((category, index) => (
                <tr key={index} className="hover:bg-dark-card hover:bg-opacity-40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text">
                    {category.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">
                    {formatCurrency(category.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">
                    <div className="flex items-center">
                      <div className="w-16 bg-dark-card rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full bg-accent-blue"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      {category.percentage.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* To Be Paid */}
      <div className="glass-card rounded-xl p-5 animate-fade-in" style={{animationDelay: '700ms'}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">A Pagar</h2>
          <p className="text-accent-red font-semibold">{formatCurrency(summary.toBePaid)}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {currentMonthData.toBePaid.map((item, index) => (
                <tr key={index} className="hover:bg-dark-card hover:bg-opacity-40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;