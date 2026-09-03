import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, CreditCard, MapPin, QrCode, ShieldCheck, Star, WalletCards } from 'lucide-react';
import { mockExperiences } from '../mocks/guestData';
import { PartnerType } from '../types';
import type { Experience as ListingExperience, LinkedRestaurantOption, LinkedRentalOption } from '../types';
import type { ExperienceDetail } from '../types/experience';
import { BookTourModal } from '../components/experience/BookTourModal';
import { ExperienceStickyActionBar } from '../components/experience/ExperienceStickyActionBar';
import { ReserveTableModal } from '../components/experience/ReserveTableModal';
import { SelectTicketsSheet } from '../components/experience/SelectTicketsSheet';
import { LinkedCrossSellingSection } from '../components/experience/LinkedCrossSellingSection';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const getPartnerTypeFromListing = (experience: ListingExperience) => {
  if (experience.macroCategory === 'Eventos/Shows' || experience.type === 'Show & Evento') return PartnerType.EVENT;
  if (experience.macroCategory === 'Tours/Roteiros' || experience.type === 'Tour & Roteiro') return PartnerType.TOUR;
  if (experience.type === 'Aventura & Mar') return PartnerType.RENTAL;
  return PartnerType.RESTAURANT;
};

const syntheticRentalExperiences: ListingExperience[] = [
  {
    id: 'rental-beach-tennis',
    title: 'Arena Lagoa Beach Tennis por Hora',
    subtitle: 'Quadras de areia com iluminação, raquetes, bolas e reserva por horário para jogar com amigos.',
    partnerId: 'arena-lagoa',
    partnerName: 'Arena Lagoa',
    macroCategory: 'Outros',
    type: 'Aventura & Mar',
    neighborhood: 'Lagoa da Conceição',
    address: 'Av. das Rendeiras, 1400 - Lagoa da Conceição',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '1h00',
    rating: 4.8,
    reviewsCount: 88,
    price: 90,
    cashbackPercent: 20,
    loopsRedeemCost: 450,
    badges: ['Quadra por hora', 'Equipamentos inclusos'],
    includedItems: ['Quadra reservada no horário escolhido', 'Raquetes e bolas disponíveis', 'Iluminação noturna', 'Vestiário e ducha'],
    description: 'Reserve quadras de beach tennis por hora na Lagoa. Escolha horário, duração, participantes e use Loops para abater o pagamento no app.',
    scheduleInfo: 'Todos os dias • 07:00 às 23:00',
    maxParticipants: 4,
  },
  {
    id: 'rental-jet-ski',
    title: 'Jet-ski Jurerê Express',
    subtitle: 'Locação assistida com instrutor, caução digital e horários livres de 30 minutos a 2 horas.',
    partnerId: 'floripa-nautica',
    partnerName: 'Floripa Náutica',
    macroCategory: 'Outros',
    type: 'Aventura & Mar',
    neighborhood: 'Jurerê Internacional',
    address: 'Servidão da Praia, 80 - Jurerê Internacional',
    imageUrl: 'https://images.unsplash.com/photo-1564417947365-8dbc9d0e718e?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1564417947365-8dbc9d0e718e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '1h00',
    rating: 4.7,
    reviewsCount: 62,
    price: 220,
    cashbackPercent: 20,
    loopsRedeemCost: 900,
    badges: ['Caução digital', 'Instrutor incluso'],
    includedItems: ['Jet-ski revisado', 'Colete salva-vidas', 'Briefing de segurança', 'Instrutor de apoio no ponto de saída'],
    description: 'Agende um horário para locação de jet-ski com operação assistida em Jurerê. O fluxo valida disponibilidade, caução e pagamento com Loops no app.',
    scheduleInfo: 'Sexta a Domingo • 09:00 às 18:00',
    maxParticipants: 2,
  },
];

