import React from 'react';
import { useLocation } from 'react-router-dom';
import { getPartnerNavigation } from '../../constants/navigation';
import { usePartnerContext } from '../../hooks/usePartnerContext';

export const PartnerPlaceholderView: React.FC = () => {
  const location = useLocation();
  const partner = usePartnerContext();
  const item = getPartnerNavigation(partner.partnerType).find((navItem) => navItem.to === location.pathname);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-lilac">Módulo operacional</p>
      <h2 className="mt-2 text-2xl font-black">{item?.label || 'Área do parceiro'}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
        {item?.description || 'Tela reservada para o fluxo específico desta vertical.'}
      </p>
    </div>
  );
};
