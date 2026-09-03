import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Wallet, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: <Home size={22} />, label: 'Início' },
    { to: '/reserva/checkin', icon: <Calendar size={22} />, label: 'Reservas' },
    { to: '/carteira', icon: <Wallet size={22} />, label: 'Meus Loops' },
    { to: '/descontos', icon: <Ticket size={22} />, label: 'Descontos' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glassmorphism border-t border-white/20 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-brand-violet' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={{ y: isActive ? -2 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {item.icon}
                </motion.div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute bottom-1 w-8 h-1 bg-gradient-loopis rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
