import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import {
  type FieldPath,
  type Resolver,
  type SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { PartnerType, type PartnerType as PartnerTypeValue } from '../../types';
import { CategorySelector } from './CategorySelector';
import { EventStep } from './EventStep';
import { RentalStep } from './RentalStep';
import { RestaurantStep } from './RestaurantStep';
import { TourStep } from './TourStep';

const storageKey = 'loopis-partner-wizard-draft';

const baseSchema = z.object({
  partner_type: z.enum([
    PartnerType.RESTAURANT,
    PartnerType.TOUR,
    PartnerType.EVENT,
    PartnerType.RENTAL,
  ]),
  document: z.string().min(11, 'Informe um CNPJ/CPF válido.'),
  legalName: z.string().min(2, 'Informe a razão social.'),
  tradeName: z.string().min(2, 'Informe o nome fantasia.'),
  neighborhood: z.string().min(2, 'Informe o bairro em Florianópolis.'),
  phone: z.string().min(8, 'Informe um contato válido.'),
  pixKey: z.string().min(3, 'Informe a chave Pix de repasse.'),
  commissionPercent: z.coerce.number().min(0).max(100),
  payoutRule: z.string().min(2, 'Informe a regra de repasse.'),
});

const restaurantSchema = z.object({
  tableCount: z.coerce.number().min(1, 'Informe ao menos 1 mesa.'),
  peakHoursText: z.string().min(2, 'Informe os horários de pico.'),
  operatingDaysText: z.string().min(2, 'Informe os dias de funcionamento.'),
});

const tourSchema = z.object({
  departureTimesText: z.string().min(2, 'Informe os horários de saída.'),
  boardingPoint: z.string().min(2, 'Informe o ponto de embarque.'),
  maxGroupSize: z.coerce.number().min(1, 'Informe o tamanho do grupo.'),
});

const eventSchema = z.object({
  eventName: z.string().min(2, 'Informe o nome do evento.'),
  eventDate: z.string().min(1, 'Informe a data.'),
  ticketLotsText: z.string().min(2, 'Informe os lotes.'),
  sectorsText: z.string().min(2, 'Informe os setores.'),
});

const rentalSchema = z.object({
  scheduleGridText: z.string().min(2, 'Informe a grade de horários.'),
  minimumRentalHours: z.coerce.number().min(1, 'Informe o tempo mínimo.'),
});

const wizardSchema = z.discriminatedUnion('partner_type', [
  baseSchema.extend({
    partner_type: z.literal(PartnerType.RESTAURANT),
    restaurant: restaurantSchema,
  }),
  baseSchema.extend({
    partner_type: z.literal(PartnerType.TOUR),
    tour: tourSchema,
  }),
  baseSchema.extend({
    partner_type: z.literal(PartnerType.EVENT),
    event: eventSchema,
  }),
  baseSchema.extend({
    partner_type: z.literal(PartnerType.RENTAL),
    rental: rentalSchema,
  }),
]);

const wizardResolver = zodResolver(wizardSchema) as unknown as Resolver<PartnerWizardFormData>;

export interface PartnerWizardFormData {
  partner_type: PartnerTypeValue;
  document: string;
  legalName: string;
  tradeName: string;
  neighborhood: string;
  phone: string;
  pixKey: string;
  commissionPercent: number;
  payoutRule: string;
  restaurant: {
    tableCount: number;
    peakHoursText: string;
    operatingDaysText: string;
  };
  tour: {
    departureTimesText: string;
    boardingPoint: string;
    maxGroupSize: number;
  };
  event: {
    eventName: string;
    eventDate: string;
    ticketLotsText: string;
    sectorsText: string;
  };
  rental: {
    scheduleGridText: string;
    minimumRentalHours: number;
  };
}

const defaultValues: PartnerWizardFormData = {
  partner_type: PartnerType.RESTAURANT,
  document: '',
  legalName: '',
  tradeName: '',
  neighborhood: '',
  phone: '',
  pixKey: '',
  commissionPercent: 10,
  payoutRule: 'Repasse D+14 sobre vendas confirmadas pela Loopis.',
  restaurant: {
    tableCount: 12,
    peakHoursText: '12h-14h, 19h-22h',
    operatingDaysText: 'Terça a domingo',
  },
  tour: {
    departureTimesText: '09h, 14h',
    boardingPoint: 'Trapiche central',
    maxGroupSize: 8,
  },
  event: {
    eventName: '',
    eventDate: '',
    ticketLotsText: 'Early bird, Lote 1',
    sectorsText: 'Pista, camarote',
  },
  rental: {
    scheduleGridText: 'Segunda a sábado, 08h-22h',
    minimumRentalHours: 1,
  },
};

const stepLabels = [
  'Categoria',
  'Dados gerais',
  'Configuração',
  'Comercial',
  'Conclusão',
] as const;

const isDraft = (value: unknown): value is Partial<PartnerWizardFormData> =>
  typeof value === 'object' && value !== null;

const loadDraft = (): Partial<PartnerWizardFormData> => {
  const rawDraft = localStorage.getItem(storageKey);
  if (!rawDraft) return {};

  try {
    const parsed: unknown = JSON.parse(rawDraft);
    return isDraft(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const getStepFields = (step: number, type: PartnerTypeValue): FieldPath<PartnerWizardFormData>[] => {
  if (step === 1) return ['partner_type'];
  if (step === 2) return ['document', 'legalName', 'tradeName', 'neighborhood', 'phone'];
  if (step === 4) return ['pixKey', 'commissionPercent', 'payoutRule'];

  if (type === PartnerType.RESTAURANT) {
    return ['restaurant.tableCount', 'restaurant.peakHoursText', 'restaurant.operatingDaysText'];
  }
  if (type === PartnerType.TOUR) {
    return ['tour.departureTimesText', 'tour.boardingPoint', 'tour.maxGroupSize'];
  }
  if (type === PartnerType.EVENT) {
    return ['event.eventName', 'event.eventDate', 'event.ticketLotsText', 'event.sectorsText'];
  }
  return ['rental.scheduleGridText', 'rental.minimumRentalHours'];
};

const getPartnerLabel = (type: PartnerTypeValue) => {
  if (type === PartnerType.TOUR) return 'Tour/Aventura';
  if (type === PartnerType.EVENT) return 'Evento/Festa';
  if (type === PartnerType.RENTAL) return 'Locação/Quadras';
  return 'Restaurante';
};

export const PartnerWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submittedData, setSubmittedData] = useState<PartnerWizardFormData | null>(null);
  const persistedValues = useMemo(() => ({ ...defaultValues, ...loadDraft() }), []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    trigger,
    watch,
  } = useForm<PartnerWizardFormData>({
    defaultValues: persistedValues,
    mode: 'onBlur',
    resolver: wizardResolver,
  });

  const formValues = watch();
  const partnerType = formValues.partner_type;

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleNext = async () => {
    const isStepValid = await trigger(getStepFields(step, partnerType), { shouldFocus: true });
    if (isStepValid) setStep((current) => Math.min(current + 1, 5));
  };

  const handleBack = () => setStep((current) => Math.max(current - 1, 1));

  const onSubmit: SubmitHandler<PartnerWizardFormData> = (data) => {
    const parsed = wizardSchema.parse(data);
    const normalizedData = { ...data, ...parsed };
    setSubmittedData(normalizedData);
    localStorage.removeItem(storageKey);
    setStep(5);
  };

  const fieldError = Object.values(errors).at(0)?.message;

  return (
    <section className="min-h-screen bg-brand-graphite px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {stepLabels.map((label, index) => {
              const number = index + 1;
              const isActive = step === number;
              const isDone = step > number;

              return (
                <div key={label} className="flex min-w-[140px] flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${isDone || isActive ? 'bg-brand-violet text-white' : 'bg-white/10 text-gray-400'}`}>
                    {isDone ? <CheckCircle2 size={15} /> : number}
                  </span>
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 shadow-xl sm:p-6">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-lilac">Passo 1</p>
                  <h1 className="mt-2 text-2xl font-black">Seleção de categoria</h1>
                </div>
                <CategorySelector
                  value={partnerType}
                  onChange={(type) => setValue('partner_type', type, { shouldDirty: true, shouldValidate: true })}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-lilac">Passo 2</p>
                  <h1 className="mt-2 text-2xl font-black">Dados gerais & localização</h1>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">CNPJ/CPF</span>
                    <input {...register('document')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">Contato</span>
                    <input {...register('phone')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">Razão social</span>
                    <input {...register('legalName')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">Nome fantasia</span>
                    <input {...register('tradeName')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                  <label className="sm:col-span-2 space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">Bairro em Florianópolis</span>
                    <input {...register('neighborhood')} placeholder="Santo Antônio de Lisboa" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-lilac">Passo 3</p>
                  <h1 className="mt-2 text-2xl font-black">Configuração de {getPartnerLabel(partnerType)}</h1>
                </div>
                {partnerType === PartnerType.RESTAURANT && <RestaurantStep register={register} />}
                {partnerType === PartnerType.TOUR && <TourStep register={register} />}
                {partnerType === PartnerType.EVENT && <EventStep register={register} />}
                {partnerType === PartnerType.RENTAL && <RentalStep register={register} />}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-lilac">Passo 4</p>
                  <h1 className="mt-2 text-2xl font-black">Regras comerciais & Pix</h1>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">Chave Pix para repasses</span>
                    <input {...register('pixKey')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">Comissão Loopis (%)</span>
                    <input type="number" min={0} max={100} {...register('commissionPercent', { valueAsNumber: true })} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                  <label className="sm:col-span-2 space-y-1.5">
                    <span className="text-xs font-bold text-gray-300">Regra comercial de repasse</span>
                    <textarea rows={3} {...register('payoutRule')} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet" />
                  </label>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="mb-5 rounded-full bg-emerald-500/15 p-5 text-emerald-300">
                  <CheckCircle2 size={44} />
                </div>
                <h1 className="text-3xl font-black">Cadastro concluído</h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
                  {submittedData?.tradeName || formValues.tradeName || 'Parceiro'} foi salvo como {getPartnerLabel(partnerType)} para análise da operação Loopis.
                </p>
              </div>
            )}

            {fieldError && step < 5 && (
              <p className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-200">
                {fieldError}
              </p>
            )}

            {step < 5 && (
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <button type="button" onClick={handleBack} disabled={step === 1} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronLeft size={16} />
                  Voltar
                </button>
                {step === 4 ? (
                  <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-5 py-2.5 text-xs font-black text-white shadow-lg transition hover:bg-brand-violet/90">
                    Concluir cadastro
                    <CheckCircle2 size={16} />
                  </button>
                ) : (
                  <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-5 py-2.5 text-xs font-black text-white shadow-lg transition hover:bg-brand-violet/90">
                    Continuar
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl">
              <div className="h-36 bg-gradient-to-br from-brand-violet via-indigo-700 to-emerald-500" />
              <div className="p-5">
                <div className="-mt-12 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-brand-graphite bg-black text-brand-lilac shadow-lg">
                  <Sparkles size={30} />
                </div>
                <span className="rounded-full bg-brand-violet/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-lilac">
                  {getPartnerLabel(partnerType)}
                </span>
                <h2 className="mt-3 text-xl font-black">{formValues.tradeName || 'Nome do parceiro'}</h2>
                <p className="mt-1 text-xs text-gray-400">{formValues.neighborhood || 'Bairro em Florianópolis'}</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-300">
                  Perfil em prévia para o app do turista, com destaque para reservas, agenda, ingressos ou locação conforme a categoria escolhida.
                </p>
                <div className="mt-5 rounded-2xl bg-black/30 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Ação principal</p>
                  <p className="mt-1 text-sm font-black text-white">
                    {partnerType === PartnerType.EVENT ? 'Comprar ingresso' : partnerType === PartnerType.RESTAURANT ? 'Reservar mesa' : 'Reservar horário'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
};
