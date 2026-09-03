import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { PartnerWizardFormData } from './PartnerWizard';

interface RestaurantStepProps {
  register: UseFormRegister<PartnerWizardFormData>;
}

export const RestaurantStep: React.FC<RestaurantStepProps> = ({ register }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Capacidade de mesas</span>
      <input type="number" min={1} {...register('restaurant.tableCount', { valueAsNumber: true })} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Horários de pico</span>
      <input {...register('restaurant.peakHoursText')} placeholder="12h-14h, 19h-22h" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="sm:col-span-2 space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Dias de funcionamento</span>
      <input {...register('restaurant.operatingDaysText')} placeholder="Terça a domingo" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
  </div>
);
