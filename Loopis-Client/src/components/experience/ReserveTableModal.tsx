import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { RestaurantExperienceDetail } from '../../types/experience';

interface ReserveTableModalProps {
  experience: RestaurantExperienceDetail;
  isOpen: boolean;
  onClose: () => void;
}

export const ReserveTableModal: React.FC<ReserveTableModalProps> = ({ experience, isOpen, onClose }) => {
  const [guests, setGuests] = useState(experience.reservation.minGuests);

  if (!isOpen) return null;

  return (
    <div className="app-modal-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 md:items-center md:p-4">
      <div className="app-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white p-4 text-brand-graphite shadow-xl md:max-w-md md:rounded-3xl md:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Reservar Mesa</h2>
          <button type="button" onClick={onClose} className="rounded-full bg-gray-100 p-2"><X size={18} /></button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {['Hoje', 'Amanhã', 'Sábado', 'Domingo'].map((day) => (
            <button key={day} type="button" className="rounded-2xl border border-gray-200 px-3 py-3 text-sm font-bold hover:border-brand-violet">{day}</button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {experience.reservation.availableTimes.map((time) => (
            <button key={time} type="button" className="rounded-xl bg-brand-violet/10 px-3 py-2 text-xs font-black text-brand-violet">{time}</button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
          <span className="text-sm font-bold">Pessoas</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setGuests(Math.max(experience.reservation.minGuests, guests - 1))} className="h-8 w-8 rounded-full bg-white font-black shadow">-</button>
            <span className="w-6 text-center font-black">{guests}</span>
            <button type="button" onClick={() => setGuests(Math.min(experience.reservation.maxGuests, guests + 1))} className="h-8 w-8 rounded-full bg-white font-black shadow">+</button>
          </div>
        </div>
        <p className="mt-5 rounded-2xl border border-brand-violet/20 bg-brand-violet/5 p-4 text-xs font-bold leading-relaxed text-brand-deep-purple">
          Os Loops poderão ser usados depois do check-in, quando a comanda for fechada e o pagamento for individual.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {['Check-in no local', 'Comanda por QR/nota', 'Pix ou pagamento local'].map((step) => (
            <div key={step} className="rounded-2xl bg-gray-50 p-3 text-[11px] font-black text-gray-600">{step}</div>
          ))}
        </div>
        <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">Bônus aplicado: ganhe até {Math.round(experience.priceFrom * experience.cashbackPercent / 100)} Loops nesta reserva.</p>
        <button type="button" onClick={onClose} className="mt-5 w-full rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">Confirmar Reserva</button>
      </div>
    </div>
  );
};
