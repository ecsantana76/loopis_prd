import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const { currentRole, isLoggedIn, openLoginModal } = useStore();

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'restaurant': return 'Parceiro';
      case 'admin': return 'Admin';
      default: return '';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="sm" />

              {currentRole !== 'client' && (
                <span className="px-2 py-0.5 rounded-full bg-brand-lilac/20 text-brand-deep-purple dark:text-brand-lilac text-xs font-semibold ml-2">
                  {getRoleLabel()}
                </span>
              )}
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {currentRole === 'client' && (
              <>
                <Link to="/" className="text-sm font-medium hover:text-brand-violet transition-colors">Explorar</Link>
                <Link to="/cupons" className="text-sm font-medium hover:text-brand-violet transition-colors">Meus Cupons</Link>
              </>
            )}
            {currentRole === 'restaurant' && (
              <>
                <Link to="/restaurante/dashboard" className="text-sm font-medium hover:text-brand-violet transition-colors">Dashboard</Link>
                <Link to="/restaurante/promocoes" className="text-sm font-medium hover:text-brand-violet transition-colors">Promoções</Link>
              </>
            )}
            {currentRole === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="text-sm font-medium hover:text-brand-violet transition-colors">Visão Geral</Link>
                <Link to="/admin/usuarios" className="text-sm font-medium hover:text-brand-violet transition-colors">Usuários</Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center">
            {!isLoggedIn && currentRole === 'client' ? (
              <button 
                onClick={openLoginModal}
                className="bg-brand-violet hover:bg-brand-deep-purple text-white px-5 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105"
              >
                Entrar / Cadastrar
              </button>
            ) : (
              <div className="h-8 w-8 rounded-full bg-brand-violet/10 flex items-center justify-center text-brand-violet font-semibold">
                {(currentRole?.charAt(0) || 'C').toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
