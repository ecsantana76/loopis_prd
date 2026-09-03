import { useMemo, useState } from 'react';
import { PartnerType, type PartnerType as PartnerTypeValue } from '../types';

export type PartnerOperationalStatus = 'open' | 'closed' | 'available' | 'gate_active';

export interface PartnerContextValue {
  partnerId: string;
  partnerName: string;
  partnerType: PartnerTypeValue;
  neighborhood: string;
  status: PartnerOperationalStatus;
  setStatus: (status: PartnerOperationalStatus) => void;
  setPartnerType: (type: PartnerTypeValue) => void;
}

const partnerTypeStorageKey = 'loopis-mock-partner-type';

const readPartnerType = (): PartnerTypeValue => {
  const stored = localStorage.getItem(partnerTypeStorageKey);
  if (
    stored === PartnerType.RESTAURANT ||
    stored === PartnerType.TOUR ||
    stored === PartnerType.EVENT ||
    stored === PartnerType.RENTAL
  ) {
    return stored;
  }

  return PartnerType.RESTAURANT;
};

export const usePartnerContext = (): PartnerContextValue => {
  const [partnerType, setPartnerTypeState] = useState<PartnerTypeValue>(() => readPartnerType());
  const [status, setStatus] = useState<PartnerOperationalStatus>('open');

  const setPartnerType = (type: PartnerTypeValue) => {
    localStorage.setItem(partnerTypeStorageKey, type);
    setPartnerTypeState(type);
  };

  return useMemo(
    () => ({
      partnerId: 'partner-ost-001',
      partnerName:
        partnerType === PartnerType.TOUR
          ? 'Floripa Náutica Tours'
          : partnerType === PartnerType.EVENT
            ? 'Sunset Sessions Floripa'
            : partnerType === PartnerType.RENTAL
              ? 'Arena Lagoa Beach Tennis'
              : 'Ostraria do Córrego',
      partnerType,
      neighborhood:
        partnerType === PartnerType.RENTAL
          ? 'Lagoa da Conceição'
          : partnerType === PartnerType.EVENT
            ? 'Jurerê Internacional'
            : 'Santo Antônio de Lisboa',
      status,
      setStatus,
      setPartnerType,
    }),
    [partnerType, status],
  );
};