const toExperienceDetail = (experience: ListingExperience): ExperienceDetail => {
  const base = {
    id: experience.id,
    partnerId: experience.partnerId,
    partnerName: experience.partnerName,
    title: experience.title,
    subtitle: experience.subtitle,
    description: experience.description,
    neighborhood: experience.neighborhood,
    address: experience.address,
    imageUrl: experience.imageUrl,
    galleryUrls: experience.galleryUrls,
    priceFrom: experience.price,
    cashbackPercent: experience.cashbackPercent,
    loopsRedeemCost: experience.loopsRedeemCost,
    tags: experience.badges,
    linkedRestaurants: experience.linkedRestaurants,
    linkedRentals: experience.linkedRentals,
  };
  const partnerType = getPartnerTypeFromListing(experience);

  if (partnerType === PartnerType.EVENT) {
    return {
      ...base,
      partner_type: PartnerType.EVENT,
      primaryAction: 'TICKET_PURCHASE',
      ticketPurchase: {
        startsAt: '2026-08-29T20:00:00',
        gateOpensAt: '19:00',
        ageRating: '16',
        ticketLots: [
          { id: 'lote-2', name: '2º Lote', price: Math.min(80, experience.price), availableQuantity: 120 },
          { id: 'vip', name: 'Setor VIP', price: experience.price, availableQuantity: 40 },
        ],
      },
    };
  }

  if (partnerType === PartnerType.TOUR) {
    return {
      ...base,
      partner_type: PartnerType.TOUR,
      primaryAction: 'SLOT_BOOKING',
      slotBooking: {
        durationMinutes: 240,
        departureTimes: ['09:00', '14:00'],
        maxCapacityPerSlot: experience.maxParticipants || 8,
        meetingPointLabel: experience.address,
      },
    };
  }

  if (partnerType === PartnerType.RENTAL) {
    return {
      ...base,
      partner_type: PartnerType.RENTAL,
      primaryAction: 'SLOT_BOOKING',
      slotBooking: {
        minimumRentalHours: 1,
        availableUnits: 4,
        requiresSecurityDeposit: true,
      },
    };
  }

  return {
    ...base,
    partner_type: PartnerType.RESTAURANT,
    primaryAction: 'RESERVATION',
    reservation: {
      acceptsPartySize: true,
      minGuests: 1,
      maxGuests: experience.maxParticipants || 8,
      availableTimes: ['19:00', '19:30', '20:00', '20:30', '21:00'],
    },
  };
};

const getJourney = (experience: ExperienceDetail) => {
  if (experience.partner_type === PartnerType.RESTAURANT) {
    return [
      ['Agende sua mesa', 'Escolha data, horário, número de pessoas e veja o bônus em Loops antes de confirmar.'],
      ['Faça o check-in', 'Ao chegar no restaurante, confirme presença pelo app ou pelo painel do parceiro.'],
      ['Lance a comanda', 'A nota ou QR Code da conta entra na reserva e mostra item a item para conferência.'],
      ['Pague do seu jeito', 'Use Loops para abater e finalize pelo app; no local o restaurante marca como pagamento local.'],
    ];
  }

  if (experience.partner_type === PartnerType.EVENT) {
    return [
      ['Escolha lote e setor', 'Selecione pista, VIP ou camarote com quantidade por lote e total em tempo real.'],
      ['Informe titulares', 'Cada ingresso fica nominal e pronto para validação na portaria.'],
      ['Use Loops no checkout', 'Abata parte do total com seu saldo e pague o restante com Pix ou cartão no app.'],
      ['Entre pelo validador', 'O QR Code é lido na portaria e registra presença no histórico.'],
    ];
  }

  if (experience.partner_type === PartnerType.RENTAL) {
    return [
      ['Escolha ativo e horário', 'Veja quadras, jet-skis ou equipamentos disponíveis por hora.'],
      ['Defina duração', 'O fluxo respeita tempo mínimo, disponibilidade e caução quando existir.'],
      ['Revise participantes', 'Inclua quem vai dividir a locação e aplique Loops antes do pagamento.'],
      ['Retire ou use no local', 'A confirmação fica salva para check-in e encerramento pelo parceiro.'],
    ];
  }

  return [
    ['Escolha a saída', 'Selecione data, horário, vagas restantes e ponto de encontro.'],
    ['Informe passageiros', 'Cadastre nome, telefone e documentos necessários para o manifesto.'],
    ['Revise inclusos', 'Confira guia, embarcação/equipamento e regras antes do pagamento.'],
    ['Pague com Loops', 'Use saldo para abater e finalize com Pix ou cartão dentro do app.'],
  ];
};

