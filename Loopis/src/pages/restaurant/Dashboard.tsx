import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, CalendarCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';

import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { b2bReservations } = useStore();
  const navigate = useNavigate();
  
  // Mock data for the chart
  const data = [
    { name: 'Seg', reservas: 4 },
    { name: 'Ter', reservas: 12 },
    { name: 'Qua', reservas: 18 },
    { name: 'Qui', reservas: 25 },
    { name: 'Sex', reservas: 42 },
    { name: 'Sáb', reservas: 48 },
    { name: 'Dom', reservas: 30 },
  ];

  const totalReservas = b2bReservations.length;
  const totalCheckins = b2bReservations.filter(r => r.status === 'checked_in' || r.status === 'completed').length;

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-white">Dashboard do Restaurante</h1>
        <p className="text-sm text-gray-500">Hub inicial para gestão do seu parceiro Loopis.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button onClick={() => navigate('/restaurante/lancamento')} className="flex items-center space-x-3 bg-white dark:bg-[#1a1a1c] p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-brand-violet dark:hover:border-brand-violet transition-all group shadow-sm hover:shadow-md text-left cursor-pointer">
          <div className="w-12 h-12 bg-brand-violet/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <DollarSign size={24} className="text-brand-violet" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-brand-graphite dark:text-white">Lançar Comanda</h3>
            <p className="text-xs text-gray-500">QR Code e Consumo</p>
          </div>
        </button>
        <button onClick={() => navigate('/restaurante/atividades')} className="flex items-center space-x-3 bg-white dark:bg-[#1a1a1c] p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-brand-violet dark:hover:border-brand-violet transition-all group shadow-sm hover:shadow-md text-left cursor-pointer">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Users size={24} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-brand-graphite dark:text-white">Atividades & Histórico</h3>
            <p className="text-xs text-gray-500">Presença e Comandas</p>
          </div>
        </button>
        <button onClick={() => navigate('/restaurante/ler-cupom')} className="flex items-center space-x-3 bg-white dark:bg-[#1a1a1c] p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-brand-violet dark:hover:border-brand-violet transition-all group shadow-sm hover:shadow-md text-left cursor-pointer">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <CalendarCheck size={24} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-brand-graphite dark:text-white">Ler Cupom Fiscal</h3>
            <p className="text-xs text-gray-500">Escaneamento com IA</p>
          </div>
        </button>
        <button onClick={() => navigate('/restaurante/campanhas')} className="flex items-center space-x-3 bg-white dark:bg-[#1a1a1c] p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-brand-violet dark:hover:border-brand-violet transition-all group shadow-sm hover:shadow-md text-left cursor-pointer">
          <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <TrendingUp size={24} className="text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-brand-graphite dark:text-white">Gerir Ofertas</h3>
            <p className="text-xs text-gray-500">Campanhas & Cashback</p>
          </div>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glassmorphism p-5 rounded-2xl border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-brand-violet/10 rounded-lg text-brand-violet"><CalendarCheck size={20} /></div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Reservas</span>
          </div>
          <p className="text-2xl font-bold text-brand-graphite dark:text-white">{totalReservas + 45}</p>
          <p className="text-xs text-green-500 font-medium mt-1 flex items-center"><TrendingUp size={12} className="mr-1"/> +12% esta semana</p>
        </div>

        <div className="glassmorphism p-5 rounded-2xl border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Users size={20} /></div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Check-ins (Mês)</span>
          </div>
          <p className="text-2xl font-bold text-brand-graphite dark:text-white">{totalCheckins + 120}</p>
        </div>

        <div className="glassmorphism p-5 rounded-2xl border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><DollarSign size={20} /></div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Ticket Médio</span>
          </div>
          <p className="text-2xl font-bold text-brand-graphite dark:text-white">R$ 145,00</p>
        </div>

        <div className="glassmorphism p-5 rounded-2xl border border-white/20 bg-gradient-to-br from-brand-deep-purple to-brand-violet text-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg"><TrendingUp size={20} /></div>
            <span className="text-sm font-semibold opacity-90">Receita via Loopis</span>
          </div>
          <p className="text-2xl font-bold">R$ 17.400,00</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glassmorphism p-6 rounded-3xl mb-8">
        <h3 className="text-lg font-bold text-brand-graphite dark:text-white mb-6">Fluxo de Reservas na Semana</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReservas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255,255,255,0.9)' }}
                labelStyle={{ fontWeight: 'bold', color: '#3D1E6D' }}
              />
              <Area type="monotone" dataKey="reservas" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorReservas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div>
        <h3 className="text-lg font-bold text-brand-graphite dark:text-white mb-4">Últimos Fechamentos</h3>
        <div className="glassmorphism rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Consumo Total</th>
                <th className="px-6 py-4 font-semibold">Comissão Loopis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-graphite dark:text-white">Carlos Souza</td>
                <td className="px-6 py-4 text-gray-500">Hoje, 19:45</td>
                <td className="px-6 py-4 font-semibold">R$ 250,00</td>
                <td className="px-6 py-4 text-gray-500">R$ 25,00</td>
              </tr>
              <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-graphite dark:text-white">Maria Oliveira</td>
                <td className="px-6 py-4 text-gray-500">Ontem, 21:10</td>
                <td className="px-6 py-4 font-semibold">R$ 180,00</td>
                <td className="px-6 py-4 text-gray-500">R$ 18,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
