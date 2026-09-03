import React, { useState } from 'react';
import { Search, Flame, Sparkles, UtensilsCrossed, SlidersHorizontal } from 'lucide-react';
import { RestaurantCard } from './RestaurantCard';
import { AdBannerSlot } from './AdBannerSlot';
import type { GuestRestaurant, Category, AdBanner } from '../../types';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = restaurants.filter((r) => {
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

    return matchesCategory && matchesSearch;
  });

  const popularList = restaurants.filter((r) => r.isPopular).slice(0, 4);
  const weeklyHighlights = restaurants.filter((r) => r.isWeeklyHighlight).slice(0, 4);

  const isFiltering = selectedCategory !== 'Todos' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por parceiro, culinária ou bairro..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1a1a1c] rounded-2xl border border-gray-200/80 dark:border-white/10 text-xs sm:text-sm font-medium outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-semibold px-2">
            <SlidersHorizontal size={14} />
            <span>{filtered.length} parceiros encontrados</span>
          </div>
        </div>

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
      </div>

      {isFiltering ? (
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <UtensilsCrossed size={20} className="text-brand-violet" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white">
              Resultados para "{searchQuery || selectedCategory}"
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#1a1a1c] rounded-3xl border border-gray-200/60 dark:border-white/10 space-y-3">
              <UtensilsCrossed size={36} className="mx-auto text-gray-400" />
              <h3 className="text-base font-bold text-brand-graphite dark:text-white">
                Nenhum parceiro encontrado
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Tente buscar por outro termo ou selecione a categoria "Todos" para visualizar todos os parceiros.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-brand-violet text-white text-xs font-bold shadow-md hover:opacity-95"
              >
                Ver todos os parceiros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={onRestaurantClick}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
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

          {interstitialBanner && (
            <div className="py-2">
              <AdBannerSlot
                type="interstitial"
                singleBanner={interstitialBanner}
                onBannerClick={onBannerClick}
              />
            </div>
          )}

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
    </div>
  );
};
