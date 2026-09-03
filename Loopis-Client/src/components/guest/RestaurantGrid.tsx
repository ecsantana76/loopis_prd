import React, { useState } from 'react';
import { Search, Flame, Sparkles, UtensilsCrossed, SlidersHorizontal, Compass, Ticket, Map, Utensils, Tag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RestaurantCard } from './RestaurantCard';
import { AdBannerSlot } from './AdBannerSlot';
import { NeighborhoodExplorer } from '../discovery/NeighborhoodExplorer';
import { mockMacroCategories, mockExperiences } from '../../mocks/guestData';
import { ExperienceCard } from '../experiences/ExperienceCard';
import { ExperienceBookingModal } from '../experiences/ExperienceBookingModal';
import type { GuestRestaurant, Category, AdBanner, PartnerMacroCategory, Experience } from '../../types';

interface RestaurantGridProps {
  restaurants: GuestRestaurant[];
  categories: Category[];
  interstitialBanner?: AdBanner;
  onRestaurantClick: (restaurant: GuestRestaurant) => void;
  onBannerClick?: (banner: AdBanner) => void;
}

export const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  restaurants,
  categories,
  interstitialBanner,
  onRestaurantClick,
  onBannerClick,
}) => {
  const navigate = useNavigate();
  const [selectedMacroCategory, setSelectedMacroCategory] = useState<PartnerMacroCategory>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Filtering
  const filtered = restaurants.filter((r) => {
    const matchesMacro =
      selectedMacroCategory === 'Todos' ||
      r.macroCategory === selectedMacroCategory ||
      (selectedMacroCategory === 'Restaurantes & Gastronomia' && (!r.macroCategory || r.macroCategory === 'Restaurantes & Gastronomia'));

    const matchesCategory =
      selectedCategory === 'Todos' ||
      r.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Frutos do Mar' && r.category.includes('Frutos do Mar')) ||
      (selectedCategory === 'Hamburguerias' && r.category.includes('Hamburguer')) ||
      (selectedCategory === 'Italiana & Pizzas' && (r.category.includes('Italiana') || r.category.includes('Pizza'))) ||
      (selectedCategory === 'Japonesa & Fusion' && (r.category.includes('Japonesa') || r.category.includes('Sushi'))) ||
      (selectedCategory === 'Bares & Petiscos' && (r.category.includes('Bares') || r.category.includes('Boteco'))) ||
      (selectedCategory === 'Cafés & Bistrôs' && (r.category.includes('Café') || r.category.includes('Bistrô')));

    const matchesSearch =
      searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMacro && matchesCategory && matchesSearch;
  });

  // Experiences matching the current filter (if Macro Category is 'Experiências', 'Tours/Roteiros' or 'Eventos/Shows')
  const matchingExperiences = mockExperiences.filter((exp) => {
    const matchesMacro =
      selectedMacroCategory === 'Todos' ||
      exp.macroCategory === selectedMacroCategory ||
      (selectedMacroCategory === 'Experiências' && (exp.macroCategory === 'Experiências' || exp.macroCategory === 'Tours/Roteiros')) ||
      (selectedMacroCategory === 'Tours/Roteiros' && exp.macroCategory === 'Tours/Roteiros') ||
      (selectedMacroCategory === 'Eventos/Shows' && exp.macroCategory === 'Eventos/Shows');

    const matchesSearch =
      searchQuery === '' ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMacro && matchesSearch;
  });

  const popularList = restaurants.filter((r) => r.isPopular).slice(0, 4);
  const weeklyHighlights = restaurants.filter((r) => r.isWeeklyHighlight).slice(0, 4);

  const isFiltering =
    selectedMacroCategory !== 'Todos' ||
    selectedCategory !== 'Todos' ||
    searchQuery.trim().length > 0;

  const getMacroIcon = (name: PartnerMacroCategory) => {
    switch (name) {
      case 'Restaurantes & Gastronomia':
        return <Utensils size={15} />;
      case 'Experiências':
        return <Sparkles size={15} />;
      case 'Tours/Roteiros':
        return <Map size={15} />;
      case 'Eventos/Shows':
        return <Ticket size={15} />;
      case 'Outros':
        return <Tag size={15} />;
      default:
        return <Compass size={15} />;
    }
  };

  const handleBookExperience = (exp: Experience) => {
    setSelectedExperience(exp);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* 1. Partner Macro Categories Filter Tabs (Classificação Geral) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass size={18} className="text-brand-violet" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Categorias de Parceiros & Serviços
            </h3>
          </div>
        </div>

        {/* Macro Category Pills Bar */}
        <div className="flex space-x-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {mockMacroCategories.map((macro) => {
            const isSelected = selectedMacroCategory === macro.id;
            return (
              <button
                key={macro.id}
                type="button"
                onClick={() => {
                  setSelectedMacroCategory(macro.id);
                  if (macro.id === 'Experiências') {
                    // Quick option to view experiences
                  }
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-loopis text-white shadow-lg shadow-brand-violet/25 scale-[1.02]'
                    : 'bg-white dark:bg-[#1a1a1c] text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-white/10 hover:border-brand-violet/40 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {getMacroIcon(macro.id)}
                <span>{macro.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {macro.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Search & Sub-Category Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por parceiro, prato, culinária, experiência ou bairro..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1a1a1c] rounded-2xl border border-gray-200/80 dark:border-white/10 text-xs sm:text-sm font-medium outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-semibold px-2">
            <SlidersHorizontal size={14} />
            <span>
              {filtered.length + (selectedMacroCategory === 'Experiências' || selectedMacroCategory === 'Tours/Roteiros' || selectedMacroCategory === 'Eventos/Shows' ? matchingExperiences.length : 0)} itens encontrados
            </span>
          </div>
        </div>

        {/* Sub-Categories Horizontal Scroll (When on Gastronomia or Todos) */}
        {(selectedMacroCategory === 'Todos' || selectedMacroCategory === 'Restaurantes & Gastronomia') && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-violet text-white shadow-md shadow-brand-violet/30 scale-105'
                      : 'bg-white dark:bg-[#1a1a1c] text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-white/10 hover:border-brand-violet/40'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.count && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Módulo "O que fazer no bairro" (Descoberta Local) */}
      {!isFiltering && (
        <NeighborhoodExplorer />
      )}

      {/* 4. Filtered Results or Default Showcase */}
      {isFiltering ? (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed size={20} className="text-brand-violet" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white">
                Resultados para {selectedMacroCategory !== 'Todos' ? `"${selectedMacroCategory}"` : ''} {searchQuery ? `"${searchQuery}"` : ''} {selectedCategory !== 'Todos' ? `em "${selectedCategory}"` : ''}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedMacroCategory('Todos');
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="text-xs text-brand-violet dark:text-brand-lilac font-bold hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>

          {/* Show matching experiences if relevant macro category or query */}
          {matchingExperiences.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles size={18} className="text-brand-violet" />
                <h3 className="text-lg font-bold text-brand-graphite dark:text-white">
                  Experiências & Vivências ({matchingExperiences.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingExperiences.map((exp) => (
                  <ExperienceCard
                    key={exp.id}
                    experience={exp}
                    onBook={handleBookExperience}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Show matching partner restaurants */}
          {filtered.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Utensils size={18} className="text-brand-violet" />
                <h3 className="text-lg font-bold text-brand-graphite dark:text-white">
                  Parceiros Gastronômicos ({filtered.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={onRestaurantClick}
                  />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && matchingExperiences.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-[#1a1a1c] rounded-3xl border border-gray-200/60 dark:border-white/10 space-y-3">
              <UtensilsCrossed size={36} className="mx-auto text-gray-400" />
              <h3 className="text-base font-bold text-brand-graphite dark:text-white">
                Nenhum parceiro ou experiência encontrada
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Tente buscar por outro termo ou selecione a categoria "Todos" para visualizar todas as opções disponíveis.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedMacroCategory('Todos');
                  setSelectedCategory('Todos');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-brand-violet text-white text-xs font-bold shadow-md hover:opacity-95 cursor-pointer"
              >
                Ver todos os parceiros
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Default Showcase Sections */
        <>
          {/* Section 1: Mais Populares */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Flame size={18} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white">
                    Mais Populares na Ilha
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Os preferidos dos clientes Loopis com maior acúmulo de pontos
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularList.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={onRestaurantClick}
                />
              ))}
            </div>
          </section>

          {/* Section 2: Destaques de Experiências Exclusivas */}
          <section className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white flex items-center space-x-2">
                    <span>Experiências em Destaque</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-violet text-white font-bold hidden sm:inline-block">
                      Novo Menu
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Vivências únicas para reservar sem taxa e pagar com cashback ou saldo de Loops
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/experiencias')}
                className="text-xs font-bold text-brand-violet dark:text-brand-lilac hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Ver todas ({mockExperiences.length})</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockExperiences.slice(0, 3).map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  onBook={handleBookExperience}
                />
              ))}
            </div>
          </section>

          {/* Interstitial Ad Banner Slot (between sections) */}
          {interstitialBanner && (
            <div className="py-2">
              <AdBannerSlot
                type="interstitial"
                singleBanner={interstitialBanner}
                onBannerClick={onBannerClick}
              />
            </div>
          )}

          {/* Section 3: Destaques da Semana */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white">
                    Destaques da Semana
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ofertas especiais com até 25% de cashback e benefícios exclusivos
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {weeklyHighlights.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={onRestaurantClick}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Booking and Redeem Modal for Experiences */}
      <ExperienceBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        experience={selectedExperience}
      />
    </div>
  );
};
