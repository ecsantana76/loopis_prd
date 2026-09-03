import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, FileText, Settings, Users, ChevronLeft, ChevronRight, Store, Star, Receipt } from 'lucide-react';
import { Logo } from '../components/Logo';

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const navItems = [
    { to: '/admin/dashboard-admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/aprovacoes', icon: <ShieldCheck size={20} />, label: 'Aprovações' },
    { to: '/admin/restaurantes', icon: <Store size={20} />, label: 'Restaurantes' },
    { to: '/admin/clientes', icon: <Users size={20} />, label: 'Clientes' },
    { to: '/admin/cobrancas', icon: <FileText size={20} />, label: 'Cobranças' },
    { to: '/admin/pontuacao', icon: <Star size={20} />, label: 'Pontuação (Loops)' },
    { to: '/admin/auditoria', icon: <Receipt size={20} />, label: 'Auditoria (IA)' },
    { to: '/admin/configuracoes', icon: <Settings size={20} />, label: 'Configurações' },
  ];

  return (
    // FORCED DARK MODE for Admin Panel
    <div className="dark">
      <div className="min-h-screen bg-[#1a1a1c] text-white flex flex-col md:flex-row">
        
        {/* Desktop Sidebar */}
        <aside 
          className={`hidden md:flex flex-col bg-brand-graphite border-r border-white/5 fixed h-full z-30 transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="h-16 flex items-center px-4 justify-between">
            <div className={`flex items-center ${!isSidebarOpen && 'justify-center w-full'}`}>
              <Logo size="sm" hideText={!isSidebarOpen} />
              {isSidebarOpen && (
                <span className="px-2 py-0.5 rounded-md bg-brand-violet text-white text-[10px] font-bold uppercase tracking-wider ml-2">
                  Admin
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
                      ? 'bg-brand-violet/20 text-brand-lilac font-bold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                  } ${!isSidebarOpen && 'justify-center'}`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                {isSidebarOpen && <span className="text-sm ml-3 truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/5">
            <div className={`flex items-center ${isSidebarOpen ? 'space-x-3 px-2' : 'justify-center'} py-2 relative`}>
              <div className="w-8 h-8 rounded-full bg-brand-violet flex items-center justify-center text-white shrink-0">
                <Users size={16} />
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <p className="text-sm font-bold text-white leading-tight">Maurício</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-20 bg-brand-graphite border border-white/10 rounded-full p-1 text-gray-400 hover:text-white z-40 shadow-lg"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </aside>

        {/* Mobile Header (minimal) */}
        <div className="md:hidden h-16 bg-brand-graphite border-b border-white/5 flex items-center justify-center">
           <Logo size="sm" hideText />
           <span className="text-xl font-bold tracking-tighter text-white lowercase ml-2">loopis</span>
           <span className="px-2 py-0.5 rounded-md bg-brand-violet text-white text-[10px] font-bold uppercase tracking-wider ml-2">Admin</span>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#1a1a1c]">
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 w-full bg-brand-graphite border-t border-white/5 flex justify-around p-2 pb-safe z-40">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-brand-lilac' : 'text-gray-500'}`
              }
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
