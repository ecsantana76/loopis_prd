import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, CheckCircle } from 'lucide-react';

export const Coupons: React.FC = () => {
  const activeCoupons = [
    { id: 1, title: '20% Off no Jantar', restaurant: 'Ostraria do Córrego', validUntil: 'Hoje', status: 'active', code: 'OSTRA20' },
    { id: 2, title: 'Sobremesa Grátis', restaurant: 'Bistro da Lagoa', validUntil: '3 dias', status: 'active', code: 'DOCELAGOA' },
  ];

  const expiredCoupons = [
    { id: 3, title: '10% de Cashback Extra', restaurant: 'Mercado Beira-Mar Grill', validUntil: 'Ontem', status: 'expired' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-brand-off-white">
          Meus Cupons
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie seus cupons e descontos salvos.</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-brand-graphite dark:text-white flex items-center space-x-2">
          <Ticket size={20} className="text-brand-violet" />
          <span>Ativos ({activeCoupons.length})</span>
        </h2>
        
        {activeCoupons.map(coupon => (
          <motion.div 
            key={coupon.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-[#1a1a1c] border border-brand-violet/20 rounded-2xl p-4 flex items-center shadow-sm relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-violet" />
            <div className="flex-1 pl-4 border-r border-dashed border-gray-200 dark:border-white/10 pr-4">
              <h3 className="text-lg font-bold text-brand-deep-purple dark:text-brand-lilac">{coupon.title}</h3>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{coupon.restaurant}</p>
              <div className="flex items-center space-x-1 mt-2 text-xs font-semibold text-brand-violet">
                <Clock size={12} />
                <span>Expira em: {coupon.validUntil}</span>
              </div>
            </div>
            <div className="pl-4 flex flex-col items-center justify-center min-w-[80px]">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Código</span>
              <span className="font-mono font-bold text-brand-graphite dark:text-white">{coupon.code}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/5">
        <h2 className="font-bold text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <CheckCircle size={20} />
          <span>Utilizados / Expirados</span>
        </h2>
        
        {expiredCoupons.map(coupon => (
          <div 
            key={coupon.id}
            className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex items-center opacity-70"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 line-through">{coupon.title}</h3>
              <p className="text-sm text-gray-500">{coupon.restaurant}</p>
            </div>
            <div className="text-xs font-semibold text-gray-400">
              {coupon.validUntil}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
