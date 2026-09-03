import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Gift, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Reservation } from '../types';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export const BillingModal: React.FC<BillingModalProps> = ({ isOpen, onClose, reservation }) => {
  const [amountStr, setAmountStr] = useState('');
  const { processBilling } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);

  if (!reservation) return null;

  const amount = parseFloat(amountStr) || 0;
  const loopisCommission = amount * 0.10; // Fictitious 10% commission
  const cashbackLoops = Math.floor(amount); // R$1 = 1 Loop

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    
    processBilling(reservation.id, amount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setAmountStr('');
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="app-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="app-modal-panel relative w-full max-w-md overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white shadow-2xl dark:bg-brand-graphite sm:rounded-3xl"
            >
              {!isSuccess ? (
                <>
                  <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
                    <h2 className="text-xl font-bold text-brand-graphite dark:text-white flex items-center space-x-2">
                      <DollarSign className="text-brand-violet" />
                      <span>Lançar Consumo</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
                      <p className="text-lg font-bold text-brand-deep-purple dark:text-white">{reservation.clientName || 'Cliente Loopis'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="bg-brand-violet/10 text-brand-violet text-xs font-bold px-2 py-0.5 rounded-md">Mesa / Reserva</span>
                        <span className="text-xs font-mono text-gray-400">{reservation.id}</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Valor Total Consumido (R$)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            required
                            autoFocus
                            value={amountStr}
                            onChange={(e) => setAmountStr(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-xl bg-gray-50 dark:bg-black/20 border-2 border-brand-violet/30 focus:border-brand-violet outline-none transition-all dark:text-white" 
                            placeholder="0.00" 
                          />
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 bg-brand-off-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                            <Gift size={14} className="text-brand-violet" />
                            <span>Cashback p/ o cliente</span>
                          </span>
                          <span className="font-bold text-brand-violet">{cashbackLoops} Loops</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Comissão Loopis (10%)</span>
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            R$ {loopisCommission.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={amount <= 0}
                        className="w-full bg-gradient-loopis text-white font-bold py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4)] disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        Encerrar e Enviar Cashback
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center h-[400px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle size={48} className="text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-brand-graphite dark:text-white mb-2">Conta Encerrada!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {cashbackLoops} Loops foram creditados na carteira do cliente.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
