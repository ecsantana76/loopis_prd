import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Star, Tag, Navigation, Calendar, Image as ImageIcon, Camera, X, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { BookingModal } from '../components/BookingModal';
import { mockGuestRestaurants } from '../mocks/guestData';
import { ApprovedReviewsSection } from '../components/reviews/ApprovedReviewsSection';

export const RestaurantDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, isLoggedIn, openLoginModal } = useStore();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  
  const guestMatch = mockGuestRestaurants.find((g) => g.id === id);
  const restaurant =
    restaurants.find((r) => r.id === id) ||
    (guestMatch
      ? {
          id: guestMatch.id,
          nome: guestMatch.name,
          location: guestMatch.location,
          endereco: guestMatch.address,
          promotion: guestMatch.promotionBadge || `${guestMatch.cashbackPercent}% de Cashback em Loops`,
          imageUrl: guestMatch.imageUrl,
          rating: guestMatch.rating,
          categoria: guestMatch.category,
          distance: '1.5 km',
          horarioFuncionamento: 'Ter a Dom - 18h às 23:30h',
          fotosGaleria: [
            guestMatch.imageUrl,
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
          ],
          fotosMenu: [],
          status: 'aprovado' as const,
          avaliacoesGoogle: [],
        }
      : null);

  if (!restaurant) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-graphite dark:text-white">Parceiro não encontrado</h2>
        <p className="text-sm text-gray-500">O parceiro selecionado não está disponível no momento.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-loopis text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md cursor-pointer"
        >
          Ver Todos os Parceiros
        </button>
      </div>
    );
  }

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      openLoginModal();
    } else {
      setIsBookingModalOpen(true);
    }
  };

  return (
    <div className="pb-24 md:pb-8 bg-brand-off-white dark:bg-brand-graphite min-h-screen relative -mx-4 sm:mx-0 -mt-6 sm:mt-0">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 w-full group">
        <img 
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'} 
          alt={restaurant.nome} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="bg-brand-violet px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider mb-2 inline-block shadow-sm">
                {restaurant.categoria}
              </span>
              <h1 className="text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                {restaurant.nome}
              </h1>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl flex flex-col items-center shadow-sm">
              <Star size={18} className="text-yellow-400 fill-yellow-400 mb-1" />
              <span className="text-sm font-bold text-white">{(restaurant.rating ?? 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8 max-w-3xl mx-auto">
        {/* Promotion Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-loopis p-[1px] rounded-2xl shadow-lg"
        >
          <div className="bg-white dark:bg-[#1a1a1c] rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand-violet/10 rounded-full flex items-center justify-center shrink-0">
              <Tag size={24} className="text-brand-violet" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-brand-violet uppercase tracking-wider mb-1">Benefício com Loopis</h3>
              <p className="text-sm font-semibold text-brand-graphite dark:text-white leading-snug">{restaurant.promotion}</p>
            </div>
          </div>
        </motion.div>

        {/* Galeria de Fotos do Parceiro */}
        {(() => {
          const galleryPhotos = (restaurant.fotosGaleria && restaurant.fotosGaleria.length > 0)
            ? restaurant.fotosGaleria
            : [
                restaurant.imageUrl,
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
              ];

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-brand-graphite dark:text-white flex items-center space-x-2">
                  <Camera size={20} className="text-brand-violet" />
                  <span>Galeria do Parceiro</span>
                </h3>
                <span className="text-xs font-semibold text-brand-violet bg-brand-violet/10 px-2.5 py-1 rounded-full">
                  {galleryPhotos.length} fotos
                </span>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {galleryPhotos.slice(0, 3).map((photo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePhotoIndex(index)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-gray-100 dark:bg-white/5 ${
                      index === 0 ? 'col-span-2 row-span-2 h-48 sm:h-64' : 'h-23 sm:h-30'
                    }`}
                  >
                    <img 
                      src={photo} 
                      alt={`${restaurant.nome} foto ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 size={22} className="text-white drop-shadow-md" />
                    </div>

                    {index === 2 && galleryPhotos.length > 3 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white font-bold">
                        <span className="text-lg">+{galleryPhotos.length - 3}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90">Ver mais</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Cardápio do Parceiro */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-brand-graphite dark:text-white flex items-center space-x-2">
              <ImageIcon size={20} className="text-brand-violet" />
              <span>Cardápio do Parceiro</span>
            </h3>
            <span className="text-xs text-gray-500">Atualizado recentemente</span>
          </div>

          {/* Menu Items Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              restaurant.categoria === 'Frutos do Mar' ? [
                {
                  id: 'm1',
                  nome: 'Sequência de Camarão Especial',
                  categoria: 'Especialidade',
                  preco: 'R$ 148,00',
                  descricao: 'Camarão ao alho e óleo, à milanesa, ao bafo e molho de camarão. Acompanha arroz e pirão.',
                  imagem: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm2',
                  nome: 'Ostras Frescas da Ilha (Dúzia)',
                  categoria: 'Entradas',
                  preco: 'R$ 68,00',
                  descricao: 'Ostras cultivadas em Florianópolis servidas in natura no gelo com limão siciliano.',
                  imagem: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm3',
                  nome: 'Bacalhau à Brás Tradicional',
                  categoria: 'Pratos Principais',
                  preco: 'R$ 92,00',
                  descricao: 'Lascados de bacalhau nobre com batata palha artesanal, ovos orgânicos e azeitonas pretas.',
                  imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm4',
                  nome: 'Pastel de Nata Português',
                  categoria: 'Sobremesa',
                  preco: 'R$ 16,00',
                  descricao: 'Receita tradicional portuguesa de massa folhada crocante e creme de ovos assado.',
                  imagem: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
                },
              ] : restaurant.categoria === 'Italiano' ? [
                {
                  id: 'm1',
                  nome: 'Tagliatelle ao Tartufata e Filé',
                  categoria: 'Massas',
                  preco: 'R$ 78,00',
                  descricao: 'Massa fresca artesanal com salsa de trufas negras, cogumelos e medalhão de filé mignon.',
                  imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm2',
                  nome: 'Pizza Napolitana Margherita',
                  categoria: 'Pizzas',
                  preco: 'R$ 62,00',
                  descricao: 'Fermentação natural de 48h, molho San Marzano, mozzarella fior di latte e manjericão fresco.',
                  imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm3',
                  nome: 'Carpaccio Clássico com Alcaparras',
                  categoria: 'Entradas',
                  preco: 'R$ 44,00',
                  descricao: 'Finas lâminas de filé mignon, molho de mostarda dijon, alcaparras e lascas de grana padano.',
                  imagem: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm4',
                  nome: 'Tiramisù Tradicional',
                  categoria: 'Sobremesas',
                  preco: 'R$ 28,00',
                  descricao: 'Biscoito savoiardi embebido em café espresso, mascarpone cremoso e cacau 70%.',
                  imagem: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
                },
              ] : [
                {
                  id: 'm1',
                  nome: 'Prato Especial do Chef',
                  categoria: 'Pratos Principais',
                  preco: 'R$ 64,90',
                  descricao: 'Grelhado especial da casa com acompanhamentos artesanais e temperos selecionados.',
                  imagem: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm2',
                  nome: 'Porção da Casa para Compartilhar',
                  categoria: 'Entradas & Petiscos',
                  preco: 'R$ 38,00',
                  descricao: 'Porção crocante preparada na hora com molhos exclusivos da cozinha.',
                  imagem: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm3',
                  nome: 'Sobremesa Artesanal',
                  categoria: 'Sobremesas',
                  preco: 'R$ 24,50',
                  descricao: 'Doce artesanal feito diariamente com calda especial e toque de baunilha.',
                  imagem: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
                },
                {
                  id: 'm4',
                  nome: 'Drink Signature Loopis',
                  categoria: 'Bebidas & Cocktails',
                  preco: 'R$ 29,00',
                  descricao: 'Mistura autoral refrescante com frutas da estação e toque cítrico.',
                  imagem: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400',
                },
              ]
            ).map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 rounded-2xl p-3 flex space-x-3 items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <img 
                  src={item.imagem} 
                  alt={item.nome}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400';
                  }}
                  className="w-20 h-20 object-cover rounded-xl shrink-0 bg-gray-100 dark:bg-white/5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider">{item.categoria}</span>
                    <span className="text-xs font-bold text-brand-deep-purple dark:text-brand-lilac bg-brand-violet/10 px-2 py-0.5 rounded-full">{item.preco}</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-graphite dark:text-white truncate mt-0.5">{item.nome}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section - Endereço e Horários */}
        <div className="bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 p-6 rounded-3xl shadow-sm space-y-5">
          <h3 className="font-bold text-lg text-brand-graphite dark:text-white pb-2 border-b border-gray-100 dark:border-white/5">
            Endereço e Horários
          </h3>
          
          <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-200">
            <div className="bg-brand-violet/10 p-2.5 rounded-2xl shrink-0 mt-0.5">
              <MapPin size={22} className="text-brand-violet" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Localização</p>
              <p className="text-sm font-semibold leading-relaxed text-brand-graphite dark:text-white">
                {restaurant.endereco || restaurant.location || 'Santo Antônio de Lisboa, Florianópolis - SC'}
              </p>
              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.nome + ' ' + (restaurant.endereco || ''))}`, '_blank')}
                className="mt-3 px-4 py-2.5 bg-brand-violet/10 hover:bg-brand-violet/20 rounded-xl text-xs font-bold text-brand-violet flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Navigation size={14} className="text-brand-violet" />
                <span>Abrir Rota no GPS</span>
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-200 pt-4 border-t border-gray-100 dark:border-white/5">
            <div className="bg-brand-violet/10 p-2.5 rounded-2xl shrink-0 mt-0.5">
              <Clock size={22} className="text-brand-violet" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Horário de Funcionamento</p>
              <p className="text-sm font-semibold text-brand-graphite dark:text-white">
                {restaurant.horarioFuncionamento || 'Terça a Domingo - 18h às 23h'}
              </p>
            </div>
          </div>
        </div>

        {/* Google Reviews Mock */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-brand-graphite dark:text-white">Avaliações do Google</h3>
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold dark:text-white">{(restaurant.rating ?? 0).toFixed(1)}</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">MA</div>
                <div>
                  <p className="text-sm font-bold dark:text-white">Maria Almeida</p>
                  <p className="text-[10px] text-gray-500">Local Guide • 12 avaliações</p>
                </div>
              </div>
              <div className="flex space-x-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-yellow-500 fill-yellow-500" />)}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              "Lugar incrível, comida maravilhosa e atendimento excelente. Usamos o Loopis e o desconto valeu muito a pena!"
            </p>
          </div>
        </div>

        <ApprovedReviewsSection partnerId={restaurant.id} />
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-20 md:bottom-auto md:sticky md:top-24 left-0 right-0 px-6 z-40 max-w-3xl mx-auto pb-safe">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleBookingClick}
          className="w-full bg-gradient-loopis text-white font-bold py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4)] flex items-center justify-center space-x-2 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Calendar size={20} className="relative z-10" />
          <span className="relative z-10">{isLoggedIn ? 'Fazer Reserva e Ganhar Loops' : 'Cadastre-se para Reservar'}</span>
        </motion.button>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        restaurant={restaurant} 
      />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (() => {
          const photos = (restaurant.fotosGaleria && restaurant.fotosGaleria.length > 0)
            ? restaurant.fotosGaleria
            : [
                restaurant.imageUrl,
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
              ];

          const handlePrev = (e: React.MouseEvent) => {
            e.stopPropagation();
            setActivePhotoIndex((prev) => (prev === null || prev === 0 ? photos.length - 1 : prev - 1));
          };

          const handleNext = (e: React.MouseEvent) => {
            e.stopPropagation();
            setActivePhotoIndex((prev) => (prev === null || prev === photos.length - 1 ? 0 : prev + 1));
          };

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhotoIndex(null)}
              className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center z-10">
                <div className="text-white">
                  <h4 className="font-bold text-sm sm:text-base">{restaurant.nome}</h4>
                  <p className="text-xs text-gray-400">
                    Foto {activePhotoIndex + 1} de {photos.length}
                  </p>
                </div>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Center Image Viewport */}
              <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                >
                  <ChevronLeft size={28} />
                </button>

                <motion.img
                  key={activePhotoIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  src={photos[activePhotoIndex]}
                  alt={`${restaurant.nome} ${activePhotoIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                >
                  <ChevronRight size={28} />
                </button>
              </div>

              {/* Thumbnails Footer */}
              <div className="flex justify-center space-x-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === activePhotoIndex
                        ? 'border-brand-violet scale-105 opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
