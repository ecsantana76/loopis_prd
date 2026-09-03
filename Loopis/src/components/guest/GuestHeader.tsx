import React, { useState } from 'react';
import { MapPin, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { Logo } from '../Logo';

interface GuestHeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export const GuestHeader: React.FC<GuestHeaderProps> = ({
  onOpenLogin,
  onOpenRegister,
  selectedCity = 'Florianópolis - SC',
  onCityChange,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cities = ['Florianópolis - SC', 'São Paulo - SP', 'Curitiba - PR', 'Balneário Camboriú - SC'];

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism border-b border-gray-200/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Logo size="md" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-xs font-semibold text-brand-graphite dark:text-white transition-all cursor-pointer border border-gray-200/40 dark:border-white/5"
              >
                <MapPin size={14} className="text-brand-violet shrink-0" />
                <span className="max-w-[120px] sm:max-w-none truncate">{selectedCity}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 top-10 mt-1 w-48 bg-white dark:bg-brand-graphite rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <span className="text-[10px] text-gray-400 px-3 py-1 block uppercase font-bold tracking-wider">
                    Cidades Disponíveis
                  </span>
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        if (onCityChange) onCityChange(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCity === city
                          ? 'text-brand-violet bg-brand-violet/10 font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <span className="text-brand-violet text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-brand-graphite dark:text-white hover:text-brand-violet dark:hover:text-brand-lilac hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="bg-gradient-loopis hover:opacity-95 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-brand-violet/30 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Criar Conta</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
