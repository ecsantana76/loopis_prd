import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BadgePercent,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Grid3X3,
  LogOut,
  QrCode,
  Settings,
  ShipWheel,
  Star,
  Ticket,
  Users,
  WalletCards,
} from 'lucide-react';
import { getPartnerNavigation, type PartnerNavIcon } from '../../constants/navigation';
import { usePartnerContext } from '../../hooks/usePartnerContext';
import { Logo } from '../Logo';
import { useStore } from '../../store/useStore';

const iconMap: Record<PartnerNavIcon, React.ReactNode> = {
  barChart: <BarChart3 size={20} />,
  wallet: <WalletCards size={20} />,
  settings: <Settings size={20} />,
  calendar: <CalendarDays size={20} />,
  bookOpen: <BookOpen size={20} />,
  scan: <QrCode size={20} />,
  ship: <ShipWheel size={20} />,
  users: <Users size={20} />,
  ticket: <Ticket size={20} />,
  badgePercent: <BadgePercent size={20} />,
  grid: <Grid3X3 size={20} />,
  cloudSun: <CloudSun size={20} />,
  star: <Star size={20} />,
};

export const PartnerLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const partner = usePartnerContext();
  const logout = useStore((state) => state.logout);
  const navigation = getPartnerNavigation(partner.partnerType);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="partner-shell dark min-h-screen overflow-x-hidden bg-[#151518] text-white">
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-full flex-col border-r border-white/10 bg-brand-graphite transition-all duration-300 md:flex ${
          isSidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className={`flex items-center ${!isSidebarOpen ? 'w-full justify-center' : ''}`}>
            <Logo size="sm" hideText={!isSidebarOpen} />
            {isSidebarOpen && (
              <span className="ml-2 rounded-md bg-brand-violet px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                Parceiro
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-3 py-5">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/dashboard'}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3 py-3 transition-all ${
                  isActive
                    ? 'bg-brand-violet/20 text-brand-lilac'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                } ${!isSidebarOpen ? 'justify-center' : ''}`
              }
            >
              <span className="shrink-0">{iconMap[item.icon]}</span>
              {isSidebarOpen && (
                <span className="ml-3 min-w-0">
                  <span className="block truncate text-sm font-bold">{item.label}</span>
                  <span className="block truncate text-[10px] text-gray-500">{item.description}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className={`flex items-center gap-3 ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-violet text-white">
              <BarChart3 size={17} />
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{partner.partnerName}</p>
                <p className="truncate text-xs text-gray-500">{partner.neighborhood}</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen((current) => !current)}
          className="absolute -right-3 top-20 rounded-full border border-white/10 bg-brand-graphite p-1 text-gray-400 shadow-lg hover:text-white"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      <div className={`min-h-screen min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#151518]/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-lilac">Painel do parceiro</p>
              <h1 className="mt-1 truncate text-xl font-black">{partner.partnerName}</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-black text-gray-200 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 sm:w-auto"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </header>

        <main className="partner-content min-w-0 px-3 pb-24 pt-4 sm:p-6">
          <Outlet />
        </main>

        <nav className="partner-mobile-nav fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 gap-1 border-t border-white/10 bg-brand-graphite px-2 pt-2 md:hidden" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
          {navigation.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-lg p-2 text-[10px] ${isActive ? 'text-brand-lilac' : 'text-gray-500'}`
              }
            >
              {iconMap[item.icon]}
              <span className="mt-1 max-w-full truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
