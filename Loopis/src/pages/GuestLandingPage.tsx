import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import { GuestHeader } from '../components/guest/GuestHeader';
import { AdBannerSlot } from '../components/guest/AdBannerSlot';
import { RestaurantGrid } from '../components/guest/RestaurantGrid';
import { AuthGateModal } from '../components/guest/AuthGateModal';
import { 
  mockHeroBanners, 
  mockInterstitialBanner, 
  mockGuestRestaurants, 
  mockCategories 
} from '../mocks/guestData';
import type { GuestRestaurant, AdBanner, AuthModalState } from '../types';

export const GuestLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Florianópolis - SC');

  const [authModalState, setAuthModalState] = useState<AuthModalState>({
    isOpen: false,
    selectedRestaurant: null,
    initialMode: 'register',
    triggerSource: 'card_click',
  });

  const handleOpenAuthModal = (
    restaurant: GuestRestaurant | null = null,
    mode: 'login' | 'register' = 'register',
    source: AuthModalState['triggerSource'] = 'card_click'
  ) => {
    setAuthModalState({
      isOpen: true,
      selectedRestaurant: restaurant,
      initialMode: mode,
      triggerSource: source,
    });
  };

  const handleCloseAuthModal = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleBannerClick = (_banner: AdBanner) => {
    handleOpenAuthModal(null, 'register', 'banner_click');
  };

  return (
    <div className="min-h-screen bg-brand-off-white dark:bg-[#121214] text-brand-graphite dark:text-white flex flex-col justify-between selection:bg-brand-violet selection:text-white">
      <GuestHeader
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onOpenLogin={() => handleOpenAuthModal(null, 'login', 'header_login')}
        onOpenRegister={() => handleOpenAuthModal(null, 'register', 'header_register')}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 w-full flex-1">
        <section className="space-y-8">
          <AdBannerSlot
            type="hero"
            banners={mockHeroBanners}
            onBannerClick={handleBannerClick}
          />

          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/30 text-brand-deep-purple dark:text-brand-lilac text-xs font-extrabold shadow-sm"
            >
              <Gift size={14} className="text-brand-violet dark:text-brand-lilac animate-bounce" />
              <span>Ganhe +50 Loops de presente no cadastro hoje!</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-graphite dark:text-white leading-[1.15]"
            >
              Sua conta no parceiro vira{' '}
              <span className="text-transparent bg-clip-text bg-gradient-loopis">
                dinheiro de volta
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Descubra os melhores parceiros de {selectedCity}, faça reservas sem taxas e acumule créditos automáticos para abater nas suas próximas experiências.
            </motion.p>
          </div>
        </section>

        <RestaurantGrid
          restaurants={mockGuestRestaurants}
          categories={mockCategories}
          interstitialBanner={mockInterstitialBanner}
          onRestaurantClick={(restaurant) => handleOpenAuthModal(restaurant, 'register', 'card_click')}
          onBannerClick={handleBannerClick}
        />

        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-deep-purple via-brand-graphite to-black text-white p-8 sm:p-12 shadow-2xl border border-white/10 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-brand-lilac text-xs font-extrabold uppercase tracking-wider inline-block">
              Junte-se a milhares de amantes da gastronomia
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Pronto para transformar sua experiência gastronômica?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Cadastre-se em menos de 1 minuto e comece a economizar na sua primeira comanda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenAuthModal(null, 'register', 'header_register')}
              className="w-full sm:w-auto bg-gradient-loopis hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-brand-violet/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Criar Conta Grátis</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleOpenAuthModal(null, 'login', 'header_login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm transition-all border border-white/15 cursor-pointer"
            >
              Já tenho cadastro
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200/60 dark:border-white/10 py-8 bg-white/50 dark:bg-black/20 text-center text-xs text-gray-500 space-y-2">
        <p>© 2026 Loopis Brasil Tecnologia Gastronômica Ltda. Todos os direitos reservados.</p>
        <div className="flex justify-center space-x-4 text-brand-violet dark:text-brand-lilac font-medium">
          <button type="button" onClick={() => navigate('/termos')} className="hover:underline">
            Termos de Uso
          </button>
          <button type="button" onClick={() => navigate('/regulamento')} className="hover:underline">
            Regulamento de Cashback
          </button>
          <button type="button" onClick={() => navigate('/privacidade')} className="hover:underline">
            Privacidade
          </button>
        </div>
      </footer>

      <AuthGateModal
        isOpen={authModalState.isOpen}
        onClose={handleCloseAuthModal}
        selectedRestaurant={authModalState.selectedRestaurant}
        onSelectLogin={() => {
          handleCloseAuthModal();
          const redirect = authModalState.selectedRestaurant ? `?redirect=${authModalState.selectedRestaurant.id}` : '';
          navigate(`/auth${redirect}`);
        }}
        onSelectRegister={() => {
          handleCloseAuthModal();
          const redirect = authModalState.selectedRestaurant ? `?redirect=${authModalState.selectedRestaurant.id}` : '';
          navigate(`/auth${redirect}`);
        }}
      />
    </div>
  );
};
