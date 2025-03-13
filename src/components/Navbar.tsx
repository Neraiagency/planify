import React, { useState } from 'react';
import { LayoutDashboard, CreditCard, DollarSign, List, Menu, X, LogOut, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onChangePage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onChangePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth(); // Use the auth hook
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'transactions', label: 'Transações', icon: <List className="h-5 w-5" /> },
    { id: 'credit-cards', label: 'Cartões', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'to-be-paid', label: 'A Pagar', icon: <DollarSign className="h-5 w-5" /> },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleNavItemClick = (pageId: string) => {
    onChangePage(pageId);
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 glass-navbar">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <BarChart2 className="h-8 w-8 text-accent-orange mr-3" />
              <h1 className="gradient-text text-xl font-bold">Planify</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item.id)}
                  className={`${
                    currentPage === item.id
                      ? 'bg-accent-orange bg-opacity-20 text-accent-orange'
                      : 'text-dark-text-secondary hover:bg-dark-card hover:bg-opacity-40 hover:text-dark-text'
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all duration-200 ease-in-out`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex p-4 mx-4 mb-6 rounded-xl bg-dark-card bg-opacity-50">
            <div className="flex items-center w-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-orange to-accent-orange-light flex items-center justify-center text-white font-medium">
                {user?.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-dark-text">{user?.user_metadata?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'}</p>
                <p className="text-xs text-dark-text-secondary">{user?.email || 'user@example.com'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-dark-bg hover:bg-opacity-50 text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden glass-navbar fixed top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart2 className="h-6 w-6 text-accent-orange mr-2" />
            <h1 className="gradient-text text-lg font-bold">Planify</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-dark-text-secondary hover:text-dark-text focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 pt-16 glass-navbar animate-fade-in">
          <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-5 sm:pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`${
                  currentPage === item.id
                    ? 'bg-accent-orange bg-opacity-20 text-accent-orange'
                    : 'text-dark-text-secondary hover:bg-dark-card hover:bg-opacity-40 hover:text-dark-text'
                } flex items-center px-4 py-3 rounded-xl w-full text-left transition-all duration-200 ease-in-out`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="absolute bottom-6 sm:bottom-8 left-3 sm:left-4 right-3 sm:right-4">
            <div className="flex items-center p-4 rounded-xl bg-dark-card bg-opacity-50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-orange to-accent-orange-light flex items-center justify-center text-white font-medium">
                {user?.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-dark-text">{user?.email?.split('@')[0] || 'Usuário'}</p>
                <p className="text-xs text-dark-text-secondary">{user?.email || 'user@example.com'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-dark-bg hover:bg-opacity-50 text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile padding to account for fixed header */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;