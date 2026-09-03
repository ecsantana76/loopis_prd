import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Utensils, CheckCircle2, ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { GuestRestaurant } from '../../types';

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRestaurant: GuestRestaurant | null;
  onSelectLogin?: () => void;
  onSelectRegister?: () => void;
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({
  isOpen,
  onClose,
  selectedRestaurant,
  onSelectLogin,
  onSelectRegister,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRegisterClick = () => {
    onClose();
    if (onSelectRegister) {
      onSelectRegister();
    } else {
      const redirectParam = selectedRestaurant ? `?redirect=${selectedRestaurant.id}` : '';
      navigate(`/auth${redirectParam}`);
    }
  };

  const handleLoginClick = () => {
    onClose();
    if (onSelectLogin) {
      onSelectLogin();
    } else {
      const redirectParam = selectedRestaurant ? `?redirect=${selectedRestaurant.id}` : '';
      navigate(`/auth${redirectParam}`);
    }
  };

  return (
    <AnimatePresence>
      <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="partner-modal-panel relative z-10 w-full max-w-lg overflow-x-hidden overflow-y-auto rounded-t-3xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-brand-graphite sm:rounded-3xl"
        >
          <div className="relative h-36 sm:h-44 w-full bg-gradient-loopis overflow-hidden">
            {selectedRestaurant ? (
              <>
                <img
                  src={selectedRestaurant.imageUrl}
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite dark:from-brand-graphite via-brand-deep-purple/60 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-loopis opacity-95" />
            )}

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors z-20"
              title="Fechar modal"
            >
              <X size={18} />
            </button>

            <div className="absolute -bottom-6 left-6 z-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-loopis p-1 shadow-xl border-4 border-white dark:border-brand-graphite flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-brand-graphite rounded-xl flex items-center justify-center text-brand-violet dark:text-brand-lilac">
                  {selectedRestaurant ? <Utensils size={26} /> : <Sparkles size={26} />}
                </div>
              </div>
            </div>

            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-extrabold flex items-center space-x-1 shadow-md animate-pulse">
                <Gift size={13} />
                <span>+50 LOOPS BÔNUS</span>
              </span>
            </div>
          </div>

          <div className="pt-9 p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white leading-tight">
                {selectedRestaurant ? (
                  <>
                    Acesse o cardápio e benefícios de{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-loopis">
                      {selectedRestaurant.name}
                    </span>
                  </>
                ) : (
                  <>
                    Entre para o clube gastronômico do{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-loopis">Loopis</span>
                  </>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
                Cadastre-se gratuitamente para ver valores, fotos dos pratos, fazer reservas sem fila e acumular dinheiro de volta na comanda.
              </p>
            </div>

            <div className="space-y-2.5 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-xs text-gray-700 dark:text-gray-200">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>
                  <strong>Ganhe 50 Loops Grátis</strong> no cadastro para abater no parceiro.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 size={16} className="text-brand-violet shrink-0" />
                <span>
                  <strong>Cashback automático</strong> de até 25% em cada comanda fechada.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                <span>
                  <strong>Divisão de conta facilitada</strong> (Split Payment via Pix instantâneo).
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleRegisterClick}
                className="w-full bg-gradient-loopis hover:opacity-95 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl shadow-brand-violet/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Criar conta grátis</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-violet dark:hover:text-brand-lilac hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogIn size={16} />
                <span>Já tenho uma conta / Entrar</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
