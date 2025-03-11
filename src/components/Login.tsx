import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { BarChart2, DollarSign, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [rendaMensal, setRendaMensal] = useState('');
  const [cargo, setCargo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [outroObjetivo, setOutroObjetivo] = useState('');

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
          options: {
            data: {
              nome: nome,
              renda_mensal: rendaMensal ? parseFloat(rendaMensal) : 0,
              cargo: cargo,
              objetivo: objetivo  === 'outro' ? outroObjetivo : objetivo,
              objetivo_tipo: objetivo,
            }
          }
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
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="glass-card rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <BarChart2 className="h-8 w-8 text-accent-orange mr-3" />
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary hover:text-accent-orange transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {isSignUp && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Renda Mensal
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-orange" size={16} />
                  <input
                    type="number"
                    step="0.01"
                    value={rendaMensal}
                    onChange={(e) => setRendaMensal(e.target.value)}
                    className="glass-input w-full pl-10 px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Cargo
                </label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Objetivo Financeiro
                </label>
                <select
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                >
                  <option value="">Selecione um objetivo</option>
                  <option value="economizar">Economizar</option>
                  <option value="investir">Investir</option>
                  <option value="quitar_dividas">Quitar dívidas</option>
                  <option value="comprar_imovel">Comprar imóvel</option>
                  <option value="aposentar">Aposentadoria</option>
                  <option value="outro">Outro</option>
                </select>

                {objetivo === 'outro' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Especifique seu objetivo"
                      value={outroObjetivo}
                      onChange={(e) => setOutroObjetivo(e.target.value)}
                      className="glass-input w-full px-4 py-2 rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-orange"
                      required
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full px-4 py-3 rounded-lg text-sm font-medium text-accent-orange hover:text-white hover:bg-accent-orange transition-all duration-200"
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
            className="text-sm text-dark-text-secondary hover:text-accent-orange transition-colors"
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