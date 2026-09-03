import React, { useMemo, useState } from 'react';
import { CalendarDays, Clock, CreditCard, Eye, ReceiptText, Search, Sparkles, Users, X } from 'lucide-react';
import { PartnerType } from '../../types';
import { usePartnerContext } from '../../hooks/usePartnerContext';
import { useStore } from '../../store/useStore';
import type { ComandaRecord, Reservation } from '../../types';

type ParticipationStatus = 'confirmado' | 'compareceu' | 'pago' | 'pendente';

interface ClientHistoryItem {
  id: string;
  name: string;
  phone: string;
  lastParticipation: string;
  journey: string;
  status: ParticipationStatus;
  totalSpent: number;
  loopsGenerated: number;
  visits: number;
  reservations?: Reservation[];
  bills?: ComandaRecord[];
}

const statusClass: Record<ParticipationStatus, string> = {
  confirmado: 'bg-brand-violet/15 text-brand-lilac',
  compareceu: 'bg-emerald-500/15 text-emerald-300',
  pago: 'bg-sky-500/15 text-sky-300',
  pendente: 'bg-yellow-500/15 text-yellow-300',
};

const fallbackComanda = (reservation: Reservation, index = 0): ComandaRecord => {
  const subtotal = 48 + (76 + 29) * reservation.guests + index * 18;
  const taxaServico = Math.round(subtotal * 0.1 * 100) / 100;
  const descontoLoops = reservation.promotionSelected ? 25 : 0;

  return {
    id: `hist-${reservation.id}-${index}`,
    comandaCode: `COM-${reservation.id.toUpperCase()}`,
    clienteNome: reservation.clientName || 'Cliente Loopis',
    clienteTelefone: reservation.clientPhone,
    mesaOuReferencia: `Mesa para ${reservation.guests}`,
    data: reservation.date,
    horario: reservation.time,
    itens: [
      { id: `${reservation.id}-entrada`, nome: index % 2 === 0 ? 'Ostras gratinadas' : 'Bolinho de siri', precoUnitario: 48, quantidade: 1 },
      { id: `${reservation.id}-principal`, nome: index % 2 === 0 ? 'Sequência de camarão' : 'Peixe do dia', precoUnitario: 76, quantidade: reservation.guests },
      { id: `${reservation.id}-bebida`, nome: 'Bebidas da mesa', precoUnitario: 29, quantidade: reservation.guests },
    ],
    subtotal,
    taxaServico,
    descontoLoops,
    total: subtotal + taxaServico - descontoLoops,
    status: reservation.status === 'completed' ? 'paga' : 'aguardando_pagamento',
    formaPagamento: reservation.status === 'completed' ? 'pix' : 'split',
    origemEmissao: 'restaurante',
  };
};

const syntheticPastReservations = (reservation: Reservation, count: number): Reservation[] =>
  Array.from({ length: count }).map((_, index) => ({
    ...reservation,
    id: `${reservation.id}-past-${index + 1}`,
    date: `2026-0${Math.max(5, 8 - index)}-${String(14 + index).padStart(2, '0')}`,
    time: index % 2 === 0 ? '20:00' : '19:30',
    status: 'completed',
    promotionSelected: index % 2 === 0,
  }));

