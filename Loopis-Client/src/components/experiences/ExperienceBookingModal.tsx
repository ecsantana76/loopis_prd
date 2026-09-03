import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Wallet, 
  QrCode, 
  CreditCard, 
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import type { Experience } from '../../types';

interface ExperienceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience | null;
}

export const ExperienceBookingModal: React.FC<ExperienceBookingModalProps> = ({
  isOpen,
  onClose,
  experience,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal, loopsBalance, createReservation, completeClientPayment } = useStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState('Hoje');
  const [selectedTime, setSelectedTime] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [useLoops, setUseLoops] = useState(false);
  const [loopsInput, setLoopsInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  if (!experience) return null;

  const dates = ['Hoje', 'Amanhã', 'Sábado', 'Domingo', 'Próxima Sexta'];
  const times = ['11:30', '14:00', '18:00', '19:30', '20:30'];

  const totalPrice = experience.price * guests;
  const maxLoopsForPayment = Math.max(0, Math.min(loopsBalance, Math.floor(totalPrice)));
  const loopsToUse = useLoops
    ? Math.max(0, Math.min(maxLoopsForPayment, Math.floor(Number(loopsInput) || 0)))
    : 0;
  const amountAfterLoops = Math.max(0, Number((totalPrice - loopsToUse).toFixed(2)));
  const totalCashbackLoops = Math.round((amountAfterLoops * experience.cashbackPercent) / 100);

  const handleProcessPayment = () => {
    if (!isLoggedIn) {
      onClose();
      openLoginModal();
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const generatedCode = 'VOUCHER-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setVoucherCode(generatedCode);

      const completed = completeClientPayment(
        `Compra da experiência ${experience.title}`,
        loopsToUse,
        totalCashbackLoops,
      );
      if (!completed) {
        setIsProcessing(false);
        return;
      }

      // Add to registered activities / reservations
      createReservation({
        restaurantId: experience.partnerId,
        restaurantName: `${experience.partnerName} (${experience.title})`,
        date: selectedDate,
        time: selectedTime,
        guests: guests,
        promotionSelected: true,
      });

      setIsProcessing(false);
      setStep(2);
    }, 1200);
  };

  const handleFinish = () => {
    onClose();
    setStep(1);
    setUseLoops(false);
    setLoopsInput('');
    navigate('/reserva/checkin');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="app-modal-backdrop fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="app-modal-panel fixed bottom-0 left-0 right-0 z-50 overflow-x-hidden overflow-y-auto rounded-t-3xl border-t border-gray-200/40 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1c]"
          >
            <div className="mx-auto w-full max-w-2xl space-y-6 p-4 sm:p-8">
              {/* Drawer Handle */}
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mx-auto" />

              {/* Modal Header */}
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-violet/10 text-brand-violet text-[10px] font-extrabold uppercase tracking-wider">
                      {experience.type}
                    </span>
                    <span className="text-xs text-gray-500">• {experience.neighborhood}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-brand-graphite dark:text-white leading-tight">
                    {experience.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Realização por <strong>{experience.partnerName}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  {/* Date Selector */}
                  <div className="space-y-2.5">
                    <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <CalendarIcon size={15} className="text-brand-violet" />
                      <span>Data da Experiência</span>
                    </label>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                      {dates.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                            selectedDate === d
                              ? 'bg-brand-violet text-white shadow-md shadow-brand-violet/30'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selector */}
                  <div className="space-y-2.5">
                    <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <Clock size={15} className="text-brand-violet" />
                      <span>Horário de Início</span>
                    </label>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                      {times.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                            selectedTime === t
                              ? 'border-brand-violet bg-brand-violet/10 text-brand-violet font-extrabold'
                              : 'border-transparent bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Participants */}
                  <div className="space-y-2.5">
                    <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <Users size={15} className="text-brand-violet" />
                      <span>Quantidade de Ingressos / Participantes</span>
                    </label>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                      {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`w-12 h-12 rounded-2xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            guests === num
                              ? 'bg-brand-deep-purple text-white shadow-md'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Forma de Pagamento Imediato */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Forma de Pagamento (Compra Imediata):</span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                        <Lock size={10} />
                        <span>Ambiente Seguro Loopis</span>
                      </span>
                    </label>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {/* PIX */}
                      <div
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                          paymentMethod === 'pix'
                            ? 'border-brand-violet bg-brand-violet/10 dark:bg-brand-violet/15'
                            : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-brand-violet/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-graphite dark:text-white">PIX</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-extrabold">
                            Aprovação Imediata
                          </span>
                        </div>
                        <p className="text-sm font-extrabold text-brand-deep-purple dark:text-brand-lilac">
                          R$ {amountAfterLoops.toFixed(2).replace('.', ',')}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          +{totalCashbackLoops} Loops de volta
                        </span>
                      </div>

                      {/* Cartão de Crédito */}
                      <div
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                          paymentMethod === 'credit_card'
                            ? 'border-brand-violet bg-brand-violet/10 dark:bg-brand-violet/15'
                            : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-brand-violet/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-graphite dark:text-white">Cartão</span>
                          <CreditCard size={14} className="text-brand-violet" />
                        </div>
                        <p className="text-sm font-extrabold text-brand-deep-purple dark:text-brand-lilac">
                          R$ {amountAfterLoops.toFixed(2).replace('.', ',')}
                        </p>
                        <span className="text-[10px] text-gray-500 block">
                          Até 12x no cartão
                        </span>
                      </div>

                    </div>
                  </div>

                  <section className="rounded-2xl border border-brand-violet/20 bg-brand-violet/5 p-4 dark:bg-brand-violet/10">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-violet text-white">
                        <Wallet size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-extrabold text-brand-graphite dark:text-white">
                          Você tem {loopsBalance} Loops. Você deseja utilizar Loops para pagar?
                        </h4>
                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">1 Loop = R$ 1 de abatimento nesta compra individual.</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={useLoops}
                        aria-label="Usar Loops nesta compra"
                        onClick={() => {
                          const next = !useLoops;
                          setUseLoops(next);
                          setLoopsInput(next ? String(maxLoopsForPayment) : '');
                        }}
                        className={`h-7 w-12 shrink-0 rounded-full p-1 transition ${useLoops ? 'bg-brand-violet' : 'bg-gray-300 dark:bg-gray-700'}`}
                      >
                        <span className={`block h-5 w-5 rounded-full bg-white transition ${useLoops ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>

                    {useLoops && (
                      <label className="mt-4 block border-t border-brand-violet/15 pt-4 text-xs font-bold text-gray-600 dark:text-gray-300">
                        Quantos Loops você quer utilizar?
                        <input
                          type="number"
                          min={0}
                          max={maxLoopsForPayment}
                          step={1}
                          value={loopsInput}
                          onChange={(event) => setLoopsInput(event.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-brand-violet/20 bg-white px-3 py-3 text-base font-black text-brand-graphite outline-none focus:border-brand-violet dark:bg-black/25 dark:text-white"
                        />
                        <span className="mt-1.5 block text-[10px] font-medium text-gray-500">Máximo: {maxLoopsForPayment} Loops</span>
                      </label>
                    )}
                  </section>

                  {/* Resumo da Compra */}
                  <div className="p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/15 space-y-2 text-xs">
                    <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-300">
                      <span>Data e Horário:</span>
                      <span className="font-bold text-brand-graphite dark:text-white">
                        {selectedDate} às {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-300">
                      <span>Ingressos ({guests}x):</span>
                      <span className="font-bold text-brand-graphite dark:text-white">
                        R$ {totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    {loopsToUse > 0 && (
                      <div className="flex justify-between font-bold text-brand-violet">
                        <span>Abatimento com Loops:</span>
                        <span>- R$ {loopsToUse.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span>Cashback sobre o saldo pago:</span>
                      <span>+{totalCashbackLoops} Loops</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-brand-graphite dark:text-white pt-2 border-t border-brand-violet/10">
                      <span>Total a Pagar Agora:</span>
                      <span className="text-brand-violet">
                        R$ {amountAfterLoops.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleProcessPayment}
                    className="w-full bg-gradient-loopis hover:opacity-95 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center space-x-2">
                        <Sparkles size={18} className="animate-spin" />
                        <span>Processando Pagamento...</span>
                      </span>
                    ) : (
                      <>
                        <Wallet size={18} />
                        <span>
                          {!isLoggedIn
                            ? 'Fazer Login para Pagar'
                            : `Pagar Agora (R$ ${amountAfterLoops.toFixed(2).replace('.', ',')})`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Step 2: Voucher Pago com Sucesso */
                <div className="py-6 text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg"
                  >
                    <CheckCircle2 size={44} />
                  </motion.div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-brand-graphite dark:text-white">
                      Experiência Paga com Sucesso!
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Seu ingresso digital está garantido e com pagamento confirmado. Apresente o QR Code na entrada.
                    </p>
                  </div>

                  {/* QR Code Voucher Card */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#232328] border border-gray-200 dark:border-white/10 shadow-xl max-w-sm mx-auto space-y-4 text-center">
                    <div className="w-36 h-36 bg-gray-100 dark:bg-white/10 rounded-2xl mx-auto flex items-center justify-center p-3">
                      <QrCode size={110} className="text-brand-graphite dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono font-extrabold text-[11px] uppercase border border-emerald-500/20">
                        <CheckCircle2 size={13} />
                        <span>{voucherCode || 'VOUCHER PAGO & CONFIRMADO'}</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-graphite dark:text-white mt-2">
                        {experience.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {selectedDate} às {selectedTime} • {guests} participantes
                      </p>
                      <p className="text-[11px] text-brand-violet font-semibold pt-1">
                        Local: {experience.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="flex-1 bg-gradient-loopis text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all text-xs sm:text-sm cursor-pointer"
                    >
                      Ver Meus Vouchers & Ingressos
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3.5 rounded-2xl bg-gray-100 dark:bg-white/10 text-brand-graphite dark:text-white font-bold text-xs sm:text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
