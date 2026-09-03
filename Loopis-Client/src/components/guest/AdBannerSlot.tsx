import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Award } from 'lucide-react';
import type { AdBanner } from '../../types';

interface AdBannerSlotProps {
  type: 'hero' | 'interstitial' | 'sponsored';
  banners?: AdBanner[];
  singleBanner?: AdBanner;
  onBannerClick?: (banner: AdBanner) => void;
  className?: string;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  type,
  banners = [],
  singleBanner,
  onBannerClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (banner: AdBanner) => {
    if (onBannerClick) {
      onBannerClick(banner);
    } else if (banner.targetUrl) {
      if (banner.targetUrl.startsWith('http')) {
        window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(banner.targetUrl);
      }
    }
  };

  // Auto slide for hero carousel
  useEffect(() => {
    if (type !== 'hero' || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [type, banners.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Case 1: Hero Carousel Banner Slot
  if (type === 'hero' && banners.length > 0) {
    const current = banners[currentIndex];

    return (
      <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl h-[280px] sm:h-[340px] md:h-[400px] select-none group ${className}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => handleClick(current)}
            className="absolute inset-0 cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${current.gradientColor || 'from-purple-950 via-brand-deep-purple/80 to-transparent'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between z-20 max-w-2xl">
              {/* Badge */}
              <div className="flex items-center space-x-2">
                {current.badge && (
                  <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold flex items-center space-x-1.5 border border-white/20 shadow-sm">
                    <Sparkles size={13} className="text-amber-300" />
                    <span>{current.badge}</span>
                  </span>
                )}
              </div>

              {/* Title, subtitle & CTA */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                  {current.title}
                </h2>
                {current.subtitle && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 max-w-xl font-medium leading-relaxed drop-shadow">
                    {current.subtitle}
                  </p>
                )}

                <div className="pt-2">
                  <span className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-loopis text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-violet/40 hover:scale-105 active:scale-95 transition-all">
                    <span>{current.ctaText || 'Explorar Ofertas'}</span>
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls (if > 1 banner) */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              title="Anúncio Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              title="Próximo Anúncio"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 right-6 z-30 flex items-center space-x-1.5">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-white shadow-sm'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Case 2: Interstitial / Secondary Sponsored Banner Slot
  const banner = singleBanner || (banners.length > 0 ? banners[0] : null);
  if (!banner) return null;

  return (
    <div
      onClick={() => handleClick(banner)}
      className={`relative w-full rounded-3xl overflow-hidden shadow-xl border border-white/10 cursor-pointer group select-none transition-all duration-300 hover:shadow-brand-violet/20 hover:border-brand-violet/40 ${className}`}
    >
      <div className="absolute inset-0">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradientColor || 'from-brand-graphite via-purple-950/90 to-transparent'}`} />
      </div>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1 border border-amber-400/30">
              <Award size={12} />
              <span>{banner.badge || 'Espaço Patrocinado'}</span>
            </span>
            {banner.sponsorName && (
              <span className="text-xs text-gray-300 font-semibold">• {banner.sponsorName}</span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-snug">
            {banner.title}
          </h3>

          {banner.subtitle && (
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {banner.subtitle}
            </p>
          )}
        </div>

        <div className="shrink-0 pt-2 sm:pt-0">
          <button
            type="button"
            className="px-5 py-2.5 rounded-2xl bg-white text-brand-graphite hover:bg-brand-violet hover:text-white text-xs font-extrabold shadow-lg transition-all duration-200 flex items-center space-x-2 group-hover:translate-x-1"
          >
            <span>{banner.ctaText || 'Saiba Mais'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
