import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { PartnerWizardFormData } from './PartnerWizard';

interface TourStepProps {
  register: UseFormRegister<PartnerWizardFormData>;
}

export const TourStep: React.FC<TourStepProps> = ({ register }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Horários de saída</span>
      <input {...register('tour.departureTimesText')} placeholder="09h, 14h" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Tamanho do grupo</span>
      <input type="number" min={1} {...register('tour.maxGroupSize', { valueAsNumber: true })} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="sm:col-span-2 space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Ponto de embarque</span>
      <input {...register('tour.boardingPoint')} placeholder="Trapiche central, Lagoa da Conceição" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
  </div>
);
