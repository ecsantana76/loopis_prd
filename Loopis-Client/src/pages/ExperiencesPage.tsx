import React, { useState } from 'react';
import { Sparkles, Search, MapPin, Gift } from 'lucide-react';
import { mockExperiences, mockNeighborhoods, mockHeroBanners, mockInterstitialBanner } from '../mocks/guestData';
import { ExperienceCard } from '../components/experiences/ExperienceCard';
import { ExperienceBookingModal } from '../components/experiences/ExperienceBookingModal';
import { NeighborhoodExplorer } from '../components/discovery/NeighborhoodExplorer';
import { AdBannerSlot } from '../components/guest/AdBannerSlot';
import { useStore } from '../store/useStore';
import type { Experience } from '../types';

export const ExperiencesPage: React.FC = () => {
  const { isLoggedIn, loopsBalance } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const experienceTypes = [
    'Todos',
    'Gastronomia',
    'Sunset & Drinks',
    'Tour & Roteiro',
    'Harmonização',
    'Show & Evento',
    'Workshop & Aula',
  ];

  const filteredExperiences = mockExperiences.filter((exp) => {
    const matchesSearch =
      searchQuery === '' ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'Todos' || exp.type === selectedType;

    const matchesNeighborhood =
      selectedNeighborhood === 'Todos' ||
      exp.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());

    return matchesSearch && matchesType && matchesNeighborhood;
  });

  const handleBook = (exp: Experience) => {
    setSelectedExperience(exp);
    setIsBookingOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 pb-16 pt-4 animate-in fade-in duration-500">
      {/* Hero Header Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-deep-purple via-brand-graphite to-black text-white p-8 sm:p-12 shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-brand-violet/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-brand-lilac text-xs font-extrabold border border-white/15">
            <Sparkles size={14} className="text-brand-lilac animate-spin-slow" />
            <span>Catálogo Exclusivo de Experiências Loopis</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">
            Viva momentos gastronômicos únicos com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-loopis">
              Cashback & Loops
            </span>
            .
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            De degustações com chefs renomados a passeios de lancha com ostras frescas ao pôr do sol. Compre diretamente pelo app e escolha quantos Loops deseja usar no pagamento individual.
          </p>

          {isLoggedIn && (
            <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-brand-lilac bg-white/5 p-3 rounded-2xl border border-white/10 w-fit">
              <Gift size={15} />
              <span>Você possui {loopsBalance} Loops disponíveis para usar nas suas próximas compras.</span>
            </div>
          )}
        </div>
      </section>

      {/* Espaço Publicitário em Destaque no Explorar */}
      <section>
        <AdBannerSlot
          type="hero"
          banners={mockHeroBanners}
          className="shadow-xl"
        />
      </section>

      {/* Search & Multi-Filters Toolbar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por experiência, chef, tipo ou bairro..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-gray-200/80 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-violet text-brand-graphite dark:text-white shadow-sm"
            />
          </div>

          {/* Neighborhood Quick Filter */}
          <div className="flex items-center space-x-2 bg-white dark:bg-[#1a1a1c] border border-gray-200/80 dark:border-white/10 rounded-2xl px-3 py-2 shadow-sm">
            <MapPin size={16} className="text-brand-violet shrink-0" />
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="bg-transparent text-xs font-bold text-brand-graphite dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="Todos" className="dark:bg-[#1a1a1c]">Todos os Bairros</option>
              {mockNeighborhoods.map((n) => (
                <option key={n.id} value={n.name} className="dark:bg-[#1a1a1c]">
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience Type Pills */}
        <div className="flex space-x-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {experienceTypes.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-loopis text-white shadow-md shadow-brand-violet/30 scale-[1.02]'
                    : 'bg-white dark:bg-[#1a1a1c] text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-white/10 hover:border-brand-violet/40 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <span>{type}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles size={20} className="text-brand-violet" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white">
              Experiências Disponíveis ({filteredExperiences.length})
            </h2>
          </div>

          {(selectedType !== 'Todos' || selectedNeighborhood !== 'Todos' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedType('Todos');
                setSelectedNeighborhood('Todos');
                setSearchQuery('');
              }}
              className="text-xs text-brand-violet dark:text-brand-lilac font-bold hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#1a1a1c] rounded-3xl border border-gray-200/60 dark:border-white/10 space-y-3">
            <Sparkles size={36} className="mx-auto text-gray-400" />
            <h3 className="text-base font-bold text-brand-graphite dark:text-white">
              Nenhuma experiência encontrada
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Tente selecionar outro bairro ou limpe a busca para visualizar todas as experiências disponíveis.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('Todos');
                setSelectedNeighborhood('Todos');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-violet text-white text-xs font-bold shadow-md hover:opacity-95"
            >
              Ver todas as experiências
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </section>

      {/* Espaço Publicitário Intersticial no Explorar */}
      <section className="pt-2">
        <AdBannerSlot
          type="interstitial"
          singleBanner={mockInterstitialBanner}
        />
      </section>

      {/* Module "O que fazer no bairro" embedded for deep local exploration */}
      <div className="pt-6">
        <NeighborhoodExplorer />
      </div>

      {/* Booking and Redeem Modal */}
      <ExperienceBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        experience={selectedExperience}
      />
    </div>
  );
};
