import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Sparkles } from 'lucide-react';
import { Logo } from '../Logo';

interface GuestHeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const GuestHeader: React.FC<GuestHeaderProps> = ({
  onOpenLogin,
  onOpenRegister,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleExplorePartners = () => {
    if (location.pathname !== '/') {
      navigate('/#explorar');
      return;
    }

    document.getElementById('explorar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', '/#explorar');
  };

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism border-b border-gray-200/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex min-w-0 items-center space-x-4 sm:space-x-8">
            <Logo size="md" />

            <nav className="hidden md:flex items-center space-x-6">
              <button type="button" onClick={handleExplorePartners} className="text-xs font-semibold transition-colors hover:text-brand-violet sm:text-sm">
                Explorar Parceiros
              </button>
              <Link to="/experiencias" className={`flex items-center space-x-1 text-xs font-bold transition-colors hover:text-brand-violet sm:text-sm ${location.pathname === '/experiencias' ? 'text-brand-violet dark:text-brand-lilac' : 'text-brand-graphite dark:text-white'}`}>
                <Sparkles size={14} className="text-brand-violet dark:text-brand-lilac" />
                <span>Experiências</span>
              </Link>
            </nav>
          </div>

          <div className="flex shrink-0 items-center space-x-1 sm:space-x-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-brand-graphite dark:text-white hover:text-brand-violet dark:hover:text-brand-lilac hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="bg-gradient-loopis hover:opacity-95 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-brand-violet/30 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Criar Conta</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
