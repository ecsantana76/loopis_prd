import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { PartnerWizardFormData } from './PartnerWizard';

interface EventStepProps {
  register: UseFormRegister<PartnerWizardFormData>;
}

export const EventStep: React.FC<EventStepProps> = ({ register }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Nome do primeiro evento</span>
      <input {...register('event.eventName')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Data</span>
      <input type="date" {...register('event.eventDate')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Lotes de ingressos</span>
      <input {...register('event.ticketLotsText')} placeholder="Early bird R$80, Lote 1 R$120" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-gray-300">Setores</span>
      <input {...register('event.sectorsText')} placeholder="Pista, camarote, backstage" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
    </label>
  </div>
);
