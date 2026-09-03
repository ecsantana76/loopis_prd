import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarClock,
  Compass,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Utensils,
  Wallet,
  Waves,
} from 'lucide-react';
import { GuestHeader } from '../components/guest/GuestHeader';
import { Header } from '../components/Header';
import { AuthGateModal } from '../components/guest/AuthGateModal';
import { AdBannerSlot } from '../components/guest/AdBannerSlot';
import { useStore } from '../store/useStore';
import { mockExperiences, mockGuestRestaurants, mockHeroBanners, mockInterstitialBanner } from '../mocks/guestData';
import type { AuthModalState, GuestRestaurant } from '../types';

type ClientVertical = 'all' | 'restaurant' | 'tour' | 'event' | 'rental';

interface DiscoveryItem {
  id: string;
  title: string;
  subtitle: string;
  partnerName: string;
  neighborhood: string;
  imageUrl: string;
  vertical: Exclude<ClientVertical, 'all'>;
  priceLabel: string;
  loopsLabel: string;
  rating: number;
  cta: string;
  href: string;
}

const verticals: Array<{ id: ClientVertical; label: string; shortLabel: string; icon: React.ReactNode }> = [
  { id: 'all', label: 'Tudo em Floripa', shortLabel: 'Tudo', icon: <Compass size={16} /> },
  { id: 'restaurant', label: 'Restaurantes', shortLabel: 'Comer', icon: <Utensils size={16} /> },
  { id: 'tour', label: 'Tours & Aventuras', shortLabel: 'Passear', icon: <Waves size={16} /> },
  { id: 'event', label: 'Eventos & Festas', shortLabel: 'Curtir', icon: <Ticket size={16} /> },
  { id: 'rental', label: 'Locações', shortLabel: 'Alugar', icon: <CalendarClock size={16} /> },
];

const journeyCards = [
  {
    vertical: 'restaurant' as const,
    title: 'Jantar hoje',
    text: 'Mesa, comanda, cashback e split.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=700',
  },
  {
    vertical: 'tour' as const,
    title: 'Passeio na água',
    text: 'Saídas com vagas e passageiros.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=700',
  },
  {
    vertical: 'event' as const,
    title: 'Noite e eventos',
    text: 'Lotes, setores e ingresso rápido.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=700',
  },
  {
    vertical: 'rental' as const,
    title: 'Alugar por hora',
    text: 'Quadras, jet-ski e equipamentos.',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=700',
  },
];

const trustCards = [
  {
    title: 'Reserve e ganhe',
    text: 'Toda jornada deixa claro quantos Loops você pode acumular.',
  },
  {
    title: 'Divida com amigos',
    text: 'Comanda, lancha, camarote ou quadra podem ser rateados pelo Split.',
  },
  {
    title: 'Use sem atrito',
    text: 'Fluxos guest por WhatsApp ajudam quem ainda não tem conta.',
  },
];

const formatLoops = (price: number, cashbackPercent: number) =>
  `Ganhe até ${Math.round((price * cashbackPercent) / 100)} Loops`;

