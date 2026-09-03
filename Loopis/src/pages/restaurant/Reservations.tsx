import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { Reservation } from '../../types';
import { XCircle, Check, MoreVertical, DollarSign } from 'lucide-react';
import { BillingModal } from '../../components/BillingModal';

export const Reservations: React.FC = () => {
  const { b2bReservations, updateB2bReservationStatus } = useStore();
  const [billingReservation, setBillingReservation] = useState<Reservation | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Novas Solicitações', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'confirmed': return { label: 'Aceitas', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'checked_in': return { label: 'No Salão (Check-in)', color: 'bg-brand-violet/10 text-brand-deep-purple border-brand-violet/20' };
      case 'completed': return { label: 'Concluídas', color: 'bg-green-100 text-green-800 border-green-200' };
      default: return { label: '', color: '' };
    }
  };

  const renderColumn = (status: string) => {
    const columnReservations = b2bReservations.filter(r => r.status === status);
    const config = getStatusConfig(status);

    return (
      <div className="flex flex-col bg-gray-50/50 dark:bg-white/5 rounded-2xl p-4 min-w-[300px] flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-700 dark:text-gray-300">{config.label}</h3>
          <span className="bg-white dark:bg-black/20 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {columnReservations.length}
          </span>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {columnReservations.map(res => (
            <div key={res.id} className={`bg-white dark:bg-brand-graphite rounded-xl p-4 border shadow-sm ${config.color} transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{res.clientName || 'Cliente Loopis'}</h4>
                  <p className="text-xs text-gray-500 font-mono">#{res.id}</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1.5 flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{res.time}</span>
                  <span className="text-[10px] text-gray-500">{res.guests} pax</span>
                </div>
              </div>

              {res.promotionSelected && (
                <div className="bg-brand-lilac/10 text-brand-violet text-xs font-semibold px-2 py-1 rounded-md inline-block mb-3">
                  Benefício Loopis Solicitado
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-2 pt-3 border-t border-gray-100 dark:border-white/5">
                {status === 'pending' && (
                  <>
                    <button onClick={() => updateB2bReservationStatus(res.id, 'completed')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <XCircle size={20} />
                    </button>
                    <button onClick={() => updateB2bReservationStatus(res.id, 'confirmed')} className="flex-1 bg-gradient-loopis text-white text-sm font-bold py-2 px-3 rounded-lg flex justify-center items-center space-x-1 shadow-sm hover:opacity-90">
                      <Check size={16} /> <span>Aceitar</span>
                    </button>
                  </>
                )}
                {status === 'confirmed' && (
                  <button onClick={() => updateB2bReservationStatus(res.id, 'checked_in')} className="w-full bg-brand-deep-purple text-white text-sm font-bold py-2 px-3 rounded-lg flex justify-center items-center shadow-sm hover:bg-opacity-90">
                    Confirmar Check-in
                  </button>
                )}
                {status === 'checked_in' && (
                  <button onClick={() => setBillingReservation(res)} className="w-full bg-green-500 text-white text-sm font-bold py-2 px-3 rounded-lg flex justify-center items-center space-x-1 shadow-sm hover:bg-green-600">
                    <DollarSign size={16} /> <span>Lançar Consumo</span>
                  </button>
                )}
                {status === 'completed' && (
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {columnReservations.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
              Nenhuma reserva
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-white">Gestão de Reservas</h1>
        <p className="text-sm text-gray-500">Acompanhe e gerencie o fluxo de clientes do aplicativo.</p>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex overflow-x-auto space-x-4 pb-4 scrollbar-hide mb-8">
        {renderColumn('pending')}
        {renderColumn('confirmed')}
        {renderColumn('checked_in')}
        {renderColumn('completed')}
      </div>

      {/* Últimos Clientes Atendidos */}
      <div>
        <h3 className="text-lg font-bold text-brand-graphite dark:text-white mb-4">Últimos Clientes Atendidos</h3>
        <div className="glassmorphism rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Data do Atendimento</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {b2bReservations
                .filter(r => r.status === 'completed')
                .slice(0, 5)
                .map(r => (
                  <tr key={r.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-graphite dark:text-white">{r.clientName || 'Cliente Loopis'}</td>
                    <td className="px-6 py-4 text-gray-500">{r.date} às {r.time}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Concluído</span>
                    </td>
                  </tr>
              ))}
              {b2bReservations.filter(r => r.status === 'completed').length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Nenhum atendimento concluído ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BillingModal 
        isOpen={!!billingReservation} 
        onClose={() => setBillingReservation(null)} 
        reservation={billingReservation} 
      />
    </div>
  );
};