export const ExperienceDetailView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activePhoto, setActivePhoto] = useState(0);
  const [activeModal, setActiveModal] = useState<'reserve' | 'tour' | 'tickets' | null>(null);

  // Cross-selling state
  const [selectedRestaurant, setSelectedRestaurant] = useState<LinkedRestaurantOption | null>(null);
  const [selectedRestaurantTime, setSelectedRestaurantTime] = useState<string>('');
  const [selectedRentals, setSelectedRentals] = useState<LinkedRentalOption[]>([]);
  const [selectedRentalSlots, setSelectedRentalSlots] = useState<Record<string, string>>({});

  const listingExperience =
    [...mockExperiences, ...syntheticRentalExperiences].find((experience) => experience.id === id) || mockExperiences[0];
  const experience = useMemo(() => toExperienceDetail(listingExperience), [listingExperience]);
  const photos = [experience.imageUrl, ...(experience.galleryUrls || [])];

  // Cálculo consolidado de preços e Loops
  const additionalRestaurantPrice = selectedRestaurant ? selectedRestaurant.pricePerPerson : 0;
  const additionalRentalsPrice = selectedRentals.reduce((acc, r) => acc + r.price, 0);
  const totalPrice = experience.priceFrom + additionalRestaurantPrice + additionalRentalsPrice;
  const loopsEarned = Math.round((totalPrice * experience.cashbackPercent) / 100);
  const vouchersCount = 1 + (selectedRestaurant ? 1 : 0) + selectedRentals.length;

  const partnerHref = experience.partner_type === PartnerType.RESTAURANT
    ? `/restaurante/${experience.partnerId}`
    : `/parceiro/${experience.partnerId}`;
  const journey = getJourney(experience);

  const openPrimaryAction = () => {
    if (experience.partner_type === PartnerType.EVENT) setActiveModal('tickets');
    else if (experience.partner_type === PartnerType.RESTAURANT) setActiveModal('reserve');
    else setActiveModal('tour');
  };

  const handleSelectRestaurant = (rest: LinkedRestaurantOption, time?: string) => {
    setSelectedRestaurant(rest);
    if (time) setSelectedRestaurantTime(time);
    else if (rest.availableTimes && rest.availableTimes.length > 0) {
      setSelectedRestaurantTime(rest.availableTimes[0]);
    }
  };

  const handleDeselectRestaurant = () => {
    setSelectedRestaurant(null);
    setSelectedRestaurantTime('');
  };

  const handleToggleRental = (rental: LinkedRentalOption, slot?: string) => {
    setSelectedRentals((prev) => {
      const exists = prev.some((r) => r.id === rental.id);
      if (exists) {
        return prev.filter((r) => r.id !== rental.id);
      } else {
        if (slot) {
          setSelectedRentalSlots((sPrev) => ({ ...sPrev, [rental.id]: slot }));
        } else if (rental.availableSlots && rental.availableSlots.length > 0) {
          setSelectedRentalSlots((sPrev) => ({ ...sPrev, [rental.id]: rental.availableSlots![0] }));
        }
        return [...prev, rental];
      }
    });
  };

  return (
    <div className="min-h-screen bg-brand-off-white pb-24 text-brand-graphite dark:bg-brand-graphite dark:text-white">
      <section className="relative">
        <div className="aspect-[4/5] max-h-[620px] w-full overflow-hidden bg-black md:aspect-[16/7]">
          <img src={photos[activePhoto]} alt={experience.title} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <button type="button" onClick={() => navigate(-1)} className="absolute left-4 top-4 rounded-full bg-black/45 p-3 text-white backdrop-blur">
          <ArrowLeft size={20} />
        </button>
        <div className="absolute bottom-5 left-0 right-0 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-brand-graphite">
                <MapPin size={13} />
                {experience.neighborhood}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-violet px-3 py-1 text-xs font-black text-white">
                <WalletCards size={13} />
                Ganhe até {loopsEarned} Loops
              </span>
              {vouchersCount > 1 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-loopis px-3 py-1 text-xs font-black text-white shadow-sm">
                  {vouchersCount} Vouchers no Combo
                </span>
              )}
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">{experience.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">{experience.subtitle}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-white">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              4.9 • 220 avaliações • {experience.partnerName}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button key={`${photo}-${index}`} type="button" onClick={() => setActivePhoto(index)} className={`h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 ${activePhoto === index ? 'border-brand-violet' : 'border-transparent'}`}>
              <img src={photo} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_340px]">
          <article className="space-y-6">
            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/[0.04]">
              <h2 className="text-xl font-black">Descrição</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{experience.description}</p>
              <Link
                to={partnerHref}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand-violet/10 px-4 py-3 text-sm font-black text-brand-violet"
              >
                <Building2 size={17} />
                Ver página da empresa responsável
              </Link>
            </section>

            {/* SEÇÃO DE RESTAURANTES E LOCAÇÕES VINCULADOS (CROSS-SELLING) */}
            <LinkedCrossSellingSection
              linkedRestaurants={listingExperience.linkedRestaurants}
              linkedRentals={listingExperience.linkedRentals}
              selectedRestaurantId={selectedRestaurant?.id}
              selectedRentalIds={selectedRentals.map((r) => r.id)}
              selectedRestaurantTime={selectedRestaurantTime}
              selectedRentalSlots={selectedRentalSlots}
              onSelectRestaurant={handleSelectRestaurant}
              onDeselectRestaurant={handleDeselectRestaurant}
              onToggleRental={handleToggleRental}
              onRestaurantTimeChange={setSelectedRestaurantTime}
              onRentalSlotChange={(rentalId, slot) => {
                setSelectedRentalSlots((prev) => ({ ...prev, [rentalId]: slot }));
              }}
            />

            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/[0.04]">
              <h2 className="text-xl font-black">Jornada de compra</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {journey.map(([title, text], index) => (
                  <div key={title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-violet text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-3 text-sm font-black">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/[0.04]">
              <h2 className="text-xl font-black">Pagamento e Loops</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-purple-50 p-4 text-brand-violet dark:bg-brand-violet/10">
                  <WalletCards size={20} />
                  <p className="mt-3 text-sm font-black">Use Loops</p>
                  <p className="mt-1 text-xs leading-relaxed">Abata até {experience.loopsRedeemCost || 500} Loops antes de pagar.</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.03]">
                  <QrCode size={20} />
                  <p className="mt-3 text-sm font-black">Pix no app</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">QR Code e copia e cola para confirmar rápido.</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.03]">
                  <CreditCard size={20} />
                  <p className="mt-3 text-sm font-black">Cartão no app</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">Cartões ficam disponíveis apenas na jornada do cliente.</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/[0.04]">
              <h2 className="text-xl font-black">Itens inclusos na Atividade Principal</h2>
              <div className="mt-4 space-y-3">
                {listingExperience.includedItems.map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/[0.04]">
              <h2 className="flex items-center gap-2 text-xl font-black"><ShieldCheck size={20} /> Regras de cancelamento</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Cancelamento gratuito até 24 horas antes do horário reservado. Após esse prazo, a liberação de Loops promocionais pode ser retida conforme política do parceiro.
              </p>
            </section>
          </article>

          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-3xl bg-white p-5 shadow-sm border border-gray-100 dark:border-white/10 dark:bg-white/[0.04] space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total do Pacote</p>
                <p className="mt-1 text-3xl font-black text-brand-graphite dark:text-white">
                  {formatCurrency(totalPrice)}
                </p>
                <p className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  + Ganhe {loopsEarned} Loops de Cashback
                </p>
              </div>

              {/* Detalhamento do pacote selecionado */}
              <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="truncate max-w-[190px]">🎟️ {experience.title}</span>
                  <span className="font-bold">{formatCurrency(experience.priceFrom)}</span>
                </div>

                {selectedRestaurant && (
                  <div className="flex justify-between items-center text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-xl">
                    <span className="truncate max-w-[180px]">🍽️ {selectedRestaurant.name}</span>
                    <span className="font-bold">+{formatCurrency(selectedRestaurant.pricePerPerson)}</span>
                  </div>
                )}

                {selectedRentals.map((rental) => (
                  <div key={rental.id} className="flex justify-between items-center text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 p-2 rounded-xl">
                    <span className="truncate max-w-[180px]">🏄 {rental.title}</span>
                    <span className="font-bold">+{formatCurrency(rental.price)}</span>
                  </div>
                ))}
              </div>

              {/* Indicador de Emissão de Vouchers */}
              <div className="rounded-2xl bg-brand-violet/5 dark:bg-brand-violet/15 p-3 border border-brand-violet/20 text-xs">
                <div className="flex items-center justify-between font-extrabold text-brand-violet dark:text-brand-lilac">
                  <span>Vouchers a Gerar:</span>
                  <span className="bg-brand-violet text-white text-[10px] px-2 py-0.5 rounded-full">
                    {vouchersCount} {vouchersCount > 1 ? 'Vouchers' : 'Voucher'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                  {vouchersCount === 1
                    ? 'Gera 1 voucher digital com QR Code.'
                    : `Gera ${vouchersCount} vouchers individuais (um para cada atividade e restaurante).`}
                </p>
              </div>

              <button type="button" onClick={openPrimaryAction} className="w-full rounded-2xl bg-gradient-loopis py-3.5 text-sm font-black text-white shadow-lg shadow-brand-violet/25 hover:opacity-95 cursor-pointer">
                {experience.partner_type === PartnerType.EVENT ? 'Comprar Ingressos' : experience.partner_type === PartnerType.RESTAURANT ? 'Reservar Mesa' : experience.partner_type === PartnerType.RENTAL ? 'Ver Horários Livres' : 'Escolher Data e Horário'}
              </button>

              <Link to={partnerHref} className="block rounded-2xl bg-gray-50 py-3 text-center text-xs font-black text-gray-700 dark:bg-white/5 dark:text-gray-200">
                Ver empresa responsável
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <ExperienceStickyActionBar
        experience={experience}
        onPrimaryAction={openPrimaryAction}
        onSecondaryAction={() => navigate('/checkout/split?tab=split')}
      />

      {experience.partner_type === PartnerType.RESTAURANT && (
        <ReserveTableModal experience={experience} isOpen={activeModal === 'reserve'} onClose={() => setActiveModal(null)} />
      )}
      {(experience.partner_type === PartnerType.TOUR || experience.partner_type === PartnerType.RENTAL) && (
        <BookTourModal experience={experience} isOpen={activeModal === 'tour'} onClose={() => setActiveModal(null)} />
      )}
      {experience.partner_type === PartnerType.EVENT && (
        <SelectTicketsSheet experience={experience} isOpen={activeModal === 'tickets'} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};
