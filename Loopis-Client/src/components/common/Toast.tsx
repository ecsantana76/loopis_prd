import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-brand-graphite/95 text-white backdrop-blur-md shadow-2xl border border-white/15 flex items-center space-x-2.5 max-w-sm w-full mx-4 pointer-events-none"
        >
          {type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
          {type === 'error' && <AlertCircle size={18} className="text-red-400 shrink-0" />}
          {type === 'info' && <Info size={18} className="text-brand-lilac shrink-0" />}
          <span className="text-xs font-semibold leading-snug">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
