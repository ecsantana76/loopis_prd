import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Users } from 'lucide-react';

interface SplitProgressBarProps {
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  paidPercentage: number;
  totalParticipants: number;
  paidParticipants: number;
}

export const SplitProgressBar: React.FC<SplitProgressBarProps> = ({
  totalAmount,
  totalPaid,
  totalRemaining,
  paidPercentage,
  totalParticipants,
  paidParticipants,
}) => {
  const isFullyPaid = paidPercentage >= 100;

  return (
    <div className="bg-white dark:bg-brand-graphite rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-white/10 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-xl ${isFullyPaid ? 'bg-emerald-500/20 text-emerald-500' : 'bg-brand-violet/20 text-brand-violet'}`}>
            {isFullyPaid ? <CheckCircle2 size={18} /> : <Clock size={18} />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status da Divisão
            </h4>
            <p className="text-sm font-extrabold text-brand-graphite dark:text-white">
              {isFullyPaid ? 'Comanda 100% Liquidada!' : `${paidPercentage}% Pago`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1 text-gray-500">
            <Users size={14} className="text-brand-violet" />
            <span>{paidParticipants} de {totalParticipants} quitados</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-3.5 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-violet via-brand-lilac to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, paidPercentage))}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-white/10 text-center">
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total</span>
          <span className="text-xs sm:text-sm font-bold text-brand-graphite dark:text-white">
            R$ {totalAmount.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold block">Pago</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
            R$ {totalPaid.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-semibold block">Restante</span>
          <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
            R$ {totalRemaining.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </div>
  );
};
