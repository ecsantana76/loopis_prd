import React from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Gift, Info, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Wallet: React.FC = () => {
  const { loopsBalance, transactions } = useStore();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn': return <ArrowUpRight size={18} className="text-green-500" />;
      case 'redeem': return <ArrowDownRight size={18} className="text-red-500" />;
      case 'bonus': return <Gift size={18} className="text-brand-violet" />;
      default: return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn': return 'text-green-600 dark:text-green-400';
      case 'redeem': return 'text-red-600 dark:text-red-400';
      case 'bonus': return 'text-brand-violet dark:text-brand-lilac';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-brand-off-white">
          Minha Carteira
        </h1>
        <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
          <WalletIcon size={20} className="text-brand-violet" />
        </div>
      </div>

      {/* Credit Card Style Balance */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full h-48 rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(124,58,237,0.7)] mb-8 border border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-loopis" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-overlay" />
        
        <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium opacity-80 uppercase tracking-widest">Saldo Atual</span>
            <span className="font-extrabold tracking-tighter text-xl lowercase opacity-90 drop-shadow-md">loopis</span>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex items-baseline space-x-1">
              <span className="text-5xl font-extrabold tracking-tight drop-shadow-lg">{loopsBalance}</span>
              <span className="text-lg font-medium opacity-80">Loops</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="mb-8">
        <Link to="/carteira/ler-cupom" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-brand-violet/10 rounded-full flex items-center justify-center mb-2">
            <Camera size={20} className="text-brand-violet" />
          </div>
          <span className="text-sm font-semibold text-brand-graphite dark:text-white text-center leading-tight">Ler Cupom<br/>Fiscal</span>
        </Link>
      </div>

      {/* Rule Card */}
      <div className="bg-brand-violet/10 border border-brand-violet/20 rounded-2xl p-4 flex items-start space-x-3 mb-8">
        <Info size={20} className="text-brand-violet shrink-0 mt-0.5" />
        <p className="text-sm text-brand-deep-purple dark:text-brand-lilac font-medium">
          A cada <span className="font-bold">R$ 1,00</span> consumido em parceiros, você ganha <span className="font-bold">1 Loop</span>.
        </p>
      </div>

      {/* Transactions */}
      <div>
        <h3 className="text-lg font-bold text-brand-graphite dark:text-white mb-4">Extrato</h3>
        <div className="space-y-4">
          {transactions.map((tx, idx) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glassmorphism p-4 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5`}>
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-brand-graphite dark:text-white">{tx.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className={`font-bold ${getTransactionColor(tx.type)}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
