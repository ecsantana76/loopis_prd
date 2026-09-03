import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Sparkles, Check, ArrowRight, Wallet } from 'lucide-react';
import type { Experience } from '../../types';

interface ExperienceCardProps {
  experience: Experience;
  onBook: (experience: Experience) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  onBook,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.99 }}
      className="group rounded-3xl overflow-hidden bg-white dark:bg-[#1e1e22] shadow-sm hover:shadow-2xl hover:shadow-brand-violet/15 border border-gray-100 dark:border-white/10 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Cover Image Container */}
      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-gray-100 dark:bg-black/40">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-brand-deep-purple/90 backdrop-blur-md text-brand-lilac text-[10px] font-extrabold uppercase tracking-wider border border-brand-lilac/30 shadow-md flex items-center space-x-1">
              <Sparkles size={11} />
              <span>{experience.type}</span>
            </span>

            {experience.badges && experience.badges[0] && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-300/30">
                {experience.badges[0]}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="px-2.5 py-1 rounded-xl bg-white/95 dark:bg-black/80 backdrop-blur-md text-brand-graphite dark:text-white flex items-center space-x-1 shadow-md">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-extrabold">{experience.rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400">({experience.reviewsCount})</span>
          </div>
        </div>

        {/* Bottom Title & Neighborhood */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white space-y-1">
          <p className="text-[11px] font-bold text-brand-lilac uppercase tracking-wider">
            {experience.partnerName}
          </p>
          <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-brand-lilac transition-colors line-clamp-2 leading-snug drop-shadow">
            {experience.title}
          </h3>
          <div className="flex items-center space-x-3 text-xs text-gray-300 pt-0.5">
            <span className="flex items-center space-x-1">
              <MapPin size={12} className="text-brand-lilac shrink-0" />
              <span className="truncate">{experience.neighborhood}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock size={12} className="text-brand-lilac shrink-0" />
              <span>{experience.duration}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {experience.subtitle}
        </p>

        {/* Included Items Pills */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            O que está incluso:
          </p>
          <div className="space-y-1">
            {experience.includedItems.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start space-x-1.5 text-xs text-brand-graphite dark:text-gray-200">
                <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
            {experience.includedItems.length > 2 && (
              <p className="text-[10px] font-semibold text-brand-violet dark:text-brand-lilac pl-5">
                + {experience.includedItems.length - 2} outros itens inclusos
              </p>
            )}
          </div>
        </div>

        {/* Pricing & Cashback Box */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 via-brand-lilac/10 to-purple-50 dark:from-brand-violet/10 dark:via-purple-950/20 dark:to-brand-violet/10 border border-brand-violet/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold block">Valor por pessoa:</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-extrabold text-brand-graphite dark:text-white">
                R$ {experience.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                +{experience.cashbackPercent}% Cashback
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold block">Use no pagamento:</span>
            <span className="text-xs font-extrabold text-brand-deep-purple dark:text-brand-lilac bg-brand-violet/15 dark:bg-brand-violet/30 px-2 py-0.5 rounded-lg inline-flex items-center space-x-1">
              <Wallet size={11} className="mr-0.5 text-brand-violet dark:text-brand-lilac" />
              <span>Escolha quantos Loops</span>
            </span>
          </div>
        </div>

        {/* CTA Action Buttons */}
        <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onBook(experience)}
            className="flex-1 bg-gradient-loopis hover:opacity-95 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-brand-violet/25 hover:shadow-brand-violet/40 transition-all flex items-center justify-center space-x-1.5 text-xs sm:text-sm cursor-pointer"
          >
            <Wallet size={15} />
            <span>Comprar Experiência</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