export const GuestLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loopsBalance, openLoginModal } = useStore();
  const [activeVertical, setActiveVertical] = useState<ClientVertical>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalState, setAuthModalState] = useState<AuthModalState>({
    isOpen: false,
    selectedRestaurant: null,
    initialMode: 'register',
    triggerSource: 'card_click',
  });

  const discoveryItems = useMemo<DiscoveryItem[]>(() => {
    const restaurantItems = mockGuestRestaurants.slice(0, 4).map((restaurant) => ({
      id: restaurant.id,
      title: restaurant.name,
      subtitle: restaurant.promotionBadge || restaurant.category,
      partnerName: restaurant.category,
      neighborhood: restaurant.location,
      imageUrl: restaurant.imageUrl,
      vertical: 'restaurant' as const,
      priceLabel: restaurant.estimatedTime || 'Mesa disponível',
      loopsLabel: `Até ${restaurant.cashbackPercent}% de volta`,
      rating: restaurant.rating,
      cta: 'Reservar mesa',
      href: `/restaurante/${restaurant.id}`,
    }));

    const experienceItems = mockExperiences.slice(0, 7).map((experience) => {
      const vertical: DiscoveryItem['vertical'] =
        experience.macroCategory === 'Eventos/Shows'
          ? 'event'
          : experience.macroCategory === 'Tours/Roteiros'
            ? 'tour'
            : 'restaurant';

      return {
        id: experience.id,
        title: experience.title,
        subtitle: experience.subtitle,
        partnerName: experience.partnerName,
        neighborhood: experience.neighborhood,
        imageUrl: experience.imageUrl,
        vertical,
        priceLabel:
          vertical === 'event'
            ? `Lote atual R$ ${experience.price.toFixed(0)}`
            : `R$ ${experience.price.toFixed(0)}/pessoa`,
        loopsLabel: formatLoops(experience.price, experience.cashbackPercent),
        rating: experience.rating,
        cta: vertical === 'event' ? 'Comprar ingresso' : vertical === 'tour' ? 'Escolher saída' : 'Ver detalhes',
        href: `/experience/${experience.id}`,
      };
    });

    const rentalItems: DiscoveryItem[] = [
      {
        id: 'rental-beach-tennis',
        title: 'Arena Lagoa Beach Tennis',
        subtitle: 'Quadras de areia com iluminação, raquetes e bolas inclusas.',
        partnerName: 'Arena Lagoa',
        neighborhood: 'Lagoa da Conceição',
        imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=900',
        vertical: 'rental',
        priceLabel: 'R$ 90/hora',
        loopsLabel: 'Ganhe 18 Loops',
        rating: 4.8,
        cta: 'Ver horários',
        href: '/experience/rental-beach-tennis',
      },
      {
        id: 'rental-jet-ski',
        title: 'Jet-ski Jurerê Express',
        subtitle: 'Locação assistida com instrutor, caução digital e slots de 30 min.',
        partnerName: 'Floripa Náutica',
        neighborhood: 'Jurerê Internacional',
        imageUrl: 'https://images.unsplash.com/photo-1564417947365-8dbc9d0e718e?auto=format&fit=crop&q=80&w=900',
        vertical: 'rental',
        priceLabel: 'R$ 220/hora',
        loopsLabel: 'Ganhe 44 Loops',
        rating: 4.7,
        cta: 'Reservar ativo',
        href: '/experience/rental-jet-ski',
      },
    ];

    return [...restaurantItems, ...experienceItems, ...rentalItems];
  }, []);

  const filteredItems = discoveryItems.filter((item) => {
    const matchesVertical = activeVertical === 'all' || item.vertical === activeVertical;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.neighborhood.toLowerCase().includes(q) ||
      item.partnerName.toLowerCase().includes(q);
    return matchesVertical && matchesSearch;
  });
  const featuredItem = filteredItems[0] || discoveryItems[0];
  const secondaryItems = filteredItems.slice(1);

  useEffect(() => {
    if (window.location.hash !== '#explorar') return;
    window.requestAnimationFrame(() => {
      document.getElementById('explorar')?.scrollIntoView({ block: 'start' });
    });
  }, []);

  const handleOpenAuthModal = (
    restaurant: GuestRestaurant | null = null,
    mode: 'login' | 'register' = 'register',
    source: AuthModalState['triggerSource'] = 'card_click',
  ) => {
    setAuthModalState({ isOpen: true, selectedRestaurant: restaurant, initialMode: mode, triggerSource: source });
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] text-brand-graphite dark:bg-[#111114] dark:text-white">
      {isLoggedIn ? (
        <Header />
      ) : (
        <GuestHeader
          onOpenLogin={() => handleOpenAuthModal(null, 'login', 'header_login')}
          onOpenRegister={() => handleOpenAuthModal(null, 'register', 'header_register')}
        />
      )}

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-black text-white shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1600"
              alt="Passeio em Florianópolis"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
            <div className="relative flex min-h-[440px] flex-col justify-end p-5 sm:p-8">
              <div className="mb-5 flex w-max items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black backdrop-blur">
                <Sparkles size={14} />
                {isLoggedIn ? `${loopsBalance} Loops para usar hoje` : '+50 Loops no primeiro cadastro'}
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.02] sm:text-6xl">
                Floripa inteira em uma carteira de experiências.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                Reserve mesa, compre ingresso, escolha passeio, alugue quadra ou equipamento e divida tudo com amigos usando Pix, WhatsApp e Loops.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#explorar"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-brand-graphite shadow-lg"
                >
                  Ver opções
                  <ArrowRight size={17} />
                </a>
                <button
                  type="button"
                  onClick={() => navigate('/carteira')}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 text-sm font-black text-white backdrop-blur"
                >
                  <Wallet size={17} />
                  Minha carteira
                </button>
              </div>
            </div>
          </div>

          <aside className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {journeyCards.map((journey) => (
              <button
                key={journey.vertical}
                type="button"
                onClick={() => setActiveVertical(journey.vertical)}
                className="group relative min-h-[132px] overflow-hidden rounded-3xl bg-black text-left shadow-sm"
              >
                <img src={journey.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="relative flex h-full min-h-[132px] flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/70">{journey.text}</span>
                  <span className="mt-1 text-base font-black leading-tight">{journey.title}</span>
                </div>
              </button>
            ))}
          </aside>
        </section>

        <section className="sticky top-0 z-20 -mx-4 mt-5 bg-[#f7f7fb]/92 px-4 py-3 backdrop-blur dark:bg-[#111114]/92 sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-0">
          <div className="rounded-3xl border border-gray-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#1a1a1f]">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {verticals.map((vertical) => (
                <button
                  key={vertical.id}
                  type="button"
                  onClick={() => setActiveVertical(vertical.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                    activeVertical === vertical.id
                      ? 'bg-brand-violet text-white shadow-lg shadow-brand-violet/20'
                      : 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300'
                  }`}
                >
                  {vertical.icon}
                  <span className="hidden sm:inline">{vertical.label}</span>
                  <span className="sm:hidden">{vertical.shortLabel}</span>
                </button>
              ))}
            </div>
            <div className="relative mt-2">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar por bairro, experiência, parceiro..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-violet dark:border-white/10 dark:bg-black/25 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Espaço Publicitário em Destaque (Hero Banner Carousel) */}
        <section className="mt-6">
          <AdBannerSlot
            type="hero"
            banners={mockHeroBanners}
            onBannerClick={(banner) => {
              if (banner.targetUrl) navigate(banner.targetUrl);
            }}
          />
        </section>

        <section id="explorar" className="mt-8 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Escolha sua próxima saída</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tudo já separado por intenção: comer, passear, curtir ou alugar por hora.
              </p>
            </div>
            <span className="hidden rounded-full bg-brand-violet/10 px-3 py-1 text-xs font-black text-brand-violet sm:inline">
              {filteredItems.length} opções
            </span>
          </div>

          {featuredItem && (
            <button
              type="button"
              onClick={() => navigate(featuredItem.href)}
              className="mt-5 grid overflow-hidden rounded-[28px] bg-white text-left shadow-sm ring-1 ring-gray-200 transition hover:shadow-xl dark:bg-[#1a1a1f] dark:ring-white/10 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="relative min-h-[280px] bg-black">
                <img src={featuredItem.imageUrl} alt={featuredItem.title} className="absolute inset-0 h-full w-full object-cover opacity-88" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/35" />
                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black text-brand-graphite">
                  Recomendado agora
                </div>
              </div>
              <div className="flex flex-col justify-between p-5 sm:p-7">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-violet/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-violet">
                    {verticals.find((vertical) => vertical.id === featuredItem.vertical)?.label}
                  </span>
                  <h3 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">{featuredItem.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{featuredItem.subtitle}</p>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Bairro</p>
                      <p className="mt-1 truncate text-xs font-black">{featuredItem.neighborhood}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Valor</p>
                      <p className="mt-1 truncate text-xs font-black">{featuredItem.priceLabel}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Loops</p>
                      <p className="mt-1 truncate text-xs font-black text-brand-violet">{featuredItem.loopsLabel}</p>
                    </div>
                  </div>
                  <div className="flex min-h-12 items-center justify-center rounded-2xl bg-brand-violet text-sm font-black text-white">
                    {featuredItem.cta}
                  </div>
                </div>
              </div>
            </button>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {secondaryItems.map((item) => (
              <button
                key={`${item.vertical}-${item.id}`}
                type="button"
                onClick={() => navigate(item.href)}
                className="group grid grid-cols-[112px_1fr] overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#1a1a1f] dark:ring-white/10 sm:grid-cols-[136px_1fr]"
              >
                <div className="relative h-full min-h-[150px] overflow-hidden bg-black">
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute left-2 top-2 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black text-brand-graphite">
                    {verticals.find((vertical) => vertical.id === item.vertical)?.shortLabel}
                  </div>
                </div>
                <div className="flex min-w-0 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] font-bold text-gray-500">{item.neighborhood}</p>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-[11px] font-black text-yellow-700">
                      <Star size={13} className="fill-yellow-500 text-yellow-500" />
                      {item.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs font-black">{item.priceLabel}</p>
                      <p className="text-[11px] font-bold text-brand-violet">{item.loopsLabel}</p>
                    </div>
                    <ArrowRight size={17} className="shrink-0 text-brand-violet" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Espaço Publicitário Intersticial / Patrocinado */}
          <div className="mt-8">
            <AdBannerSlot
              type="interstitial"
              singleBanner={mockInterstitialBanner}
              onBannerClick={(banner) => {
                if (banner.targetUrl) navigate(banner.targetUrl);
              }}
            />
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {trustCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <ShieldCheck size={22} className="text-brand-violet" />
              <h3 className="mt-4 text-base font-black">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{card.text}</p>
            </div>
          ))}
        </section>
      </main>

      <AuthGateModal
        isOpen={authModalState.isOpen}
        onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
        selectedRestaurant={authModalState.selectedRestaurant}
        onSelectLogin={() => {
          setAuthModalState((prev) => ({ ...prev, isOpen: false }));
          openLoginModal();
        }}
        onSelectRegister={() => {
          setAuthModalState((prev) => ({ ...prev, isOpen: false }));
          openLoginModal();
        }}
      />
    </div>
  );
};
