import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Tag, Clock, ArrowRight } from 'lucide-react';
import type { GuestRestaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: GuestRestaurant;
  onClick: (restaurant: GuestRestaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(restaurant)}
      className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-[#1e1e22] shadow-sm hover:shadow-2xl hover:shadow-brand-violet/15 border border-gray-100 dark:border-white/10 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Cover Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100 dark:bg-black/40">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          {/* Featured / Highlight Badge */}
          {restaurant.featuredBadge ? (
            <span className="px-2.5 py-1 rounded-full bg-brand-deep-purple/90 backdrop-blur-md text-brand-lilac text-[10px] font-extrabold uppercase tracking-wider border border-brand-lilac/30 shadow-md">
              {restaurant.featuredBadge}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
              {restaurant.category}
            </span>
          )}

          {/* Rating Badge */}
          <div className="px-2.5 py-1 rounded-xl bg-white/95 dark:bg-black/80 backdrop-blur-md text-brand-graphite dark:text-white flex items-center space-x-1 shadow-md">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-extrabold">{restaurant.rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400">({restaurant.reviewsCount})</span>
          </div>
        </div>

        {/* Bottom Title & Location on Image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white">
          <h3 className="text-lg font-bold text-white group-hover:text-brand-lilac transition-colors truncate drop-shadow">
            {restaurant.name}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-gray-300 mt-0.5">
            <MapPin size={12} className="text-brand-lilac shrink-0" />
            <span className="truncate">{restaurant.location}</span>
            <span>•</span>
            <span className="font-semibold">{restaurant.priceRange}</span>
          </div>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        {/* Promotion / Cashback Box */}
        {restaurant.promotionBadge && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 via-brand-lilac/10 to-purple-50 dark:from-brand-violet/10 dark:via-purple-950/20 dark:to-brand-violet/10 border border-brand-violet/20 flex items-center space-x-2">
            <Tag size={15} className="text-brand-violet dark:text-brand-lilac shrink-0" />
            <p className="text-xs font-bold text-brand-deep-purple dark:text-brand-lilac line-clamp-1">
              {restaurant.promotionBadge}
            </p>
          </div>
        )}

        {/* Footer info: Estimated Time & Auth Gate Action Hook */}
        <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <Clock size={13} />
            <span>{restaurant.estimatedTime || 'Reserva online'}</span>
          </div>

          <span className="text-brand-violet dark:text-brand-lilac font-bold flex items-center space-x-1 group-hover:underline">
            <span>Ver Detalhes</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};
