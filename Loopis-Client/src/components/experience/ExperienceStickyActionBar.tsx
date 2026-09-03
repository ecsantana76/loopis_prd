import React from 'react';
import { Receipt, Utensils } from 'lucide-react';
import { PartnerType } from '../../types';
import type { ExperienceDetail } from '../../types/experience';

interface ExperienceStickyActionBarProps {
  experience: ExperienceDetail;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const ExperienceStickyActionBar: React.FC<ExperienceStickyActionBarProps> = ({
  experience,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  if (experience.partner_type === PartnerType.RESTAURANT) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="grid grid-cols-[1fr_1.25fr] gap-2">
          <button type="button" onClick={onSecondaryAction} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-brand-violet/20 px-3 text-xs font-black text-brand-violet">
            <Receipt size={16} />
            Escanear Conta / Split
          </button>
          <button type="button" onClick={onPrimaryAction} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-violet px-3 text-xs font-black text-white shadow-lg">
            <Utensils size={16} />
            Reservar Mesa
          </button>
        </div>
      </div>
    );
  }

  const indicator =
    experience.partner_type === PartnerType.EVENT
      ? `${experience.ticketPurchase.ticketLots[0]?.name || 'Lote atual'} - ${formatCurrency(experience.ticketPurchase.ticketLots[0]?.price || experience.priceFrom)}`
      : experience.partner_type === PartnerType.RENTAL
        ? `${formatCurrency(experience.priceFrom)}/hora`
        : `${formatCurrency(experience.priceFrom)}/pessoa`;

  const label =
    experience.partner_type === PartnerType.EVENT
      ? 'Comprar Ingressos'
      : experience.partner_type === PartnerType.RENTAL
        ? 'Ver Horários Livres'
        : 'Escolher Data e Horário';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">A partir de</p>
          <p className="truncate text-sm font-black text-brand-graphite">{indicator}</p>
        </div>
        <button type="button" onClick={onPrimaryAction} className="min-h-12 rounded-2xl bg-brand-violet px-5 text-xs font-black text-white shadow-lg">
          {label}
        </button>
      </div>
    </div>
  );
};
