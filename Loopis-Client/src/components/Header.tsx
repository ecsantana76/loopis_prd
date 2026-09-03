import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Wallet, Sparkles, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';
import { NotificationsMenu } from './NotificationsMenu';
import { FriendsModal } from './profile/FriendsModal';

export const Header: React.FC = () => {
  const { currentRole, isLoggedIn, openLoginModal, logout, loopsBalance, friendInvites } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const pendingInvitesCount = friendInvites.filter((inv) => inv.status === 'pending').length;

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'restaurant': return 'Parceiro';
      case 'admin': return 'Admin';
      default: return '';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
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
                <Link to="/experiencias" className="text-sm font-bold text-brand-violet dark:text-brand-lilac hover:opacity-80 transition-colors flex items-center space-x-1">
                  <Sparkles size={14} className="text-brand-violet dark:text-brand-lilac" />
                  <span>Experiências</span>
                </Link>
                <Link to="/reserva/checkin" className="text-sm font-medium hover:text-brand-violet transition-colors">Minhas Reservas</Link>
                <Link to="/carteira" className="text-sm font-medium hover:text-brand-violet transition-colors">Meus Loops</Link>
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
          
          <div className="flex items-center relative" ref={dropdownRef}>
            {!isLoggedIn ? (
              <button 
                onClick={openLoginModal}
                className="bg-brand-violet hover:bg-brand-deep-purple text-white px-5 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105"
              >
                Entrar / Cadastrar
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                {currentRole === 'client' && (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate('/carteira')}
                      className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors border border-gray-200/50 dark:border-white/5 cursor-pointer"
                      title="Ver Meus Loops"
                    >
                      <Wallet size={15} className="text-brand-violet dark:text-brand-lilac" />
                      <span className="font-extrabold text-xs text-brand-deep-purple dark:text-brand-lilac">
                        {loopsBalance}
                      </span>
                    </button>
                    <NotificationsMenu />
                  </>
                )}

                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 w-10 rounded-full bg-gradient-loopis p-0.5 hover:ring-2 hover:ring-brand-violet transition-all shadow-md focus:outline-none flex items-center justify-center cursor-pointer"
                  title="Perfil e Opções"
                >
                  <div className="h-full w-full bg-white dark:bg-brand-graphite rounded-full flex items-center justify-center text-brand-violet font-bold">
                    {(currentRole?.charAt(0) || 'C').toUpperCase()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-52 bg-white dark:bg-[#1a1a1c] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5">
                      <p className="text-xs text-gray-400 font-medium">Conectado como</p>
                      <p className="text-sm font-bold text-brand-graphite dark:text-white truncate">
                        {currentRole === 'client' ? 'Usuário Client' : currentRole === 'restaurant' ? 'Parceiro' : 'Administrador'}
                      </p>
                    </div>

                    {currentRole === 'client' && (
                      <>
                        <Link
                          to="/perfil"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-brand-violet/10 hover:text-brand-violet transition-colors"
                        >
                          <User size={16} />
                          <span>Editar Perfil</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsFriendsModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-brand-violet/10 hover:text-brand-violet transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <Users size={16} />
                            <span>Meus Amigos</span>
                          </div>
                          {pendingInvitesCount > 0 && (
                            <span className="bg-brand-coral text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                              {pendingInvitesCount}
                            </span>
                          )}
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      <span>Sair do Sistema</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <FriendsModal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
      />
    </header>
  );
};