export const PartnerClientsView: React.FC = () => {
  const partner = usePartnerContext();
  const { b2bReservations, partnerActivities } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | ParticipationStatus>('todos');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const verticalClients = useMemo<ClientHistoryItem[]>(() => {
    if (partner.partnerType === PartnerType.RESTAURANT) {
      const grouped = b2bReservations.reduce<Record<string, Reservation[]>>((acc, reservation) => {
        const key = `${reservation.clientPhone || reservation.clientName || reservation.id}`.toLowerCase();
        acc[key] = [...(acc[key] || []), reservation];
        return acc;
      }, {});

      return Object.entries(grouped).map(([key, reservations], index) => {
        const latestReservation = reservations[0];
        const visitsCount = Math.max(reservations.length, 1 + (index % 4));
        const allReservations = [
          ...reservations,
          ...syntheticPastReservations(latestReservation, Math.max(0, visitsCount - reservations.length)),
        ];
        const bills = allReservations.map((reservation, billIndex) => (
          partnerActivities.find((item) => item.reservaId === reservation.id)?.comanda || fallbackComanda(reservation, billIndex)
        ));
        const totalSpent = bills.reduce((sum, bill) => sum + bill.total, 0);
        const loopsGenerated = Math.floor(totalSpent * 0.18);
        const status =
          latestReservation.status === 'checked_in'
            ? 'compareceu'
            : latestReservation.status === 'completed'
              ? 'pago'
              : latestReservation.status === 'confirmed'
                ? 'confirmado'
                : 'pendente';

        return {
          id: key,
          name: latestReservation.clientName || 'Cliente Loopis',
          phone: latestReservation.clientPhone || 'Telefone não informado',
          lastParticipation: `${latestReservation.date} às ${latestReservation.time}`,
          journey: `${allReservations.length} visitas registradas • última reserva para ${latestReservation.guests} pessoas`,
          status,
          totalSpent,
          loopsGenerated,
          visits: allReservations.length,
          reservations: allReservations,
          bills,
        } satisfies ClientHistoryItem;
      });
    }

    const byVertical = {
      [PartnerType.TOUR]: [
        ['Marina Costa', '(48) 98888-1001', 'Passeio de lancha • Costa da Lagoa', 'compareceu', 480, 480, 3],
        ['Lucas Andrade', '(48) 98888-1002', 'Sunset Baía Norte • 2 passageiros', 'confirmado', 360, 360, 1],
        ['Beatriz Ramos', '(48) 98888-1003', 'Trilha guiada Lagoinha do Leste', 'pago', 220, 220, 2],
      ],
      [PartnerType.EVENT]: [
        ['Julia Martins', '(48) 97777-2001', 'Floripa Sunset • Camarote VIP', 'pago', 520, 520, 4],
        ['Rafael Nunes', '(48) 97777-2002', 'Jazz & Wine • Pista', 'confirmado', 160, 160, 1],
        ['Camila Rocha', '(48) 97777-2003', 'Lista promoter • 2 ingressos', 'pendente', 180, 0, 2],
      ],
      [PartnerType.RENTAL]: [
        ['Felipe Souza', '(48) 96666-3001', 'Quadra Beach Tennis 01 • 2h', 'pago', 180, 180, 5],
        ['Amanda Leal', '(48) 96666-3002', 'Jet-ski Jurerê 300HP • 1h', 'confirmado', 220, 220, 1],
        ['Thiago Melo', '(48) 96666-3003', 'Stand Up Paddle • manhã', 'compareceu', 90, 90, 3],
      ],
      [PartnerType.RESTAURANT]: [],
    } as const;

    return byVertical[partner.partnerType].map(([name, phone, journey, status, totalSpent, loopsGenerated, visits], index) => ({
      id: `${partner.partnerType}-client-${index}`,
      name,
      phone,
      lastParticipation: index === 0 ? '2026-08-20 às 14:00' : `2026-08-${18 + index} às ${10 + index}:00`,
      journey,
      status: status as ParticipationStatus,
      totalSpent: Number(totalSpent),
      loopsGenerated: Number(loopsGenerated),
      visits: Number(visits),
    }));
  }, [b2bReservations, partner.partnerType, partnerActivities]);

  const filteredClients = verticalClients.filter((client) => {
    const normalized = query.trim().toLowerCase();
    const matchesQuery = !normalized || client.name.toLowerCase().includes(normalized) || client.phone.toLowerCase().includes(normalized) || client.journey.toLowerCase().includes(normalized);
    const matchesStatus = statusFilter === 'todos' || client.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totals = filteredClients.reduce(
    (acc, client) => ({
      spent: acc.spent + client.totalSpent,
      loops: acc.loops + client.loopsGenerated,
      visits: acc.visits + client.visits,
    }),
    { spent: 0, loops: 0, visits: 0 },
  );
  const selectedClient = verticalClients.find((client) => client.id === selectedClientId) || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black">Clientes</h2>
          <p className="mt-1 text-sm text-gray-400">Histórico de clientes, participações, consumo, Loops gerados e status dentro da sua operação.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-gray-300">
            <Search size={16} className="text-brand-lilac" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente ou experiência" className="bg-transparent text-white outline-none placeholder:text-gray-500" />
          </label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-bold text-white outline-none">
            <option value="todos">Todos os status</option>
            <option value="confirmado">Confirmado</option>
            <option value="compareceu">Compareceu</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: Users, label: 'Clientes encontrados', value: filteredClients.length },
          { icon: CreditCard, label: 'Consumo total', value: `R$ ${totals.spent.toFixed(0)}` },
          { icon: Sparkles, label: 'Loops gerados', value: totals.loops },
          { icon: CalendarDays, label: 'Participações', value: totals.visits },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <Icon size={21} className="text-brand-lilac" />
              <p className="mt-4 text-2xl font-black">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.label}</p>
            </article>
          );
        })}
      </div>

      <section>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="grid grid-cols-1 divide-y divide-white/10">
            {filteredClients.map((client) => (
            <article
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`grid cursor-pointer grid-cols-1 gap-4 p-5 transition lg:grid-cols-[minmax(0,1fr)_180px_180px_150px] lg:items-center ${
                selectedClient?.id === client.id ? 'bg-brand-violet/10' : 'hover:bg-white/[0.03]'
              }`}
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-violet text-sm font-black text-white">
                    {client.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black">{client.name}</h3>
                    <p className="text-xs text-gray-500">{client.phone}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-300">{client.journey}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-bold text-gray-400"><Clock size={14} /> Última participação</p>
                <p className="mt-1 text-sm font-black">{client.lastParticipation}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-[10px] text-gray-500">Consumo</p>
                  <p className="mt-1 font-black">R$ {client.totalSpent.toFixed(0)}</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-[10px] text-gray-500">Loops</p>
                  <p className="mt-1 font-black">{client.loopsGenerated}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusClass[client.status]}`}>{client.status}</span>
                <Eye size={18} className="text-brand-lilac" />
              </div>
            </article>
            ))}
            {filteredClients.length === 0 && <div className="p-10 text-center text-sm text-gray-500">Nenhum cliente encontrado para os filtros selecionados.</div>}
          </div>
        </div>

        {selectedClient && (
          <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
            <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-4xl sm:rounded-3xl sm:p-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Detalhes do cliente</p>
                    <h3 className="mt-2 truncate text-2xl font-black">{selectedClient.name}</h3>
                    <p className="mt-1 text-sm text-gray-400">{selectedClient.phone}</p>
                    <p className="mt-2 text-sm text-gray-300">{selectedClient.journey}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedClientId(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gray-300 transition hover:bg-white/15 hover:text-white" aria-label="Fechar detalhes do cliente">
                    <X size={18} />
                  </button>
                </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-[10px] text-gray-500">Visitas</p>
                  <p className="mt-1 text-xl font-black">{selectedClient.visits}</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-[10px] text-gray-500">Consumo</p>
                  <p className="mt-1 text-xl font-black">R$ {selectedClient.totalSpent.toFixed(0)}</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-3">
                  <p className="text-[10px] text-gray-500">Loops</p>
                  <p className="mt-1 text-xl font-black">{selectedClient.loopsGenerated}</p>
                </div>
              </div>

              <section className="rounded-2xl bg-black/25 p-4">
                <h4 className="flex items-center gap-2 text-sm font-black"><CalendarDays size={16} /> Todas as visitas</h4>
                <div className="mt-4 space-y-3">
                  {(selectedClient.reservations || []).map((reservation) => (
                    <div key={reservation.id} className="rounded-2xl border border-white/10 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black">{reservation.date} às {reservation.time}</p>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${reservation.status === 'completed' ? 'bg-sky-500/15 text-sky-300' : reservation.status === 'checked_in' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300'}`}>
                          {reservation.status === 'completed' ? 'pago' : reservation.status === 'checked_in' ? 'check-in' : reservation.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{reservation.guests} pessoas • {reservation.promotionSelected ? 'usou benefício/Loops' : 'sem benefício aplicado'}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-black/25 p-4">
                <h4 className="flex items-center gap-2 text-sm font-black"><ReceiptText size={16} /> Contas e consumo por dia</h4>
                <div className="mt-4 space-y-4">
                  {(selectedClient.bills || []).map((bill) => (
                    <details key={bill.id} className="rounded-2xl border border-white/10 p-3 open:bg-white/[0.03]">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-black">{bill.data} • {bill.comandaCode}</p>
                            <p className="mt-1 text-xs text-gray-500">{bill.mesaOuReferencia} • {bill.formaPagamento || 'pagamento pendente'}</p>
                          </div>
                          <p className="text-sm font-black text-brand-lilac">R$ {bill.total.toFixed(2).replace('.', ',')}</p>
                        </div>
                      </summary>
                      <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                        {bill.itens.map((item) => (
                          <div key={item.id} className="flex justify-between gap-3 text-xs">
                            <span className="text-gray-300">{item.quantidade}x {item.nome}</span>
                            <span className="font-bold">R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))}
                        <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs">
                          <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>R$ {bill.subtotal.toFixed(2).replace('.', ',')}</span></div>
                          <div className="flex justify-between text-gray-400"><span>Serviço</span><span>R$ {bill.taxaServico.toFixed(2).replace('.', ',')}</span></div>
                          <div className="flex justify-between text-emerald-300"><span>Loops/benefício</span><span>- R$ {bill.descontoLoops.toFixed(2).replace('.', ',')}</span></div>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
};
