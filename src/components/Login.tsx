import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { BarChart2 } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Criar novo usuário
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        alert('Verificação enviada para seu email! Por favor verifique sua caixa de entrada.');
      } else {
        // Login com usuário existente
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro durante a autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="glass-card rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <BarChart2 className="h-8 w-8 text-accent-blue mr-3" />
          <h1 className="gradient-text text-xl font-bold">Planify</h1>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Crie sua conta' : 'Entre na sua conta'}
        </h2>

        {error && (
          <div className="bg-accent-red bg-opacity-10 text-accent-red p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full px-4 py-3 rounded-lg text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue transition-all duration-200"
          >
            {loading 
              ? 'Processando...' 
              : isSignUp 
                ? 'Criar Conta' 
                : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-dark-text-secondary hover:text-accent-blue transition-colors"
          >
            {isSignUp 
              ? 'Já tem uma conta? Entrar' 
              : 'Não tem uma conta? Criar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;