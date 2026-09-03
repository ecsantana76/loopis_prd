import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Store, CalendarDays, Megaphone, BarChart3, ChevronLeft, ChevronRight, FileText, DollarSign } from 'lucide-react';
import { Header } from '../components/Header';
import { Logo } from '../components/Logo';

export const RestaurantLayout: React.FC = () => {
  const location = useLocation();
  const isOnboarding = location.pathname.includes('onboarding');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { to: '/restaurante/dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { to: '/restaurante/reservas', icon: <CalendarDays size={20} />, label: 'Reservas' },
    { to: '/restaurante/atividades', icon: <FileText size={20} />, label: 'Atividades & Histórico' },
    { to: '/restaurante/lancamento', icon: <DollarSign size={20} />, label: 'Lançar Comanda' },
    { to: '/restaurante/campanhas', icon: <Megaphone size={20} />, label: 'Campanhas' },
    { to: '/restaurante/configuracoes', icon: <Store size={20} />, label: 'Configurações' },
  ];

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-brand-off-white dark:bg-brand-graphite">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-off-white dark:bg-brand-graphite flex flex-col md:flex-row">
      
      {/* Mobile Header (minimal) */}
      <div className="md:hidden h-16 glassmorphism border-b border-white/20 flex items-center justify-center relative z-40">
         <Logo size="sm" hideText />
         <span className="text-xl font-bold tracking-tighter text-brand-graphite dark:text-white lowercase ml-2">loopis</span>
         <span className="px-2 py-0.5 rounded-full bg-brand-lilac/20 text-brand-deep-purple dark:text-brand-lilac text-[10px] font-bold uppercase tracking-wider ml-2">Parceiro</span>
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col glassmorphism border-r border-white/20 fixed h-full z-30 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center px-4 justify-between">
          <div className={`flex items-center ${!isSidebarOpen && 'justify-center w-full'}`}>
            <Logo size="sm" hideText={!isSidebarOpen} />
            {isSidebarOpen && (
              <span className="px-2 py-0.5 rounded-full bg-brand-lilac/20 text-brand-deep-purple dark:text-brand-lilac text-xs font-semibold ml-2">
                Parceiro
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-loopis text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'
                } ${!isSidebarOpen && 'justify-center'}`
              }
            >
              <div className="shrink-0">{item.icon}</div>
              {isSidebarOpen && <span className="font-semibold text-sm ml-3 truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3 px-2' : 'justify-center'} py-2 relative`}>
            <div className="w-8 h-8 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-violet shrink-0">
              <Store size={16} />
            </div>
            {isSidebarOpen && (
              <div className="truncate">
                <p className="text-sm font-bold text-brand-graphite dark:text-white leading-tight">Ostraria do Córrego</p>
                <p className="text-xs text-gray-500">Florianópolis, SC</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-brand-off-white dark:bg-brand-graphite border border-gray-200 dark:border-white/10 rounded-full p-1 text-gray-500 hover:text-brand-violet z-40 shadow-lg"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav equivalent for Restaurant */}
      <div className="md:hidden fixed bottom-0 w-full glassmorphism border-t border-white/20 flex justify-around p-2 pb-safe z-40">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-brand-violet' : 'text-gray-500'}`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
