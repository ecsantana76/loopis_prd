import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Users, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Restaurante } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurante;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, restaurant }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('Hoje');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const { createReservation, isLoggedIn, openLoginModal } = useStore();
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!isLoggedIn) {
      onClose();
      openLoginModal();
      return;
    }
    createReservation({
      restaurantId: restaurant?.id || '',
      restaurantName: restaurant?.nome || (restaurant as any)?.name || 'Restaurante',
      date: date || 'Hoje',
      time: time || '19:30',
      guests: guests || 2,
      promotionSelected: true
    });
    setStep(2);
    setTimeout(() => {
      onClose();
      navigate('/reserva/checkin');
    }, 2000);
  };

  const dates = ['Hoje', 'Amanhã', 'Sexta', 'Sábado'];
  const times = ['19:00', '19:30', '20:00', '20:30', '21:00'];
  const guestOptions = [1, 2, 3, 4, 5, 6];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="app-modal-backdrop fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="app-modal-panel fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white dark:bg-brand-graphite"
          >
            <div className="p-6">
              {/* Drawer Handle */}
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-brand-graphite dark:text-white">
                  Reserva em {restaurant.nome}
                </h2>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <CalendarIcon size={16} />
                      <span>Data</span>
                    </label>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                      {dates.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDate(d)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                            date === d 
                              ? 'bg-brand-deep-purple text-white' 
                              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <Clock size={16} />
                      <span>Horário</span>
                    </label>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                      {times.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
                            time === t 
                              ? 'border-brand-violet bg-brand-violet/10 text-brand-violet' 
                              : 'border-transparent bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guests Selection */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <Users size={16} />
                      <span>Pessoas</span>
                    </label>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                      {guestOptions.map((g) => (
                        <button
                          key={g}
                          onClick={() => setGuests(g)}
                          className={`w-12 h-12 flex-shrink-0 rounded-xl text-sm font-medium flex items-center justify-center transition-colors ${
                            guests === g 
                              ? 'bg-brand-deep-purple text-white' 
                              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo Banner */}
                  <div className="bg-brand-lilac/10 border border-brand-lilac/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-violet font-bold uppercase mb-0.5">Aplicar Benefício</p>
                      <p className="text-sm font-medium text-brand-graphite dark:text-brand-off-white">{restaurant.promotion}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-brand-violet flex items-center justify-center">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                  </div>

                  <button 
                    disabled={!time}
                    onClick={handleConfirm}
                    className="w-full bg-gradient-loopis text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 transition-all mt-4"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle size={40} className="text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-brand-graphite dark:text-white mb-2">Reserva Solicitada!</h3>
                  <p className="text-gray-500 dark:text-gray-400">Você será redirecionado para o acompanhamento.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
