import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { ArrowRight, LogIn } from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRegister }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0d0b14]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-purple-950/20' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo size="md" />

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#beneficios" className="hover:text-purple-400 transition-colors">Benefícios</a>
          <a href="#como-funciona" className="hover:text-purple-400 transition-colors">Como Funciona</a>
          <a href="#calculadora" className="hover:text-purple-400 transition-colors">Calculadora de Retorno</a>
          <a href="#faq" className="hover:text-purple-400 transition-colors">Dúvidas Frequentes</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenRegister}
            className="hidden sm:flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white px-3 py-2 transition-colors"
          >
            <LogIn size={16} />
            <span>Já sou parceiro</span>
          </button>
          
          <button
            onClick={onOpenRegister}
            className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-[1px] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
          >
            <span className="flex items-center space-x-2 rounded-xl bg-[#0d0b14] px-4 py-2.5 transition-all duration-300 group-hover:bg-opacity-0">
              <span className="text-sm">Cadastrar Restaurante</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
