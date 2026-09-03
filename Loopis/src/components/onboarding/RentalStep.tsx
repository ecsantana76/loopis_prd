import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { PartnerWizardFormData } from './PartnerWizard';

interface RentalStepProps {
  register: UseFormRegister<PartnerWizardFormData>;
}

export const RentalStep: React.FC<RentalStepProps> = ({ register }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Grade de funcionamento</span>
      <input {...register('rental.scheduleGridText')} placeholder="Seg a sex, 08h-22h" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Tempo mínimo de aluguel (horas)</span>
      <input type="number" min={1} {...register('rental.minimumRentalHours', { valueAsNumber: true })} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
  </div>
);
