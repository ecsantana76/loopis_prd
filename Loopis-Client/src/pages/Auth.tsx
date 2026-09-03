import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Logo } from '../components/Logo';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    phone: '',
    cpf: '',
    dataNascimento: '',
  });
  const { login } = useStore();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      // Cadastro completo via email -> concede bônus de pontuação extra
      useStore.setState((state) => ({
        loopsBalance: state.loopsBalance + 50,
        transactions: [
          {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            amount: 50,
            type: 'bonus',
            description: 'Bônus: Cadastro completo de conta'
          },
          ...state.transactions
        ]
      }));
    }
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-off-white dark:bg-brand-graphite flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-lilac/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-brand-violet/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      
      <div className="w-full max-w-md mx-auto z-10 space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" hideText={false} />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
            Sua conta no restaurante vira dinheiro de volta.
          </p>
        </div>

        {/* Educational Banner */}
        <div className="bg-brand-violet/10 border border-brand-violet/20 rounded-2xl p-4 text-center">
          <p className="text-sm text-brand-deep-purple dark:text-brand-lilac font-medium">
            🎁 Complete o cadastro com e-mail e ganhe <span className="font-bold">+50 Loops extras</span>!
          </p>
        </div>

        <div className="glassmorphism rounded-3xl p-6 shadow-xl shadow-brand-violet/5">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                isLogin ? 'bg-white dark:bg-brand-graphite text-brand-deep-purple dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                !isLogin ? 'bg-white dark:bg-brand-graphite text-brand-deep-purple dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <button onClick={handleAuth} className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white dark:bg-[#2B2B2E] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-xl font-semibold transition-all shadow-sm">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar com Google</span>
            </button>
            
            <button onClick={handleAuth} className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-semibold transition-all shadow-sm">
              <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continuar com Facebook</span>
            </button>

            <button onClick={handleAuth} className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-black dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 text-white rounded-xl font-semibold transition-all shadow-sm">
              <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.67-.82 1.13-1.96.99-3.1-.97.04-2.16.65-2.85 1.46-.62.72-1.16 1.88-.99 3 .01 0 .03 0 .04 0 1.08 0 2.19-.54 2.81-1.36z" />
              </svg>
              <span>Continuar com Apple</span>
            </button>
          </div>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-400 font-medium">OU USE SEU EMAIL</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white text-sm"
                  placeholder="Nome completo *"
                />
              </div>
            )}

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white text-sm"
                  placeholder="Seu e-mail *"
                />
              </div>
            </div>

            <div>
              <input
                type="password"
                name="senha"
                required
                value={formData.senha}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white text-sm"
                placeholder="Sua senha *"
              />
            </div>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white text-sm"
                      placeholder="Seu WhatsApp *"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="cpf"
                      required
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white text-sm"
                      placeholder="CPF *"
                    />
                    <input
                      type="date"
                      name="dataNascimento"
                      required
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-loopis text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>{isLogin ? 'Entrar com Email' : 'Criar Conta (+50 Loops)'}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
