import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Sparkles, Utensils, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockNeighborhoods, mockGuestRestaurants, mockExperiences } from '../../mocks/guestData';
import type { NeighborhoodInfo } from '../../types';

interface NeighborhoodExplorerProps {
  selectedNeighborhoodId?: string;
  onSelectNeighborhood?: (neighborhood: NeighborhoodInfo) => void;
  className?: string;
}

export const NeighborhoodExplorer: React.FC<NeighborhoodExplorerProps> = ({
  selectedNeighborhoodId,
  onSelectNeighborhood,
  className = '',
}) => {
  const navigate = useNavigate();
  const [activeNeighborhood, setActiveNeighborhood] = useState<NeighborhoodInfo>(
    mockNeighborhoods.find((n) => n.id === selectedNeighborhoodId) || mockNeighborhoods[0]
  );

  const handleSelect = (neighborhood: NeighborhoodInfo) => {
    setActiveNeighborhood(neighborhood);
    if (onSelectNeighborhood) {
      onSelectNeighborhood(neighborhood);
    }
  };

  // Find partners and experiences in this neighborhood
  const localPartners = mockGuestRestaurants.filter(
    (r) =>
      r.location.toLowerCase().includes(activeNeighborhood.name.toLowerCase()) ||
      activeNeighborhood.name.toLowerCase().includes(r.location.toLowerCase()) ||
      (activeNeighborhood.id === 'santo-antonio-de-lisboa' && r.location.includes('Santo Antônio')) ||
      (activeNeighborhood.id === 'lagoa-da-conceicao' && r.location.includes('Lagoa')) ||
      (activeNeighborhood.id === 'centro-beira-mar' && (r.location.includes('Centro') || r.location.includes('Beira Mar'))) ||
      (activeNeighborhood.id === 'campeche-sul-da-ilha' && (r.location.includes('Campeche') || r.location.includes('Sul'))) ||
      (activeNeighborhood.id === 'ribeirao-da-ilha' && r.location.includes('Ribeirão')) ||
      (activeNeighborhood.id === 'barra-da-lagoa' && r.location.includes('Barra'))
  );

  const localExperiences = mockExperiences.filter(
    (e) =>
      e.neighborhood.toLowerCase().includes(activeNeighborhood.name.toLowerCase()) ||
      activeNeighborhood.name.toLowerCase().includes(e.neighborhood.toLowerCase()) ||
      (activeNeighborhood.id === 'santo-antonio-de-lisboa' && e.neighborhood.includes('Santo Antônio')) ||
      (activeNeighborhood.id === 'lagoa-da-conceicao' && e.neighborhood.includes('Lagoa')) ||
      (activeNeighborhood.id === 'centro-beira-mar' && (e.neighborhood.includes('Centro') || e.neighborhood.includes('Beira Mar'))) ||
      (activeNeighborhood.id === 'ribeirao-da-ilha' && e.neighborhood.includes('Ribeirão')) ||
      (activeNeighborhood.id === 'campeche-sul-da-ilha' && (e.neighborhood.includes('Campeche') || e.neighborhood.includes('Sul')))
  );

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
            <Compass size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-graphite dark:text-white flex items-center space-x-2">
              <span>O que fazer no bairro</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-violet/10 text-brand-violet border border-brand-violet/20 hidden sm:inline-block">
                Descoberta Local
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Escolha uma região de Florianópolis e explore destaques, parceiros e experiências imperdíveis
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/experiencias')}
          className="text-xs font-bold text-brand-violet dark:text-brand-lilac hover:underline flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Ver catálogo de experiências</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Neighborhood Horizontal Pills Bar */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {mockNeighborhoods.map((neighborhood) => {
          const isSelected = activeNeighborhood.id === neighborhood.id;
          return (
            <button
              key={neighborhood.id}
              type="button"
              onClick={() => handleSelect(neighborhood)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-loopis text-white shadow-lg shadow-brand-violet/25 scale-[1.02]'
                  : 'bg-white dark:bg-[#1a1a1c] text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-white/10 hover:border-brand-violet/40 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <MapPin size={14} className={isSelected ? 'text-white' : 'text-brand-violet'} />
              <span>{neighborhood.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                }`}
              >
                {neighborhood.partnersCount + neighborhood.experiencesCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Neighborhood Spotlight Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNeighborhood.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl overflow-hidden bg-white dark:bg-[#1a1a1c] border border-gray-200/70 dark:border-white/10 shadow-xl"
        >
          {/* Top Banner with Image & Overview */}
          <div className="relative min-h-[200px] sm:min-h-[240px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <img
              src={activeNeighborhood.imageUrl}
              alt={activeNeighborhood.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Top Badges */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-brand-violet text-white text-xs font-extrabold shadow-md flex items-center space-x-1">
                  <MapPin size={12} />
                  <span>{activeNeighborhood.name}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-brand-lilac text-xs font-bold border border-white/20">
                  {activeNeighborhood.badge}
                </span>
              </div>

              <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center space-x-1 border border-white/10">
                <Sparkles size={13} />
                <span>Vibe: {activeNeighborhood.vibe}</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="relative z-10 space-y-2 mt-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {activeNeighborhood.tagline}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 max-w-3xl leading-relaxed">
                {activeNeighborhood.description}
              </p>
            </div>
          </div>

          {/* Highlights Pills Bar */}
          <div className="p-4 sm:p-6 bg-brand-violet/5 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-deep-purple dark:text-brand-lilac mb-3">
              <Sparkles size={15} />
              <span>Destaques imperdíveis em {activeNeighborhood.name}:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeNeighborhood.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#232328] border border-brand-violet/20 text-brand-graphite dark:text-gray-200 text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                >
                  <CheckCircle2 size={13} className="text-brand-violet shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Local Feed: Experiences & Partners in this Neighborhood */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* 1. Experiences in Neighborhood (if any) */}
            {localExperiences.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles size={16} className="text-brand-violet" />
                    <h4 className="text-sm sm:text-base font-bold text-brand-graphite dark:text-white">
                      Experiências Exclusivas nesta Região ({localExperiences.length})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/experiencias')}
                    className="text-xs text-brand-violet dark:text-brand-lilac font-bold hover:underline"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {localExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => navigate('/experiencias')}
                      className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-violet/40 hover:shadow-md transition-all cursor-pointer flex space-x-3.5 items-center group"
                    >
                      <img
                        src={exp.imageUrl}
                        alt={exp.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-brand-violet/10 text-brand-violet">
                            {exp.type}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            +{exp.cashbackPercent}% Cashback
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-brand-graphite dark:text-white truncate group-hover:text-brand-violet transition-colors">
                          {exp.title}
                        </h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          Por {exp.partnerName} • Duração {exp.duration}
                        </p>
                        <div className="flex items-center justify-between text-xs font-extrabold pt-0.5">
                          <span className="text-brand-deep-purple dark:text-brand-lilac">
                            R$ {exp.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[11px] text-brand-violet font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                            <span>Reservar</span>
                            <ArrowRight size={12} className="ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Partners in Neighborhood */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Utensils size={16} className="text-brand-violet" />
                  <h4 className="text-sm sm:text-base font-bold text-brand-graphite dark:text-white">
                    Parceiros em {activeNeighborhood.name} ({localPartners.length})
                  </h4>
                </div>
              </div>

              {localPartners.length === 0 ? (
                <p className="text-xs text-gray-500 py-3 text-center">
                  Novos parceiros estão sendo adicionados nesta região em breve!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {localPartners.map((partner) => (
                    <div
                      key={partner.id}
                      onClick={() => navigate(`/restaurante/${partner.id}`)}
                      className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-violet/40 hover:shadow-md transition-all cursor-pointer flex items-center space-x-3 group"
                    >
                      <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-brand-violet uppercase truncate">
                            {partner.category}
                          </span>
                          <div className="flex items-center space-x-0.5 text-xs font-bold text-amber-500">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{partner.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-brand-graphite dark:text-white truncate group-hover:text-brand-violet transition-colors">
                          {partner.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {partner.address}
                        </p>
                        {partner.promotionBadge && (
                          <span className="text-[10px] font-bold text-brand-deep-purple dark:text-brand-lilac line-clamp-1">
                            🏷️ {partner.promotionBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
