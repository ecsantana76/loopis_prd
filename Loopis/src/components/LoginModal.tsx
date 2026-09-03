import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useStore();

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="partner-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
          className="absolute inset-0 bg-brand-graphite/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="partner-modal-panel relative w-full max-w-md overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white shadow-2xl dark:bg-brand-graphite sm:rounded-3xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
            <Logo size="sm" />
            <button
              onClick={closeLoginModal}
              className="p-2 text-gray-400 hover:text-brand-graphite dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-6 text-center">
            <h2 className="text-2xl font-bold text-brand-graphite dark:text-white">
              Acesse sua conta
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Faça login para acumular loops, resgatar prêmios e aproveitar ofertas exclusivas!
            </p>

            <div className="space-y-4 pt-4">
              <button
                onClick={login}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-brand-violet hover:bg-brand-deep-purple text-white rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Mail size={18} />
                <span>Continuar com E-mail</span>
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-gray-400 font-medium">OU</span>
                <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
              </div>

              <button
                onClick={login}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-brand-graphite dark:text-white rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 border border-gray-200 dark:border-white/10"
              >
                <span>Continuar com Google</span>
                <ArrowRight size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-gray-50 dark:bg-white/5 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/10">
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
