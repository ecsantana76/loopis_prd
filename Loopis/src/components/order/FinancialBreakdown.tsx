import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, 
  Coins, 
  Tag, 
  Percent, 
  X, 
  Sparkles, 
  AlertCircle, 
  ArrowRight 
} from 'lucide-react';
import type { Coupon } from '../../types';

interface FinancialBreakdownProps {
  subtotal: number;
  baseDiscount: number;
  baseDiscountDesc?: string;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  couponCodeInput: string;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  couponLoading: boolean;
  couponError: string | null;
  serviceFee?: number;
  userLoopsBalance: number;
  useLoopsBalance: boolean;
  onToggleLoops: (use: boolean) => void;
  loopDiscountAmount: number;
  loopsApplied: number;
  netPayable: number;
  earnedLoops: number;
  onProceedToCheckout: () => void;
}

export const FinancialBreakdown: React.FC<FinancialBreakdownProps> = ({
  subtotal,
  baseDiscount,
  baseDiscountDesc = 'Desconto Reserva Loopis',
  couponDiscount,
  appliedCoupon,
  couponCodeInput,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  couponLoading,
  couponError,
  serviceFee = 0,
  userLoopsBalance,
  useLoopsBalance,
  onToggleLoops,
  loopDiscountAmount,
  loopsApplied,
  netPayable,
  earnedLoops,
  onProceedToCheckout,
}) => {
  return (
    <div className="bg-white dark:bg-brand-graphite rounded-3xl p-5 sm:p-7 border border-gray-100 dark:border-white/10 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
        <h3 className="text-base font-bold text-brand-graphite dark:text-white flex items-center space-x-2">
          <Receipt size={20} className="text-brand-violet" />
          <span>Resumo Financeiro da Conta</span>
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-brand-violet/10 text-brand-violet font-semibold">
          Comanda Digital
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
          <span>Subtotal dos Itens</span>
          <span className="font-semibold text-brand-graphite dark:text-white">
            R$ {subtotal.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {baseDiscount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center space-x-1.5">
              <Percent size={14} />
              <span>{baseDiscountDesc}</span>
            </span>
            <span className="font-semibold">
              - R$ {baseDiscount.toFixed(2).replace('.', ',')}
            </span>
          </div>
        )}

        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex justify-between items-center text-brand-violet dark:text-brand-lilac bg-brand-violet/5 dark:bg-brand-violet/10 p-2.5 rounded-xl">
            <div className="flex items-center space-x-2">
              <Tag size={14} />
              <span className="font-semibold">{appliedCoupon.code}</span>
              <span className="text-xs text-gray-500">({appliedCoupon.description})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                title="Remover cupom"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {serviceFee > 0 && (
          <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-xs">
            <span>Taxa de Atendimento Sugerida (10%)</span>
            <span>+ R$ {serviceFee.toFixed(2).replace('.', ',')}</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/10 via-brand-violet/10 to-purple-900/10 dark:from-purple-950/40 dark:to-brand-deep-purple/40 border border-brand-violet/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-loopis flex items-center justify-center text-white shadow-md">
                <Coins size={20} />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-brand-graphite dark:text-white uppercase tracking-wider">
                    Créditos Loop
                  </h4>
                  <span className="text-[10px] bg-brand-violet/20 text-brand-violet dark:text-brand-lilac px-1.5 py-0.5 rounded font-bold">
                    {userLoopsBalance} Loops disponíveis
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Abater saldo na conta (1 Loop = R$ 0,25)
                </p>
              </div>
            </div>

            <div
              onClick={() => onToggleLoops(!useLoopsBalance)}
              className={`w-12 h-6.5 rounded-full p-0.5 cursor-pointer transition-colors flex items-center ${
                useLoopsBalance ? 'bg-brand-violet' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <motion.div
                className="w-5.5 h-5.5 bg-white rounded-full shadow-md"
                animate={{ x: useLoopsBalance ? 22 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

          <AnimatePresence>
            {useLoopsBalance && loopDiscountAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-brand-violet/15 flex justify-between items-center text-xs font-bold text-brand-violet dark:text-brand-lilac"
              >
                <span>{loopsApplied} Loops utilizados como desconto:</span>
                <span>- R$ {loopDiscountAmount.toFixed(2).replace('.', ',')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!appliedCoupon && (
          <div className="pt-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
                  placeholder="Cupom extra (ex: LOOP20)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white placeholder-gray-400 rounded-xl border border-gray-200 dark:border-white/10 text-xs uppercase font-mono outline-none focus:border-brand-violet"
                />
              </div>
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={couponLoading || !couponCodeInput.trim()}
                className="px-4 py-2.5 bg-gray-900 dark:bg-white/10 hover:bg-brand-violet text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 shrink-0"
              >
                {couponLoading ? '...' : 'Aplicar'}
              </button>
            </div>
            {couponError && (
              <p className="text-[11px] text-red-500 mt-1.5 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{couponError}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t-2 border-dashed border-gray-200 dark:border-white/15">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">
              Total Líquido a Pagar
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Economia total de R${' '}
              {(baseDiscount + couponDiscount + loopDiscountAmount).toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-graphite dark:text-white">
              R$ {netPayable.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-600 dark:text-amber-300">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-amber-500 shrink-0" />
            <span>Cashback garantido neste pagamento:</span>
          </div>
          <span className="font-bold text-sm bg-amber-500/20 px-2 py-0.5 rounded-lg">
            +{earnedLoops} Loops
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onProceedToCheckout}
        className="w-full py-4.5 bg-gradient-loopis hover:opacity-95 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-xl shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
      >
        <span>Prosseguir para Pagamento</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
