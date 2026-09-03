import React, { useMemo, useState } from 'react';
import { CheckCircle2, Copy, MessageCircle, QrCode, UserPlus, X } from 'lucide-react';
import { generateWhatsAppSplitLink } from '../../utils/generateWhatsAppSplitLink';

type SplitMode = 'equal' | 'custom';

interface SplitParticipantDraft {
  id: string;
  name: string;
  phone: string;
  amount: number;
  isPaid: boolean;
  pixPayload?: string;
}

interface SplitPaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalAmount: number;
  guestPaymentBaseUrl?: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const makeParticipant = (index: number, amount: number): SplitParticipantDraft => ({
  id: `participant-${index}-${Date.now()}`,
  name: `Amigo ${index}`,
  phone: '',
  amount,
  isPaid: index === 1,
});

const makePixPayload = (participant: SplitParticipantDraft, title: string) =>
  `00020126580014br.gov.bcb.pix0136loopis-${participant.id}520400005303986540${participant.amount.toFixed(2)}5802BR5925Loopis Split Payment6009Floripa62170513${title.slice(0, 13)}6304ABCD`;

export const SplitPaymentDrawer: React.FC<SplitPaymentDrawerProps> = ({
  isOpen,
  onClose,
  title,
  totalAmount,
  guestPaymentBaseUrl = 'https://loopis.app/pay/guest',
}) => {
  const [mode, setMode] = useState<SplitMode>('equal');
  const [peopleCount, setPeopleCount] = useState(4);
  const [participants, setParticipants] = useState<SplitParticipantDraft[]>([
    { id: 'me', name: 'Você', phone: '', amount: totalAmount / 2, isPaid: true },
    { id: 'friend-1', name: 'Marina', phone: '48999999999', amount: totalAmount / 2, isPaid: false },
  ]);

  const equalAmount = totalAmount / peopleCount;
  const activeParticipants = mode === 'equal'
    ? Array.from({ length: peopleCount }, (_, index) => makeParticipant(index + 1, equalAmount))
    : participants;
  const paidAmount = activeParticipants.reduce((sum, participant) => sum + (participant.isPaid ? participant.amount : 0), 0);
  const progress = totalAmount === 0 ? 100 : Math.min(100, Math.round((paidAmount / totalAmount) * 100));

  const customTotal = useMemo(
    () => participants.reduce((sum, participant) => sum + participant.amount, 0),
    [participants],
  );

  if (!isOpen) return null;

  const updateParticipant = (id: string, updates: Partial<SplitParticipantDraft>) => {
    setParticipants((current) =>
      current.map((participant) => (participant.id === id ? { ...participant, ...updates } : participant)),
    );
  };

  const addParticipant = () => {
    setParticipants((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        name: '',
        phone: '',
        amount: 0,
        isPaid: false,
      },
    ]);
  };

  return (
    <div className="app-modal-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 md:items-center md:p-4">
      <div className="app-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white p-4 text-brand-graphite shadow-xl md:max-w-2xl md:rounded-3xl md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-brand-violet">Split Payment</p>
            <h2 className="mt-1 text-xl font-black">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-gray-100 p-2">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
          <button type="button" onClick={() => setMode('equal')} className={`rounded-xl py-2 text-xs font-black ${mode === 'equal' ? 'bg-white shadow' : 'text-gray-500'}`}>
            Divisão Igualitária
          </button>
          <button type="button" onClick={() => setMode('custom')} className={`rounded-xl py-2 text-xs font-black ${mode === 'custom' ? 'bg-white shadow' : 'text-gray-500'}`}>
            Personalizada
          </button>
        </div>

        {mode === 'equal' ? (
          <section className="mt-5 rounded-2xl border border-gray-200 p-4">
            <label className="text-xs font-black uppercase tracking-wider text-gray-500">Número de pessoas</label>
            <input
              type="number"
              min={1}
              value={peopleCount}
              onChange={(event) => setPeopleCount(Math.max(1, Number(event.target.value)))}
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-violet"
            />
            <p className="mt-3 text-sm font-bold">Valor por pessoa: {formatCurrency(equalAmount)}</p>
          </section>
        ) : (
          <section className="mt-5 space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="grid grid-cols-1 gap-2 rounded-2xl border border-gray-200 p-3 sm:grid-cols-[1fr_1fr_120px]">
                <input value={participant.name} onChange={(event) => updateParticipant(participant.id, { name: event.target.value })} placeholder="Nome" className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-violet" />
                <input value={participant.phone} onChange={(event) => updateParticipant(participant.id, { phone: event.target.value })} placeholder="Telefone" className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-violet" />
                <input type="number" value={participant.amount} onChange={(event) => updateParticipant(participant.id, { amount: Number(event.target.value) })} className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-violet" />
              </div>
            ))}
            <button type="button" onClick={addParticipant} className="inline-flex items-center gap-2 rounded-xl border border-brand-violet/20 px-4 py-2 text-xs font-black text-brand-violet">
              <UserPlus size={16} />
              Adicionar participante
            </button>
            <p className="text-xs font-bold text-gray-500">Total atribuído: {formatCurrency(customTotal)}</p>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black">Quitação em tempo real</h3>
            <span className="text-sm font-black text-brand-violet">{progress}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-brand-violet transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex -space-x-2">
            {activeParticipants.map((participant) => (
              <div key={participant.id} title={participant.name} className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-black ${participant.isPaid ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {participant.isPaid ? <CheckCircle2 size={16} /> : participant.name.slice(0, 1)}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-3">
          {activeParticipants.map((participant) => {
            const paymentUrl = `${guestPaymentBaseUrl}/${participant.id}`;
            const pixPayload = participant.pixPayload || makePixPayload(participant, title);
            const whatsappLink = generateWhatsAppSplitLink({
              experienceName: title,
              participantName: participant.name,
              amount: participant.amount,
              guestPaymentUrl: paymentUrl,
            });

            return (
              <div key={participant.id} className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">{participant.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(participant.amount)} • {participant.isPaid ? 'Pago' : 'Pendente'}</p>
                  </div>
                  <button type="button" onClick={() => updateParticipant(participant.id, { pixPayload })} className="inline-flex items-center gap-1 rounded-xl bg-brand-violet px-3 py-2 text-[11px] font-black text-white">
                    <QrCode size={14} />
                    Gerar Pix Individual
                  </button>
                </div>
                {participant.pixPayload && (
                  <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-brand-violet">
                        <QrCode size={32} />
                      </div>
                      <code className="line-clamp-3 text-[10px] text-gray-500">{participant.pixPayload}</code>
                    </div>
                    <button type="button" className="mt-2 inline-flex items-center gap-1 text-xs font-black text-brand-violet">
                      <Copy size={13} />
                      Copia e Cola
                    </button>
                  </div>
                )}
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 px-3 py-2 text-xs font-black text-emerald-700">
                  <MessageCircle size={15} />
                  Cobrar no WhatsApp
                </a>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};
