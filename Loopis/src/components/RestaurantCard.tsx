import React from 'react';
import { MapPin, Star, Tag } from 'lucide-react';
import type { Restaurante } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurante;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="group cursor-pointer rounded-2xl glassmorphism overflow-hidden hover:shadow-2xl hover:shadow-brand-violet/20 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-gray-800">{(restaurant.rating ?? 0).toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-brand-graphite dark:text-brand-off-white mb-1 group-hover:text-brand-violet transition-colors">
          {restaurant.nome}
        </h3>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
          <MapPin size={14} className="mr-1" />
          <span className="text-xs">{restaurant.location}</span>
        </div>
        
        <div className="bg-brand-lilac/10 border border-brand-lilac/20 rounded-xl p-3 flex items-start space-x-2">
          <Tag size={16} className="text-brand-violet mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-brand-deep-purple dark:text-brand-lilac">
            {restaurant.promotion}
          </p>
        </div>
      </div>
    </div>
  );
};
