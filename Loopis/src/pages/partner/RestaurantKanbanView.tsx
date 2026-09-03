import React, { useMemo, useState } from 'react';
import { CalendarDays, Camera, Check, CreditCard, Eye, Minus, Plus, QrCode, ReceiptText, RefreshCw, ScanLine, Send, Upload, UsersRound, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { ComandaRecord, PartnerActivityRecord, Reservation, ReservationStatus } from '../../types';

const statusColumns: Array<{ status: ReservationStatus; title: string }> = [
  { status: 'pending', title: 'Solicitações' },
  { status: 'confirmed', title: 'Confirmadas' },
  { status: 'checked_in', title: 'Check-in feito' },
  { status: 'completed', title: 'Conta/Pagamento' },
];

const statusLabel: Record<ReservationStatus, string> = {
  pending: 'Aguardando confirmação',
  confirmed: 'Reserva confirmada',
  checked_in: 'Cliente no salão',
  completed: 'Conta encerrada',
  no_show: 'No-show',
  cancelled: 'Cancelada',
};

type PeriodFilter = 'today' | 'tomorrow' | 'next_7_days' | 'all' | 'custom';
type PaymentMode = 'full' | 'split';

type SplitUser = {
  id: string;
  name: string;
  phone: string;
  loopsBalance: number;
};

type PixCharge = {
  id: string;
  label: string;
  amount: number;
  payload: string;
  paymentLink: string;
  assignedUser?: SplitUser;
  loopsToEarn: number;
};

const mockSplitUsers: SplitUser[] = [
  { id: 'user-ana', name: 'Ana Souza', phone: '(48) 99182-4401', loopsBalance: 1280 },
  { id: 'user-carlos', name: 'Carlos Mendes', phone: '(48) 98814-2077', loopsBalance: 640 },
  { id: 'user-marina', name: 'Marina Costa', phone: '(48) 99632-1180', loopsBalance: 2150 },
  { id: 'user-felipe', name: 'Felipe Andrade', phone: '(48) 98420-7351', loopsBalance: 390 },
];

const toDateInputValue = (date: Date) => date.toISOString().split('T')[0];

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const fallbackComanda = (reservation: Reservation): ComandaRecord => {
  const subtotal = 42 + (89 + 24) * reservation.guests;
  const taxaServico = Math.round(subtotal * 0.1 * 100) / 100;
  const descontoLoops = 0;

  return {
    id: `cmd-${reservation.id}`,
    comandaCode: `COM-${reservation.id.toUpperCase()}`,
    clienteNome: reservation.clientName || 'Cliente Loopis',
    clienteTelefone: reservation.clientPhone,
    mesaOuReferencia: `Mesa para ${reservation.guests}`,
    data: reservation.date,
    horario: reservation.time,
    itens: [
      { id: 'item-1', nome: 'Entrada compartilhada', precoUnitario: 42, quantidade: 1 },
      { id: 'item-2', nome: 'Prato principal', precoUnitario: 89, quantidade: reservation.guests },
      { id: 'item-3', nome: 'Bebidas', precoUnitario: 24, quantidade: reservation.guests },
    ],
    subtotal,
    taxaServico,
    descontoLoops,
    total: subtotal + taxaServico - descontoLoops,
    status: 'aguardando_pagamento',
    formaPagamento: 'pix',
    origemEmissao: 'restaurante',
  };
};

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

const splitAmountInCents = (total: number, parts: number) => {
  const totalInCents = Math.round(total * 100);
  const baseAmount = Math.floor(totalInCents / parts);
  const remainder = totalInCents % parts;

  return Array.from({ length: parts }, (_, index) => (baseAmount + (index < remainder ? 1 : 0)) / 100);
};

const pixPayload = (comanda: ComandaRecord, amount: number, reference: string) =>
  `00020126580014br.gov.bcb.pix0136loopis-${comanda.id}-${reference}520400005303986540${amount.toFixed(2)}5802BR5925${comanda.clienteNome.slice(0, 25)}6009Floripa62170513${comanda.comandaCode}6304ABCD`;

export const RestaurantKanbanView: React.FC = () => {
  const { b2bReservations, updateB2bReservationStatus, partnerActivities, addComanda, processBilling } = useStore();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(b2bReservations[0] || null);
  const [generatedPix, setGeneratedPix] = useState<PixCharge[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('full');
  const [splitParts, setSplitParts] = useState(2);
  const [splitAssignments, setSplitAssignments] = useState<Record<number, string>>({});
  const [launchedComandas, setLaunchedComandas] = useState<Record<string, ComandaRecord>>({});
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [launchMode, setLaunchMode] = useState<'qr' | 'photo'>('qr');
  const [launchStep, setLaunchStep] = useState<'idle' | 'reading' | 'review'>('idle');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [scannedComanda, setScannedComanda] = useState<ComandaRecord | null>(null);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filteredReservations = useMemo(() => {
    const today = new Date();
    const todayValue = toDateInputValue(today);
    const tomorrowValue = toDateInputValue(addDays(today, 1));
    const nextSevenDaysValue = toDateInputValue(addDays(today, 7));

    return b2bReservations.filter((reservation) => {
      if (periodFilter === 'all') return true;
      if (periodFilter === 'today') return reservation.date === todayValue;
      if (periodFilter === 'tomorrow') return reservation.date === tomorrowValue;
      if (periodFilter === 'next_7_days') return reservation.date >= todayValue && reservation.date <= nextSevenDaysValue;
      if (!customStartDate && !customEndDate) return true;
      if (customStartDate && reservation.date < customStartDate) return false;
      if (customEndDate && reservation.date > customEndDate) return false;
      return true;
    });
  }, [b2bReservations, customEndDate, customStartDate, periodFilter]);

  const selectedActivity = useMemo<PartnerActivityRecord | undefined>(
    () => partnerActivities.find((activity) => activity.reservaId === selectedReservation?.id),
    [partnerActivities, selectedReservation?.id],
  );
  const selectedComanda = selectedReservation
    ? launchedComandas[selectedReservation.id] || selectedActivity?.comanda || fallbackComanda(selectedReservation)
    : null;
  const paymentPreview = useMemo(
    () => selectedComanda
      ? splitAmountInCents(selectedComanda.total, paymentMode === 'split' ? splitParts : 1)
      : [],
    [paymentMode, selectedComanda, splitParts],
  );
  const splitUsers = useMemo(() => {
    if (!selectedReservation?.clientName) return mockSplitUsers;
    const reservationUser: SplitUser = {
      id: `reservation-user-${selectedReservation.id}`,
      name: selectedReservation.clientName,
      phone: selectedReservation.clientPhone || 'Telefone não informado',
      loopsBalance: 850,
    };
    return [reservationUser, ...mockSplitUsers.filter((user) => user.phone !== reservationUser.phone)];
  }, [selectedReservation]);

  const buildScannedComanda = (reservation: Reservation, origin: 'qr' | 'photo', photoUrl?: string): ComandaRecord => {
    const subtotal = origin === 'qr' ? 286.9 : 342.5;
    const taxaServico = Math.round(subtotal * 0.1 * 100) / 100;
    const descontoLoops = 0;
    const comandaCode = origin === 'qr' ? `NFC-${reservation.id.toUpperCase()}` : `NOTA-${reservation.id.toUpperCase()}`;

    return {
      id: `cmd-${reservation.id}-${Date.now()}`,
      comandaCode,
      clienteNome: reservation.clientName || 'Cliente Loopis',
      clienteTelefone: reservation.clientPhone,
      mesaOuReferencia: `Mesa ${reservation.guests + 3}`,
      data: reservation.date,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      itens: origin === 'qr'
        ? [
            { id: 'qr-1', nome: 'Sequência de camarão', precoUnitario: 148, quantidade: 1 },
            { id: 'qr-2', nome: 'Ostras gratinadas', precoUnitario: 62, quantidade: 1 },
            { id: 'qr-3', nome: 'Bebidas da mesa', precoUnitario: 38.45, quantidade: 2 },
          ]
        : [
            { id: 'nf-1', nome: 'Prato principal da casa', precoUnitario: 89, quantidade: reservation.guests },
            { id: 'nf-2', nome: 'Entradas compartilhadas', precoUnitario: 64.5, quantidade: 1 },
            { id: 'nf-3', nome: 'Bebidas e sobremesas', precoUnitario: 44.5, quantidade: 2 },
          ],
      subtotal,
      taxaServico,
      descontoLoops,
      total: subtotal + taxaServico - descontoLoops,
      status: 'aguardando_pagamento',
      formaPagamento: 'pix',
      origemEmissao: 'restaurante',
      fotoCupomUrl: photoUrl,
      qrCodeData: `https://loopis.com.br/checkout/split?comanda=${comandaCode}&total=${(subtotal + taxaServico - descontoLoops).toFixed(2)}`,
    };
  };

  const openLaunchModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setGeneratedPix([]);
    setLaunchMode('qr');
    setLaunchStep('idle');
    setReceiptPreview(null);
    setScannedComanda(null);
    setIsLaunchModalOpen(true);
  };

  const simulateQrRead = () => {
    if (!selectedReservation) return;
    setLaunchStep('reading');
    setTimeout(() => {
      setScannedComanda(buildScannedComanda(selectedReservation, 'qr'));
      setLaunchStep('review');
    }, 1200);
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedReservation) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const photoUrl = reader.result as string;
      setReceiptPreview(photoUrl);
      setLaunchStep('reading');
      setTimeout(() => {
        setScannedComanda(buildScannedComanda(selectedReservation, 'photo', photoUrl));
        setLaunchStep('review');
      }, 1400);
    };
    reader.readAsDataURL(file);
  };

  const confirmLaunchComanda = () => {
    if (!selectedReservation || !scannedComanda) return;
    setLaunchedComandas((current) => ({ ...current, [selectedReservation.id]: scannedComanda }));
    addComanda(scannedComanda);
    setGeneratedPix([]);
    setIsLaunchModalOpen(false);
    setPaymentMode('full');
    setSplitParts(Math.max(2, Math.min(selectedReservation.guests, 10)));
    setSplitAssignments({});
    setIsPaymentModalOpen(true);
  };

  const handleGeneratePayment = () => {
    if (!selectedComanda) return;
    setPaymentMode('full');
    setSplitParts(Math.max(2, Math.min(selectedReservation?.guests || 2, 10)));
    setSplitAssignments({});
    setIsPaymentModalOpen(true);
  };

  const confirmGeneratePayment = () => {
    if (!selectedComanda) return;
    addComanda({ ...selectedComanda, status: 'aguardando_pagamento', formaPagamento: 'pix' });
    const charges = paymentPreview.map((amount, index) => {
      const partNumber = index + 1;
      const reference = paymentMode === 'split' ? `parte-${partNumber}` : 'total';
      const assignedUser = paymentMode === 'split'
        ? splitUsers.find((user) => user.id === splitAssignments[index])
        : undefined;

      return {
        id: `${selectedComanda.id}-${reference}`,
        label: paymentMode === 'split' ? `Parte ${partNumber} de ${paymentPreview.length}` : 'Conta completa',
        amount,
        payload: pixPayload(selectedComanda, amount, reference),
        paymentLink: `https://app.loopis.com.br/pagar/${selectedComanda.id}/${reference}`,
        assignedUser,
        loopsToEarn: assignedUser ? Math.floor(amount) : 0,
      };
    });
    setGeneratedPix(charges);
    setIsPaymentModalOpen(false);
  };

  const handleMarkPaid = () => {
    if (!selectedReservation || !selectedComanda) return;
    processBilling(selectedReservation.id, selectedComanda.total);
    setGeneratedPix([]);
  };

  return (
    <div className="grid min-h-[calc(100vh-140px)] gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-black">Reservas, Clientes & Comandas</h2>
            <p className="mt-1 text-sm text-gray-400">Confirme reservas, faça check-in, lance a conta e gere Pix para pagamento.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-gray-300">
              <CalendarDays size={16} className="text-brand-lilac" />
              <span className="hidden sm:inline">Período</span>
              <select
                value={periodFilter}
                onChange={(event) => setPeriodFilter(event.target.value as PeriodFilter)}
                className="bg-transparent text-xs font-black text-white outline-none"
              >
                <option value="today">Hoje</option>
                <option value="tomorrow">Amanhã</option>
                <option value="next_7_days">Próximos 7 dias</option>
                <option value="all">Todos</option>
                <option value="custom">Período personalizado</option>
              </select>
            </label>
            {periodFilter === 'custom' && (
              <>
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-gray-300">
                  <span>De</span>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(event) => setCustomStartDate(event.target.value)}
                    className="bg-transparent text-xs font-black text-white outline-none [color-scheme:dark]"
                  />
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-gray-300">
                  <span>Até</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(event) => setCustomEndDate(event.target.value)}
                    className="bg-transparent text-xs font-black text-white outline-none [color-scheme:dark]"
                  />
                </label>
              </>
            )}
            {(periodFilter !== 'today' || customStartDate || customEndDate) && (
              <button type="button" onClick={() => { setPeriodFilter('today'); setCustomStartDate(''); setCustomEndDate(''); }} className="rounded-2xl border border-white/10 px-3 py-2 text-xs font-black text-gray-300 hover:text-white">
                Limpar
              </button>
            )}
            <span className="rounded-full bg-brand-violet/15 px-3 py-2 text-xs font-black text-brand-lilac">
              {filteredReservations.length} de {b2bReservations.length} reservas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-4">
          {statusColumns.map((column) => {
            const reservations = filteredReservations.filter((reservation) => reservation.status === column.status);
            return (
              <div key={column.status} className="min-h-[340px] rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-black">{column.title}</h3>
                  <span className="rounded-full bg-black/30 px-2 py-1 text-xs font-black text-gray-400">{reservations.length}</span>
                </div>
                <div className="space-y-3">
                  {reservations.map((reservation) => (
                    <article key={reservation.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-black">{reservation.clientName || 'Cliente Loopis'}</h4>
                          <p className="mt-1 text-xs text-gray-500">{reservation.date} • {reservation.time} • {reservation.guests} pessoas</p>
                        </div>
                        <button type="button" onClick={() => { setSelectedReservation(reservation); setGeneratedPix([]); }} className="rounded-xl border border-white/10 p-2 text-gray-300 hover:text-white">
                          <Eye size={15} />
                        </button>
                      </div>
                      <p className="mt-3 rounded-xl bg-brand-violet/10 px-3 py-2 text-xs font-bold text-brand-lilac">{statusLabel[reservation.status]}</p>
                      <div className="mt-3 flex gap-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button type="button" onClick={() => updateB2bReservationStatus(reservation.id, 'cancelled')} className="flex-1 rounded-xl border border-red-500/20 py-2 text-xs font-black text-red-300"><X size={14} className="inline" /> Recusar</button>
                            <button type="button" onClick={() => updateB2bReservationStatus(reservation.id, 'confirmed')} className="flex-1 rounded-xl bg-brand-violet py-2 text-xs font-black text-white"><Check size={14} className="inline" /> Confirmar</button>
                          </>
                        )}
                        {reservation.status === 'confirmed' && (
                          <button type="button" onClick={() => updateB2bReservationStatus(reservation.id, 'checked_in')} className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-black text-white">Confirmar check-in</button>
                        )}
                        {reservation.status === 'checked_in' && (
                          <button type="button" onClick={() => openLaunchModal(reservation)} className="w-full rounded-xl bg-brand-violet py-2 text-xs font-black text-white">Lançar comanda/Pix</button>
                        )}
                      </div>
                    </article>
                  ))}
                  {reservations.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-gray-500">Sem reservas</div>}
                </div>
              </div>
            );
          })}
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-lg font-black">Lista dos meus clientes</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="py-3">Cliente</th>
                  <th className="py-3">Reserva</th>
                  <th className="py-3">Check-in</th>
                  <th className="py-3">Conta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredReservations.map((reservation) => {
                  const activity = partnerActivities.find((item) => item.reservaId === reservation.id);
                  const comanda = activity?.comanda || fallbackComanda(reservation);
                  return (
                    <tr key={reservation.id} className="cursor-pointer hover:bg-white/[0.03]" onClick={() => { setSelectedReservation(reservation); setGeneratedPix([]); }}>
                      <td className="py-3 font-bold">{reservation.clientName}</td>
                      <td className="py-3 text-gray-400">{reservation.date} às {reservation.time}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${reservation.status === 'checked_in' || reservation.status === 'completed' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300'}`}>
                          {reservation.status === 'checked_in' || reservation.status === 'completed' ? 'feito' : 'pendente'}
                        </span>
                      </td>
                      <td className="py-3 text-brand-lilac">R$ {comanda.total.toFixed(2).replace('.', ',')}</td>
                    </tr>
                  );
                })}
                {filteredReservations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      Nenhuma reserva encontrada para o período selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        {selectedReservation && selectedComanda ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Detalhes do cliente</p>
              <h3 className="mt-2 text-2xl font-black">{selectedReservation.clientName}</h3>
              <p className="mt-1 text-sm text-gray-400">{selectedReservation.clientPhone} • {selectedReservation.guests} pessoas</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Reserva</p>
                <p className="mt-1 text-sm font-black">{selectedReservation.date} {selectedReservation.time}</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Status</p>
                <p className="mt-1 text-sm font-black">{statusLabel[selectedReservation.status]}</p>
              </div>
            </div>

            <section className="rounded-2xl bg-black/25 p-4">
              <h4 className="flex items-center gap-2 text-sm font-black"><ReceiptText size={16} /> Conta detalhada</h4>
              <div className="mt-4 space-y-3">
                {selectedComanda.itens.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-300">{item.quantidade}x {item.nome}</span>
                    <span className="font-bold">R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>R$ {selectedComanda.subtotal.toFixed(2).replace('.', ',')}</span></div>
                <div className="flex justify-between text-gray-400"><span>Serviço</span><span>R$ {selectedComanda.taxaServico.toFixed(2).replace('.', ',')}</span></div>
                {selectedComanda.descontoLoops > 0 && <div className="flex justify-between text-emerald-300"><span>Desconto Loops</span><span>- R$ {selectedComanda.descontoLoops.toFixed(2).replace('.', ',')}</span></div>}
                <div className="flex justify-between text-lg font-black"><span>Total</span><span>R$ {selectedComanda.total.toFixed(2).replace('.', ',')}</span></div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">O cliente escolhe quantos Loops deseja usar somente no app e apenas quando pagar a conta integralmente.</p>
            </section>

            <div className="space-y-2">
              {selectedReservation.status === 'confirmed' && (
                <button type="button" onClick={() => updateB2bReservationStatus(selectedReservation.id, 'checked_in')} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white">
                  <Check size={16} /> Confirmar check-in do cliente
                </button>
              )}
              <button type="button" onClick={() => openLaunchModal(selectedReservation)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">
                <ScanLine size={16} /> Ler QR/nota e lançar comanda
              </button>
              <button type="button" onClick={handleGeneratePayment} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-violet/30 py-3 text-sm font-black text-brand-lilac">
                <QrCode size={16} /> Gerar Pix com a comanda atual
              </button>
              <button type="button" onClick={handleMarkPaid} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 text-sm font-black text-gray-200">
                <CreditCard size={16} /> Marcar como pago e concluir
              </button>
            </div>

            {generatedPix.length > 0 && (
              <div className="rounded-2xl border border-brand-violet/30 bg-brand-violet/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Cobrança Pix gerada</p>
                    <p className="mt-1 text-sm text-gray-300">
                      {generatedPix.length === 1 ? 'Conta completa em uma cobrança' : `${generatedPix.length} partes para pagamento`}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-violet/20 px-2.5 py-1 text-xs font-black text-brand-lilac">{generatedPix.length} {generatedPix.length === 1 ? 'Pix' : 'Pix'}</span>
                </div>

                <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                  {generatedPix.map((charge) => (
                    <article key={charge.id} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-brand-violet">
                          <QrCode size={34} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-white">{charge.label}</p>
                          <p className="mt-1 text-lg font-black text-brand-lilac">{formatCurrency(charge.amount)}</p>
                          {charge.assignedUser ? (
                            <p className="mt-1 text-[10px] font-bold text-emerald-300">{charge.assignedUser.name} • receberá {charge.loopsToEarn} Loops</p>
                          ) : (
                            <p className="mt-1 text-[10px] font-bold text-gray-500">Pagamento guest • sem crédito de Loops</p>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 truncate rounded-lg bg-black/30 px-2 py-1.5 text-[10px] text-gray-500">{charge.paymentLink}</p>
                      <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white">
                        <Send size={14} /> {charge.assignedUser ? `Enviar para ${charge.assignedUser.name.split(' ')[0]}` : 'Copiar link de pagamento'}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Selecione uma reserva para ver os detalhes.</p>
        )}
      </aside>

      {isPaymentModalOpen && selectedReservation && selectedComanda && (
        <div className="partner-modal-backdrop fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-xl sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Cobrança da comanda</p>
                <h3 className="mt-1 text-xl font-black">Gerar pagamento via Pix</h3>
                <p className="mt-1 text-sm text-gray-400">Defina se {selectedReservation.clientName} pagará a conta inteira ou em partes.</p>
              </div>
              <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300 hover:text-white" aria-label="Fechar modal de pagamento">
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total da comanda</p>
                  <p className="mt-1 text-2xl font-black text-white">{formatCurrency(selectedComanda.total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="mt-1 text-sm font-black text-gray-200">{selectedReservation.clientName}</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-400">Forma de cobrança</p>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMode('full')}
                  className={`rounded-xl px-3 py-3 text-sm font-black transition ${paymentMode === 'full' ? 'bg-brand-violet text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Conta inteira
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('split')}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-black transition ${paymentMode === 'split' ? 'bg-brand-violet text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <UsersRound size={16} /> Dividir conta
                </button>
              </div>
            </div>

            {paymentMode === 'split' && (
              <div className="mt-5 rounded-2xl border border-brand-violet/25 bg-brand-violet/10 p-4">
                <label htmlFor="split-parts" className="block text-sm font-black text-white">Em quantas partes deseja dividir?</label>
                <p className="mt-1 text-xs text-gray-400">Será gerado um Pix individual para cada parte.</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSplitParts((current) => Math.max(2, current - 1))}
                    disabled={splitParts <= 2}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Diminuir quantidade de partes"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    id="split-parts"
                    title="Quantidade de partes"
                    type="number"
                    min={2}
                    max={10}
                    value={splitParts}
                    onChange={(event) => setSplitParts(Math.max(2, Math.min(10, Number(event.target.value) || 2)))}
                    className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 text-center text-lg font-black text-white outline-none focus:border-brand-violet"
                  />
                  <button
                    type="button"
                    onClick={() => setSplitParts((current) => Math.min(10, current + 1))}
                    disabled={splitParts >= 10}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Aumentar quantidade de partes"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-white">Prévia da cobrança</p>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-gray-300">
                  {paymentPreview.length} {paymentPreview.length === 1 ? 'cobrança' : 'cobranças'}
                </span>
              </div>
              <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                {paymentPreview.map((amount, index) => (
                  <div key={`${index}-${amount}`} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-gray-300">{paymentMode === 'split' ? `Parte ${index + 1}` : 'Conta completa'}</span>
                      <span className="text-sm font-black text-brand-lilac">{formatCurrency(amount)}</span>
                    </div>
                    {paymentMode === 'split' && (
                      <div className="mt-3 border-t border-white/10 pt-3">
                        <label htmlFor={`split-user-${index}`} className="block text-[10px] font-black uppercase tracking-wider text-gray-500">Vincular usuário Loopis</label>
                        <select
                          id={`split-user-${index}`}
                          title={`Usuário vinculado à parte ${index + 1}`}
                          value={splitAssignments[index] || ''}
                          onChange={(event) => setSplitAssignments((current) => ({ ...current, [index]: event.target.value }))}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#202024] px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-brand-violet"
                        >
                          <option value="">Sem vínculo - gerar link guest</option>
                          {splitUsers.map((user) => (
                            <option key={user.id} value={user.id}>{user.name} • {user.phone}</option>
                          ))}
                        </select>
                        {splitAssignments[index] ? (() => {
                          const user = splitUsers.find((item) => item.id === splitAssignments[index]);
                          return user ? (
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-[10px] font-bold text-emerald-300">
                              <span>Saldo atual: {user.loopsBalance} Loops</span>
                              <span>Receberá +{Math.floor(amount)} Loops</span>
                            </div>
                          ) : null;
                        })() : (
                          <p className="mt-2 text-[10px] text-gray-500">A parte terá apenas QR Code e link para pagamento, sem atribuição de Loops.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {paymentMode === 'split' && (
                <p className="mt-3 text-xs text-gray-500">Quando houver diferença de centavos, ela é distribuída nas primeiras partes para o total fechar corretamente.</p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="rounded-2xl border border-white/10 py-3 text-sm font-black text-gray-200">
                Cancelar
              </button>
              <button type="button" onClick={confirmGeneratePayment} className="flex items-center justify-center gap-2 rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">
                <QrCode size={17} /> Gerar {paymentPreview.length} {paymentPreview.length === 1 ? 'Pix' : 'Pix individuais'}
              </button>
            </div>
          </section>
        </div>
      )}

      {isLaunchModalOpen && selectedReservation && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Lançar comanda</p>
                <h3 className="mt-1 text-xl font-black">{selectedReservation.clientName}</h3>
                <p className="mt-1 text-xs text-gray-400">{selectedReservation.date} • {selectedReservation.time} • {selectedReservation.guests} pessoas</p>
              </div>
              <button type="button" onClick={() => setIsLaunchModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300 hover:text-white">
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setLaunchMode('qr');
                  setLaunchStep('idle');
                  setScannedComanda(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black transition ${launchMode === 'qr' ? 'bg-brand-violet text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <QrCode size={16} />
                Ler QR Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setLaunchMode('photo');
                  setLaunchStep('idle');
                  setScannedComanda(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black transition ${launchMode === 'photo' ? 'bg-brand-violet text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Camera size={16} />
                Foto da nota
              </button>
            </div>

            {launchStep === 'idle' && (
              <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-black/25 p-6 text-center">
                {launchMode === 'qr' ? (
                  <>
                    <div className="relative mx-auto mb-5 flex h-44 w-44 items-center justify-center rounded-3xl border border-brand-violet/40 bg-black/30">
                      <QrCode size={82} className="text-brand-lilac" />
                      <ScanLine size={34} className="absolute text-white/80" />
                    </div>
                    <h4 className="text-lg font-black">Aponte para o QR Code da NFC-e ou da comanda</h4>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">O sistema lê os itens, subtotal, taxa de serviço e prepara a cobrança Pix para o cliente pagar pelo app.</p>
                    <button type="button" onClick={simulateQrRead} className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-violet px-5 py-3 text-sm font-black text-white">
                      <ScanLine size={17} />
                      Iniciar leitura do QR
                    </button>
                  </>
                ) : (
                  <>
                    {receiptPreview ? (
                      <img src={receiptPreview} alt="Nota enviada" className="mx-auto mb-5 h-48 max-w-full rounded-2xl object-contain" />
                    ) : (
                      <div className="mx-auto mb-5 flex h-44 w-44 items-center justify-center rounded-3xl border border-brand-violet/40 bg-black/30">
                        <ReceiptText size={82} className="text-brand-lilac" />
                      </div>
                    )}
                    <h4 className="text-lg font-black">Fotografe ou envie a nota da mesa</h4>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">A leitura por IA identifica os itens da nota e lança a comanda detalhada na reserva do cliente.</p>
                    <label className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-violet px-5 py-3 text-sm font-black text-white">
                      <Upload size={17} />
                      Enviar foto da nota
                      <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                    </label>
                  </>
                )}
              </div>
            )}

            {launchStep === 'reading' && (
              <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-violet/10 text-brand-lilac">
                  <RefreshCw size={34} className="animate-spin" />
                </div>
                <h4 className="mt-5 text-lg font-black">Lendo a comanda...</h4>
                <p className="mt-2 text-sm text-gray-400">Extraindo itens, valores e total para lançar no atendimento.</p>
              </div>
            )}

            {launchStep === 'review' && scannedComanda && (
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-300">Leitura concluída</p>
                  <p className="mt-1 text-sm text-gray-300">Revise a conta antes de lançar a comanda e gerar o Pix.</p>
                </div>

                <section className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black">{scannedComanda.comandaCode}</h4>
                      <p className="mt-1 text-xs text-gray-500">{scannedComanda.mesaOuReferencia} • {scannedComanda.horario}</p>
                    </div>
                    <span className="rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-black text-brand-lilac">Pix pronto</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {scannedComanda.itens.map((item) => (
                      <div key={item.id} className="flex justify-between gap-3 text-sm">
                        <span className="text-gray-300">{item.quantidade}x {item.nome}</span>
                        <span className="font-bold">R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                    <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>R$ {scannedComanda.subtotal.toFixed(2).replace('.', ',')}</span></div>
                    <div className="flex justify-between text-gray-400"><span>Serviço</span><span>R$ {scannedComanda.taxaServico.toFixed(2).replace('.', ',')}</span></div>
                    {scannedComanda.descontoLoops > 0 && <div className="flex justify-between text-emerald-300"><span>Desconto Loops</span><span>- R$ {scannedComanda.descontoLoops.toFixed(2).replace('.', ',')}</span></div>}
                    <div className="flex justify-between text-lg font-black"><span>Total</span><span>R$ {scannedComanda.total.toFixed(2).replace('.', ',')}</span></div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">O abatimento com Loops será escolhido pelo cliente no pagamento integral pelo app.</p>
                </section>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button type="button" onClick={() => setLaunchStep('idle')} className="rounded-2xl border border-white/10 py-3 text-sm font-black text-gray-200">
                    Ler novamente
                  </button>
                  <button type="button" onClick={confirmLaunchComanda} className="rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">
                    Lançar comanda e gerar Pix
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
