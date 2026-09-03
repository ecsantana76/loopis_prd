import React from 'react';
import type { OrderItem } from '../../types';
import { Utensils } from 'lucide-react';

interface OrderItemListProps {
  items: OrderItem[];
}

export const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => {
  return (
    <div className="bg-white dark:bg-brand-graphite rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-white/10">
        <h3 className="text-sm font-bold text-brand-graphite dark:text-white flex items-center space-x-2">
          <Utensils size={18} className="text-brand-violet" />
          <span>Itens Consumidos</span>
        </h3>
        <span className="text-xs text-gray-500 font-medium">
          {items.reduce((sum, item) => sum + item.quantity, 0)} itens no total
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/5">
        {items.map((item) => (
          <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-brand-violet bg-brand-violet/10 px-2 py-0.5 rounded-md shrink-0">
                  {item.quantity}x
                </span>
                <h4 className="text-sm font-semibold text-brand-graphite dark:text-white truncate">
                  {item.name}
                </h4>
              </div>
              {item.notes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic pl-7">
                  Obs: {item.notes}
                </p>
              )}
              {item.category && (
                <span className="text-[11px] text-gray-400 pl-7 block mt-0.5">
                  {item.category} • R$ {item.unitPrice.toFixed(2).replace('.', ',')} un.
                </span>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-brand-graphite dark:text-white">
                R$ {item.totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
