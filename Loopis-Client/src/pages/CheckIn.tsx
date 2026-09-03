import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CalendarClock,
  CheckCircle2,
  MapPin,
  QrCode,
  Receipt,
  Sparkles,
  Star,
  Ticket,
  Utensils,
  WalletCards,
  Waves,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReceiptScannerModal } from '../components/ReceiptScannerModal';
import { useStore } from '../store/useStore';
import { PartnerType, type ClientBooking } from '../types';

type BookingFilter = 'upcoming' | 'active' | 'completed' | 'all';

const verticalMeta = {
  [PartnerType.RESTAURANT]: { label: 'Restaurante', icon: Utensils, badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-300' },
  [PartnerType.TOUR]: { label: 'Tour & Aventura', icon: Waves, badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300' },
  [PartnerType.EVENT]: { label: 'Evento & Festa', icon: Ticket, badge: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300' },
  [PartnerType.RENTAL]: { label: 'Locação', icon: CalendarClock, badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
};

const statusMeta = {
  confirmed: { label: 'Confirmada', className: 'bg-brand-violet/10 text-brand-violet dark:text-brand-lilac' },
  checked_in: { label: 'Em andamento', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
  completed: { label: 'Concluída', className: 'bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300' },
  cancelled: { label: 'Cancelada', className: 'bg-red-500/10 text-red-600 dark:text-red-300' },
};

const paymentLabels = {
  paid: 'Pago no app',
  pay_at_venue: 'Pagamento no local',
  awaiting_payment: 'Aguardando pagamento',
};

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal, clientBookings, updateClientBookingStatus } = useStore();
  const [filter, setFilter] = useState<BookingFilter>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<ClientBooking | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const counts = useMemo(() => ({
    upcoming: clientBookings.filter((booking) => booking.status === 'confirmed').length,
    active: clientBookings.filter((booking) => booking.status === 'checked_in').length,
    completed: clientBookings.filter((booking) => booking.status === 'completed').length,
  }), [clientBookings]);

  const filteredBookings = useMemo(() => {
    const result = clientBookings.filter((booking) => {
      if (filter === 'all') return true;
      if (filter === 'upcoming') return booking.status === 'confirmed';
      if (filter === 'active') return booking.status === 'checked_in';
      return booking.status === 'completed';
    });
    return result.sort((a, b) => filter === 'completed' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [clientBookings, filter]);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-violet/10">
          <Calendar size={36} className="text-brand-violet" />
        </div>
        <h1 className="mt-6 text-2xl font-black text-brand-graphite dark:text-white">Entre para ver suas reservas</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">Seus ingressos, tours, mesas, locações, vouchers e histórico ficam organizados em um único lugar.</p>
        <button type="button" onClick={openLoginModal} className="mt-6 rounded-2xl bg-brand-violet px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-violet/20">Entrar no app</button>
      </div>
    );
  }

  const handlePrimaryAction = (booking: ClientBooking) => {
    if (booking.status === 'completed') {
      if (booking.reviewNotificationId) navigate(`/avaliar/${booking.reviewNotificationId}`);
      else navigate('/notificacoes');
      return;
    }
    if (booking.partnerType === PartnerType.RESTAURANT) {
      if (booking.status === 'confirmed') updateClientBookingStatus(booking.id, 'checked_in');
      else setIsReceiptModalOpen(true);
      return;
    }
    setSelectedBooking(booking);
  };

  const actionLabel = (booking: ClientBooking) => {
    if (booking.status === 'completed') return booking.reviewNotificationId ? 'Avaliar experiência' : 'Ver histórico';
    if (booking.partnerType === PartnerType.RESTAURANT) return booking.status === 'checked_in' ? 'Abrir comanda' : 'Fazer check-in';
    return 'Ver voucher';
  };

  return (
    <div className="mx-auto max-w-6xl pb-24">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-violet">Sua agenda Loopis</p>
          <h1 className="mt-1 text-3xl font-black text-brand-graphite dark:text-white">Minhas Reservas & Compras</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Mesas, eventos, tours e locações reunidos com vouchers, pagamentos e histórico.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Próximas', counts.upcoming],
            ['Agora', counts.active],
            ['Concluídas', counts.completed],
          ].map(([label, value]) => (
            <div key={label} className="min-w-24 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xl font-black text-brand-graphite dark:text-white">{value}</p>
              <p className="text-[10px] font-bold text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {counts.active > 0 && (
        <section className="mt-6 overflow-hidden rounded-3xl border border-emerald-500/25 bg-emerald-500/5">
          {clientBookings.filter((booking) => booking.status === 'checked_in').map((booking) => (
            <div key={booking.id} className="grid gap-4 p-5 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center">
              <img src={booking.imageUrl} alt={booking.partnerName} className="h-24 w-full rounded-2xl object-cover sm:w-24" />
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300"><Sparkles size={12} /> Experiência em andamento</span>
                <h2 className="mt-2 truncate text-lg font-black text-brand-graphite dark:text-white">{booking.partnerName}</h2>
                <p className="mt-1 text-sm text-gray-500">{booking.productName} • {booking.time}</p>
              </div>
              <button type="button" onClick={() => handlePrimaryAction(booking)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white"><Receipt size={16} /> Abrir comanda</button>
            </div>
          ))}
        </section>
      )}

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {([
          ['upcoming', `Próximas (${counts.upcoming})`],
          ['active', `Em andamento (${counts.active})`],
          ['completed', `Histórico (${counts.completed})`],
          ['all', `Todas (${clientBookings.length})`],
        ] as Array<[BookingFilter, string]>).map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-black transition ${filter === value ? 'bg-brand-violet text-white shadow-md shadow-brand-violet/20' : 'border border-gray-200 bg-white text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400'}`}>{label}</button>
        ))}
      </div>

      <section className="mt-3 grid gap-4 lg:grid-cols-2">
        {filteredBookings.map((booking) => {
          const meta = verticalMeta[booking.partnerType];
          const VerticalIcon = meta.icon;
          return (
            <article key={booking.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1f]">
              <div className="grid grid-cols-[108px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[132px_minmax(0,1fr)]">
                <img src={booking.imageUrl} alt={booking.productName} className="h-full min-h-36 w-full rounded-2xl object-cover" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${meta.badge}`}><VerticalIcon size={12} /> {meta.label}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusMeta[booking.status].className}`}>{statusMeta[booking.status].label}</span>
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-base font-black leading-tight text-brand-graphite dark:text-white">{booking.productName}</h2>
                  <p className="mt-1 truncate text-xs font-bold text-gray-500">{booking.partnerName}</p>
                  <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2"><Calendar size={13} className="text-brand-violet" /> {formatDate(booking.date)} às {booking.time}</p>
                    <p className="flex items-center gap-2"><MapPin size={13} className="text-brand-violet" /> <span className="truncate">{booking.neighborhood}</span></p>
                    <p className="flex items-center gap-2"><Ticket size={13} className="text-brand-violet" /> {booking.quantity} {booking.quantityLabel}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 p-4 dark:border-white/10 sm:grid-cols-[1fr_auto_auto]">
                <div className="col-span-2 min-w-0 sm:col-span-1">
                  <p className="text-[10px] font-bold uppercase text-gray-400">{paymentLabels[booking.paymentStatus]}</p>
                  <p className="mt-1 text-sm font-black text-brand-graphite dark:text-white">{booking.total > 0 ? formatCurrency(booking.total) : 'Consumo após a visita'}</p>
                </div>
                <button type="button" onClick={() => setSelectedBooking(booking)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 dark:border-white/10 dark:text-gray-300">Detalhes</button>
                <button type="button" onClick={() => handlePrimaryAction(booking)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-violet px-3 py-2 text-xs font-black text-white">{actionLabel(booking)} <ArrowRight size={13} /></button>
              </div>
            </article>
          );
        })}
      </section>

      {filteredBookings.length === 0 && (
        <div className="mt-4 rounded-3xl border border-dashed border-gray-300 p-10 text-center dark:border-white/10">
          <Calendar size={30} className="mx-auto text-gray-400" />
          <h2 className="mt-3 text-lg font-black text-brand-graphite dark:text-white">Nada neste filtro</h2>
          <button type="button" onClick={() => setFilter('all')} className="mt-4 text-sm font-black text-brand-violet">Ver todas as reservas</button>
        </div>
      )}

      {selectedBooking && (
        <div className="app-modal-backdrop fixed inset-0 z-[70] flex items-end justify-center overflow-hidden bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section className="app-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl dark:bg-[#1a1a1f] sm:max-w-lg sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-violet">Detalhes da reserva</p>
                <h2 className="mt-1 text-xl font-black text-brand-graphite dark:text-white">{selectedBooking.productName}</h2>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)} className="rounded-xl bg-gray-100 p-2 text-gray-500 dark:bg-white/10 dark:text-gray-300" aria-label="Fechar detalhes"><X size={17} /></button>
            </div>

            {selectedBooking.voucherCode && (
              <div className="mt-5 rounded-3xl bg-brand-violet/8 p-5 text-center">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-white text-brand-violet shadow-sm"><QrCode size={88} /></div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Voucher Loopis</p>
                <p className="mt-1 font-mono text-sm font-black text-brand-violet">{selectedBooking.voucherCode}</p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5"><p className="text-[10px] font-bold uppercase text-gray-400">Data e horário</p><p className="mt-1 font-black dark:text-white">{formatDate(selectedBooking.date)}<br />{selectedBooking.time}</p></div>
              <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5"><p className="text-[10px] font-bold uppercase text-gray-400">Participantes</p><p className="mt-1 font-black dark:text-white">{selectedBooking.quantity} {selectedBooking.quantityLabel}</p></div>
              <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5"><p className="text-[10px] font-bold uppercase text-gray-400">Loops usados</p><p className="mt-1 font-black text-brand-violet">{selectedBooking.loopsUsed}</p></div>
              <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5"><p className="text-[10px] font-bold uppercase text-gray-400">Loops recebidos</p><p className="mt-1 font-black text-emerald-600">+{selectedBooking.loopsEarned}</p></div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-200 p-4 dark:border-white/10">
              <span className="flex items-center gap-2 text-sm font-bold text-gray-500"><WalletCards size={16} /> Total</span>
              <span className="text-lg font-black text-brand-graphite dark:text-white">{selectedBooking.total > 0 ? formatCurrency(selectedBooking.total) : 'No local'}</span>
            </div>

            <button type="button" onClick={() => { const booking = selectedBooking; setSelectedBooking(null); handlePrimaryAction(booking); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-violet py-3.5 text-sm font-black text-white">
              {selectedBooking.status === 'completed' ? <Star size={17} /> : selectedBooking.partnerType === PartnerType.RESTAURANT ? <Receipt size={17} /> : <CheckCircle2 size={17} />}
              {actionLabel(selectedBooking)}
            </button>
          </section>
        </div>
      )}

      <ReceiptScannerModal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} />
    </div>
  );
};
