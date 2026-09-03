import React from 'react';
import { BarChart3, CalendarDays, CheckCircle, Clock, CreditCard, Receipt, Star, TrendingUp, Users, WalletCards } from 'lucide-react';
import { PartnerType } from '../../types';
import { usePartnerContext } from '../../hooks/usePartnerContext';
import { useStore } from '../../store/useStore';

const weeklyBars = [
  { label: 'Seg', value: 42 },
  { label: 'Ter', value: 58 },
  { label: 'Qua', value: 51 },
  { label: 'Qui', value: 74 },
  { label: 'Sex', value: 92 },
  { label: 'Sáb', value: 100 },
  { label: 'Dom', value: 68 },
];

const verticalCopy = {
  [PartnerType.RESTAURANT]: {
    salesLabel: 'Reservas confirmadas',
    agendaTitle: 'Próximas reservas',
    actionLabel: 'Check-ins pendentes',
    revenue: 'R$ 48.920',
    averageTicket: 'R$ 156',
  },
  [PartnerType.TOUR]: {
    salesLabel: 'Vagas vendidas',
    agendaTitle: 'Próximas saídas',
    actionLabel: 'Passageiros a confirmar',
    revenue: 'R$ 63.400',
    averageTicket: 'R$ 220',
  },
  [PartnerType.EVENT]: {
    salesLabel: 'Ingressos emitidos',
    agendaTitle: 'Próximos eventos',
    actionLabel: 'Validações de portaria',
    revenue: 'R$ 82.100',
    averageTicket: 'R$ 94',
  },
  [PartnerType.RENTAL]: {
    salesLabel: 'Slots reservados',
    agendaTitle: 'Próximas locações',
    actionLabel: 'Ativos livres hoje',
    revenue: 'R$ 27.760',
    averageTicket: 'R$ 118',
  },
};

export const PartnerOverview: React.FC = () => {
  const partner = usePartnerContext();
  const { b2bReservations, partnerActivities } = useStore();
  const copy = verticalCopy[partner.partnerType];
  const checkedIn = b2bReservations.filter((reservation) => reservation.status === 'checked_in').length;
  const confirmed = b2bReservations.filter((reservation) => reservation.status === 'confirmed').length;
  const completed = b2bReservations.filter((reservation) => reservation.status === 'completed').length;
  const maxBar = Math.max(...weeklyBars.map((item) => item.value));

  const metrics = [
    { label: 'GMV via Loopis', value: copy.revenue, icon: BarChart3, trend: '+22% vs. mês anterior' },
    { label: copy.salesLabel, value: String(326 + completed), icon: Receipt, trend: '+18% em 30 dias' },
    { label: 'Loops gerados', value: '18.430', icon: WalletCards, trend: 'R$ 4.608 em cashback' },
    { label: 'Ticket médio', value: copy.averageTicket, icon: TrendingUp, trend: '+9% por cliente' },
  ];

  const nextItems = b2bReservations.slice(0, 4).map((reservation) => ({
    title: reservation.clientName || 'Cliente Loopis',
    subtitle: `${reservation.date} às ${reservation.time}`,
    status: reservation.status,
    amount: `R$ ${Math.round(120 + reservation.guests * 44)}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-lilac">Visão Geral</p>
          <h2 className="mt-1 text-2xl font-black">{partner.partnerName}</h2>
          <p className="mt-1 text-sm text-gray-400">Resumo operacional, vendas, agenda e saúde da conta em {partner.neighborhood}.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-lg font-black">{confirmed}</p>
            <p className="text-[10px] text-gray-500">Confirmadas</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-lg font-black">{checkedIn}</p>
            <p className="text-[10px] text-gray-500">Check-ins</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-lg font-black">{completed}</p>
            <p className="text-[10px] text-gray-500">Concluídas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <Icon size={21} className="text-brand-lilac" />
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-black text-emerald-300">{metric.trend}</span>
              </div>
              <p className="mt-5 text-2xl font-black">{metric.value}</p>
              <p className="mt-1 text-xs text-gray-500">{metric.label}</p>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black">Movimento da semana</h3>
              <p className="mt-1 text-sm text-gray-500">Vendas, reservas e uso de Loops por dia.</p>
            </div>
            <span className="rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-black text-brand-lilac">Semanal</span>
          </div>
          <div className="mt-6 flex h-64 items-end gap-3 border-t border-white/10 pt-6">
            {weeklyBars.map((bar) => (
              <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex w-full max-w-12 flex-1 items-end rounded-t-2xl bg-black/25">
                  <div className="w-full rounded-t-2xl bg-brand-violet" style={{ height: `${(bar.value / maxBar) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-500">{bar.label}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-lg font-black"><CalendarDays size={19} className="text-brand-lilac" /> {copy.agendaTitle}</h3>
            <div className="mt-4 space-y-3">
              {nextItems.map((item) => (
                <div key={`${item.title}-${item.subtitle}`} className="rounded-2xl bg-black/25 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                    <span className="text-xs font-black text-brand-lilac">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-lg font-black">Saúde da operação</h3>
            <div className="mt-4 space-y-3">
              {[
                { icon: CheckCircle, label: 'Perfil publicado no app', value: 'Ativo' },
                { icon: CreditCard, label: 'Chave Pix de repasse', value: 'Validada' },
                { icon: Clock, label: copy.actionLabel, value: partner.partnerType === PartnerType.RENTAL ? '12' : '8' },
                { icon: Star, label: 'Avaliação média', value: '4,8' },
                { icon: Users, label: 'Clientes recorrentes', value: `${partnerActivities.length + 42}` },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-black/25 p-3">
                    <span className="flex items-center gap-2 text-sm text-gray-300"><Icon size={16} className="text-brand-lilac" /> {item.label}</span>
                    <strong className="text-sm">{item.value}</strong>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
