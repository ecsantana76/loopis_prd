import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Hash, Sparkles } from 'lucide-react';

interface ManualCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  isLoading?: boolean;
}

export const ManualCodeModal: React.FC<ManualCodeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    val = val.replace(/[^A-Z0-9-]/g, '');
    setCode(val);
    if (localError) setLocalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setLocalError('Por favor, digite o código da comanda ou cupom.');
      return;
    }
    onSubmit(code.trim());
  };

  const handleQuickInsert = (exampleCode: string) => {
    setCode(exampleCode);
    setLocalError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="partner-modal-panel relative z-10 w-full max-w-md overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 text-white shadow-2xl sm:rounded-3xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center text-brand-lilac">
                <Hash size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Digitar Código</h3>
                <p className="text-xs text-gray-400">Insira o código impresso na comanda ou cupom</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Código da Comanda ou Cupom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={handleInputChange}
                    placeholder="Ex: LOOP-8821 ou CMD-4091"
                    maxLength={14}
                    autoFocus
                    className="w-full px-4 py-3.5 bg-black/40 text-white placeholder-gray-500 rounded-2xl border border-white/15 focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 font-mono tracking-wider text-base uppercase outline-none transition-all"
                  />
                  {code && (
                    <button
                      type="button"
                      onClick={() => setCode('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                {localError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center space-x-1">
                    <span>{localError}</span>
                  </p>
                )}
              </div>

              <div>
                <span className="text-[11px] text-gray-400 block mb-2 font-medium">Exemplos válidos para teste:</span>
                <div className="flex flex-wrap gap-2">
                  {['LOOP-8821', 'CMD-4091', 'TIM-1092'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleQuickInsert(item)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-brand-violet/20 border border-white/10 hover:border-brand-violet/40 text-xs font-mono text-gray-300 hover:text-white transition-all flex items-center space-x-1"
                    >
                      <Sparkles size={12} className="text-brand-lilac" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="w-full py-4 bg-gradient-loopis hover:opacity-95 disabled:opacity-50 active:scale-[0.99] text-white font-bold rounded-2xl shadow-xl shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Consultar Comanda</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
