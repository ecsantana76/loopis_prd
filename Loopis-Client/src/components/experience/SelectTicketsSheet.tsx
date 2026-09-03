import React, { useMemo, useState } from 'react';
import { CheckCircle2, QrCode, X } from 'lucide-react';
import type { EventExperienceDetail } from '../../types/experience';
import { useStore } from '../../store/useStore';

interface SelectTicketsSheetProps {
  experience: EventExperienceDetail;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const SelectTicketsSheet: React.FC<SelectTicketsSheetProps> = ({ experience, isOpen, onClose }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [useLoops, setUseLoops] = useState(false);
  const [loopsInput, setLoopsInput] = useState('');
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const loopsBalance = useStore((state) => state.loopsBalance);
  const completeClientPayment = useStore((state) => state.completeClientPayment);
  const total = useMemo(
    () => experience.ticketPurchase.ticketLots.reduce((sum, lot) => sum + lot.price * (quantities[lot.id] || 0), 0),
    [experience.ticketPurchase.ticketLots, quantities],
  );
  const maxLoopsForPayment = Math.max(0, Math.min(loopsBalance, Math.floor(total)));
  const loopsToUse = useLoops ? Math.max(0, Math.min(maxLoopsForPayment, Math.floor(Number(loopsInput) || 0))) : 0;
  const payableTotal = Math.max(0, Number((total - loopsToUse).toFixed(2)));
  const earnedLoops = Math.round((payableTotal * experience.cashbackPercent) / 100);

  if (!isOpen) return null;

  const handlePayment = () => {
    if (total <= 0) return;
    const completed = completeClientPayment(`Compra de ingressos para ${experience.title}`, loopsToUse, earnedLoops);
    if (!completed) return;
    setVoucherCode(`LOOP-EVT-${Date.now().toString().slice(-5)}`);
  };

  if (voucherCode) {
    const selectedTickets = experience.ticketPurchase.ticketLots
      .filter((lot) => (quantities[lot.id] || 0) > 0)
      .map((lot) => `${quantities[lot.id]}x ${lot.name}`)
      .join(' • ');

    return (
      <div className="app-modal-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 md:items-center md:p-4">
        <div className="app-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white p-4 text-brand-graphite shadow-xl md:max-w-lg md:rounded-3xl md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-brand-violet">Compra confirmada</p>
              <h2 className="mt-1 text-lg font-black">Voucher do evento</h2>
            </div>
            <button type="button" onClick={() => { setVoucherCode(null); onClose(); }} className="rounded-full bg-gray-100 p-2"><X size={18} /></button>
          </div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
            <div className="bg-brand-violet p-5 text-white">
              <CheckCircle2 size={26} />
              <h3 className="mt-3 text-xl font-black">{experience.title}</h3>
              <p className="mt-1 text-sm text-white/75">{experience.partnerName} • Portaria {experience.ticketPurchase.gateOpensAt}</p>
            </div>
            <div className="grid grid-cols-[1fr_116px] gap-4 p-5">
              <div className="space-y-3 text-sm">
                <div><p className="text-xs font-bold uppercase text-gray-400">Ingressos</p><p className="font-black">{selectedTickets || '1x ingresso'}</p></div>
                <div><p className="text-xs font-bold uppercase text-gray-400">Total pago</p><p className="font-black">{formatCurrency(payableTotal)} • {loopsToUse} Loops usados</p></div>
                <div><p className="text-xs font-bold uppercase text-gray-400">Titular</p><p className="font-black">Cliente Loopis</p></div>
                <div><p className="text-xs font-bold uppercase text-gray-400">Código</p><p className="font-mono text-xs font-black text-brand-violet">{voucherCode}</p></div>
              </div>
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white text-brand-violet shadow-sm">
                <QrCode size={72} />
              </div>
            </div>
          </div>
          <button type="button" onClick={() => { setVoucherCode(null); onClose(); }} className="mt-5 w-full rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">
            Fechar voucher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-modal-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 md:items-center md:p-4">
      <div className="app-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white p-4 text-brand-graphite shadow-xl md:max-w-lg md:rounded-3xl md:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Comprar Ingressos</h2>
          <button type="button" onClick={onClose} className="rounded-full bg-gray-100 p-2"><X size={18} /></button>
        </div>
        <div className="mt-5 space-y-3">
          {experience.ticketPurchase.ticketLots.map((lot) => {
            const quantity = quantities[lot.id] || 0;
            return (
              <div key={lot.id} className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                <div>
                  <p className="text-sm font-black">{lot.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(lot.price)} • {lot.availableQuantity} disponíveis</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantities((current) => ({ ...current, [lot.id]: Math.max(0, quantity - 1) }))} className="h-8 w-8 rounded-full bg-gray-100 font-black">-</button>
                  <span className="w-6 text-center font-black">{quantity}</span>
                  <button type="button" onClick={() => setQuantities((current) => ({ ...current, [lot.id]: Math.min(lot.availableQuantity, quantity + 1) }))} className="h-8 w-8 rounded-full bg-brand-violet text-white font-black">+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
          <span className="text-sm font-bold">Total</span>
          <span className="text-xl font-black">{formatCurrency(total)}</span>
        </div>
        <section className="mt-3 rounded-2xl border border-brand-violet/20 bg-brand-violet/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black">Você tem {loopsBalance} Loops. Você deseja utilizar Loops para pagar?</p>
              <p className="mt-1 text-xs text-gray-600">1 Loop = R$ 1 de abatimento.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={useLoops}
              onClick={() => {
                const next = !useLoops;
                setUseLoops(next);
                setLoopsInput(next ? String(maxLoopsForPayment) : '');
              }}
              className={`h-7 w-12 shrink-0 rounded-full p-1 transition ${useLoops ? 'bg-brand-violet' : 'bg-gray-300'}`}
              aria-label="Usar Loops nesta compra"
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition ${useLoops ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          {useLoops && (
            <label className="mt-4 block border-t border-brand-violet/15 pt-4 text-xs font-black text-gray-600">
              Quantos Loops você quer utilizar?
              <input type="number" min={0} max={maxLoopsForPayment} step={1} value={loopsInput} onChange={(event) => setLoopsInput(event.target.value)} className="mt-1.5 w-full rounded-xl border border-brand-violet/20 bg-white px-3 py-3 text-base font-black outline-none focus:border-brand-violet" />
              <span className="mt-1 block text-[10px] font-medium text-gray-500">Máximo: {maxLoopsForPayment} Loops • restante {formatCurrency(payableTotal)}</span>
            </label>
          )}
        </section>
        <button
          type="button"
          onClick={handlePayment}
          disabled={total <= 0}
          className="mt-5 w-full rounded-2xl bg-brand-violet py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pagar com Pix ou Cartão no app
        </button>
      </div>
    </div>
  );
};
