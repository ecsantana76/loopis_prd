import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, UserCheck, Store, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { ProfileRole } from '../types';

export const ProfileSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRole, setRole, isLoggedIn, login, logout } = useStore();
  const navigate = useNavigate();

  const roles = [
    { id: 'visitor', role: 'client' as ProfileRole, label: 'Visitante Deslogado', icon: <User size={18} /> },
    { id: 'client_logged', role: 'client' as ProfileRole, label: 'Cliente Logado', icon: <UserCheck size={18} /> },
    { id: 'restaurant', role: 'restaurant' as ProfileRole, label: 'Restaurante', icon: <Store size={18} /> },
    { id: 'admin', role: 'admin' as ProfileRole, label: 'Admin', icon: <Shield size={18} /> },
  ];

  const handleRoleChange = (roleDef: typeof roles[0]) => {
    setRole(roleDef.role);
    
    if (roleDef.id === 'visitor') {
      logout();
    } else if (roleDef.id === 'client_logged') {
      login();
    } else if (roleDef.role !== 'client') {
      // Quando for admin ou restaurante, fazemos logout do client state só para garantir
      logout();
    }

    setIsOpen(false);
    
    if (roleDef.role === 'client') navigate('/');
    if (roleDef.role === 'restaurant') navigate('/restaurante');
    if (roleDef.role === 'admin') navigate('/admin');
  };

  const isCurrentSelection = (id: string, role: ProfileRole) => {
    if (role !== currentRole) return false;
    if (role === 'client') {
      if (id === 'visitor' && !isLoggedIn) return true;
      if (id === 'client_logged' && isLoggedIn) return true;
      return false;
    }
    return true;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 mb-2 w-56 glassmorphism rounded-2xl shadow-xl overflow-hidden p-2"
          >
            <div className="text-xs font-semibold text-brand-graphite dark:text-brand-off-white/70 px-3 py-2 uppercase tracking-wider">
              Alternar Visão
            </div>
            <div className="space-y-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-3 transition-colors ${
                    isCurrentSelection(role.id, role.role)
                      ? 'bg-gradient-loopis text-white'
                      : 'hover:bg-black/5 dark:hover:bg-white/10 text-brand-graphite dark:text-brand-off-white'
                  }`}
                >
                  {role.icon}
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-gradient-loopis text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Selecionar Perfil"
      >
        <Settings size={24} />
      </button>
    </div>
  );
};
