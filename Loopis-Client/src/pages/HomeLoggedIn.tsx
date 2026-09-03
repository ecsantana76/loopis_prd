import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Tag, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';


export const HomeLoggedIn: React.FC = () => {
  const { restaurants, loopsBalance } = useStore();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const categories = ['Todos', 'Frutos do Mar', 'Hambúrguer', 'Italiano', 'Bares', 'Cafés'];

  const filteredRestaurants = restaurants.filter(r => {
    const matchesCategory = activeCategory === 'Todos' || r.categoria === activeCategory;
    const matchesSearch = searchQuery === '' || 
      r.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.location ?? r.endereco ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const promotionalBanners = [
    { id: 1, title: 'Semana do Hambúrguer', subtitle: 'Até 30% de Cashback', color: 'from-orange-500 to-red-600', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
    { id: 2, title: 'Noite Italiana', subtitle: 'Ganhe o dobro de Loops', color: 'from-brand-violet to-brand-deep-purple', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop' },
  ];

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % promotionalBanners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in fade-in duration-500">
      {/* Header Fintech Style */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Olá, João! 👋</p>
          <h1 className="text-2xl font-bold text-brand-graphite dark:text-brand-off-white">
            Descubra Floripa
          </h1>
        </div>
        <div 
          onClick={() => navigate('/carteira')}
          className="bg-white dark:bg-[#1a1a1c] px-4 py-2 rounded-2xl flex items-center space-x-2 cursor-pointer border border-gray-100 dark:border-white/5 shadow-sm"
        >
          <Wallet size={18} className="text-brand-violet" />
          <span className="font-bold text-brand-deep-purple dark:text-brand-lilac">{loopsBalance}</span>
        </div>
      </div>

      {/* Promotional Carousel */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-md group h-48 sm:h-56">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${promotionalBanners[currentBannerIndex].color} opacity-90 z-10`} />
            <img 
              src={promotionalBanners[currentBannerIndex].image} 
              alt={promotionalBanners[currentBannerIndex].title} 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" 
            />
            <div className="relative z-20 p-6 flex flex-col justify-end h-full">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-2 w-max">
                Destaque
              </span>
              <h3 className="text-2xl font-bold text-white leading-tight">{promotionalBanners[currentBannerIndex].title}</h3>
              <p className="text-white/90 font-medium">{promotionalBanners[currentBannerIndex].subtitle}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevBanner}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextBanner}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-4 right-6 z-30 flex space-x-1.5">
          {promotionalBanners.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all ${idx === currentBannerIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} 
            />
          ))}
        </div>
      </div>

      {/* Search Bar with Location */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar restaurantes na minha região..." 
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-brand-violet outline-none transition-all shadow-sm dark:text-white text-sm"
          />
        </div>
        <button 
          className="h-full px-4 py-3.5 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-2xl text-brand-violet shadow-sm hover:bg-gray-50 flex-shrink-0"
          title="Usar minha localização atual"
        >
          <MapPin size={20} />
        </button>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat 
                ? 'bg-gradient-loopis text-white shadow-md' 
                : 'bg-white dark:bg-[#1a1a1c] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Restaurant Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredRestaurants.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/restaurante/${restaurant.id}`)}
            className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-56 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img 
                src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'} 
                alt={restaurant.nome}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                <div className="bg-brand-violet/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {restaurant.distance}
                </div>
                <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm text-black">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{(restaurant.rating ?? 0).toFixed(1)}</span>
                </div>
              </div>

              {/* Bottom Info over image */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h3 className="text-xl font-bold text-white mb-1">
                  {restaurant.nome}
                </h3>
                <div className="flex items-center text-gray-300">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-xs">{restaurant.location}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-[#1a1a1c]">
              <div className="bg-brand-lilac/10 dark:bg-brand-violet/10 border border-brand-lilac/30 dark:border-brand-violet/30 rounded-2xl p-3 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-brand-violet/20 flex items-center justify-center shrink-0">
                  <Tag size={16} className="text-brand-violet dark:text-brand-lilac" />
                </div>
                <p className="text-sm font-semibold text-brand-deep-purple dark:text-brand-lilac leading-tight">
                  {restaurant.promotion}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
