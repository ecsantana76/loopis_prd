import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Receipt, ScanLine, CheckCircle, ArrowRight } from 'lucide-react';

export const ScanReceiptRes: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedAmount, setScannedAmount] = useState<number | null>(null);

  const handleSimulateScan = () => {
    setStep('scanning');
    setTimeout(() => {
      setScannedAmount(185.50);
      setStep('success');
    }, 3500);
  };

  const handleReset = () => {
    setStep('idle');
    setScannedAmount(null);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-white">Leitura de Cupom Fiscal (IA)</h1>
        <p className="text-sm text-gray-500">Módulo rápido para o garçom/caixa validar notas impressas.</p>
      </div>

      <div className="glassmorphism rounded-3xl p-8 border border-gray-100 dark:border-white/10 text-center">
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="w-24 h-24 bg-brand-violet/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Receipt size={48} className="text-brand-violet" />
              </div>
              <h2 className="text-xl font-bold text-brand-graphite dark:text-white mb-4">
                Envie o Cupom (ECF/SAT)
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                Tire uma foto do cupom fiscal. Nossa inteligência artificial fará a leitura do valor total e do CPF do cliente automaticamente.
              </p>

              <button
                onClick={handleSimulateScan}
                className="inline-flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1a1a1c] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl hover:border-brand-violet dark:hover:border-brand-violet transition-colors group cursor-pointer w-64"
              >
                <Camera size={40} className="text-gray-400 group-hover:text-brand-violet mb-4 transition-colors" />
                <span className="font-semibold text-brand-graphite dark:text-white">Abrir Câmera</span>
              </button>
            </motion.div>
          )}

          {step === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="py-12"
            >
              <div className="relative w-40 h-40 mx-auto mb-8">
                <motion.div
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute left-0 right-0 h-1.5 bg-brand-violet shadow-[0_0_20px_rgba(124,58,237,0.8)] z-10"
                />
                <Receipt size={160} className="text-gray-200 dark:text-white/10" />
                <ScanLine size={48} className="absolute inset-0 m-auto text-brand-violet opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-brand-graphite dark:text-white mb-2">IA Analisando...</h3>
              <p className="text-gray-500">Extraindo valor total e dados do cliente.</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={48} className="text-green-500" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-brand-graphite dark:text-white mb-2">
                Leitura Concluída!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                A nota foi processada com sucesso.
              </p>

              <div className="max-w-sm mx-auto bg-white dark:bg-[#1a1a1c] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5">
                  <span className="text-gray-500 font-medium">Valor Identificado</span>
                  <span className="font-bold text-brand-graphite dark:text-white text-xl">R$ {scannedAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 font-medium">Loops a Enviar</span>
                  <div className="flex items-center text-brand-violet font-bold text-xl">
                    <span>{Math.floor(scannedAmount || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 max-w-sm mx-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 dark:bg-white/10 text-brand-graphite dark:text-white font-bold py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-loopis text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
                >
                  <span>Confirmar</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
