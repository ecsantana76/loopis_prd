import React, { useState } from 'react';
import { CheckCircle2, QrCode, X } from 'lucide-react';
import { PartnerType } from '../../types';
import type { RentalExperienceDetail, TourExperienceDetail } from '../../types/experience';
import { useStore } from '../../store/useStore';

interface BookTourModalProps {
  experience: TourExperienceDetail | RentalExperienceDetail;
  isOpen: boolean;
  onClose: () => void;
}

export const BookTourModal: React.FC<BookTourModalProps> = ({ experience, isOpen, onClose }) => {
  const [seats, setSeats] = useState(2);
  const [useLoops, setUseLoops] = useState(false);
  const [loopsInput, setLoopsInput] = useState('');
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const loopsBalance = useStore((state) => state.loopsBalance);
  const completeClientPayment = useStore((state) => state.completeClientPayment);
  const isRental = experience.partner_type === PartnerType.RENTAL;
  const total = experience.priceFrom * seats;
  const maxLoopsForPayment = Math.max(0, Math.min(loopsBalance, Math.floor(total)));
  const loopsToUse = useLoops ? Math.max(0, Math.min(maxLoopsForPayment, Math.floor(Number(loopsInput) || 0))) : 0;
  const payableTotal = Math.max(0, Number((total - loopsToUse).toFixed(2)));
  const earnedLoops = Math.round((payableTotal * experience.cashbackPercent) / 100);
  const availableTimes: string[] = experience.partner_type === PartnerType.TOUR
    ? experience.slotBooking.departureTimes
    : ['08:00', '10:00', '14:00', '18:00'];

  if (!isOpen) return null;

  const handlePayment = () => {
    const completed = completeClientPayment(`Compra de ${experience.title}`, loopsToUse, earnedLoops);
    if (!completed) return;
    setVoucherCode(`LOOP-${isRental ? 'LOC' : 'TOUR'}-${Date.now().toString().slice(-5)}`);
  };

  if (voucherCode) {
    return (
      <div className="app-modal-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 md:items-center md:p-4">
        <div className="app-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white p-4 text-brand-graphite shadow-xl md:max-w-lg md:rounded-3xl md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-brand-violet">Compra confirmada</p>
              <h2 className="mt-1 text-lg font-black">Voucher gerado</h2>
            </div>
            <button type="button" onClick={() => { setVoucherCode(null); onClose(); }} className="rounded-full bg-gray-100 p-2"><X size={18} /></button>
          </div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
            <div className="bg-brand-violet p-5 text-white">
              <CheckCircle2 size={26} />
              <h3 className="mt-3 text-xl font-black">{experience.title}</h3>
              <p className="mt-1 text-sm text-white/75">{experience.partnerName}</p>
            </div>
            <div className="grid grid-cols-[1fr_116px] gap-4 p-5">
              <div className="space-y-3 text-sm">
                <div><p className="text-xs font-bold uppercase text-gray-400">{isRental ? 'Locação' : 'Saída'}</p><p className="font-black">Dia 12 • {availableTimes[0]}</p></div>
                <div><p className="text-xs font-bold uppercase text-gray-400">{isRental ? 'Unidades' : 'Passageiros'}</p><p className="font-black">{seats}</p></div>
                <div><p className="text-xs font-bold uppercase text-gray-400">Pagamento</p><p className="font-black">R$ {payableTotal.toFixed(2).replace('.', ',')} • {loopsToUse} Loops usados</p></div>
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
          <h2 className="text-lg font-black">{isRental ? 'Horários Livres' : 'Escolher Data e Horário'}</h2>
          <button type="button" onClick={onClose} className="rounded-full bg-gray-100 p-2"><X size={18} /></button>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {['12', '13', '14', '15', '16', '17', '18', '19'].map((day) => (
            <button key={day} type="button" className="rounded-2xl border border-gray-200 px-3 py-3 text-sm font-black hover:border-brand-violet">{day}</button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {availableTimes.map((time) => (
            <button key={time} type="button" className="rounded-xl bg-brand-violet/10 px-3 py-2 text-xs font-black text-brand-violet">{time}</button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{isRental ? 'Unidades' : 'Vagas'}</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setSeats(Math.max(1, seats - 1))} className="h-8 w-8 rounded-full bg-white font-black shadow">-</button>
              <span className="w-6 text-center font-black">{seats}</span>
              <button type="button" onClick={() => setSeats(seats + 1)} className="h-8 w-8 rounded-full bg-white font-black shadow">+</button>
            </div>
          </div>
          <label className="mt-4 block text-xs font-black uppercase text-gray-500">Nome do responsável</label>
          <input placeholder="Ex: Ana Souza" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-violet" />
          <label className="mt-3 block text-xs font-black uppercase text-gray-500">
            {isRental ? 'Participantes autorizados' : 'Documento/telefone dos passageiros'}
          </label>
          <input placeholder={isRental ? 'Nomes de quem vai usar a locação' : 'CPF ou telefone dos passageiros'} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-violet" />
          {isRental && (
            <>
              <label className="mt-3 block text-xs font-black uppercase text-gray-500">Duração da locação</label>
              <select className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-violet">
                <option>1 hora</option>
                <option>2 horas</option>
                <option>3 horas</option>
              </select>
            </>
          )}
        </div>
        <section className="mt-4 rounded-2xl border border-brand-violet/20 bg-brand-violet/5 p-4">
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
              <span className="mt-1 block text-[10px] font-medium text-gray-500">Máximo: {maxLoopsForPayment} Loops • restante R$ {payableTotal.toFixed(2).replace('.', ',')}</span>
            </label>
          )}
        </section>
        <button
          type="button"
          onClick={handlePayment}
          className="mt-5 w-full rounded-2xl bg-brand-violet py-3 text-sm font-black text-white"
        >
          Pagar com Pix ou Cartão no app
        </button>
      </div>
    </div>
  );
};
