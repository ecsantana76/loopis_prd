import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Check, 
  Users, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Receipt, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { ReceiptScannerModal } from '../components/ReceiptScannerModal';

export const CheckIn: React.FC = () => {
  const { activeReservation, updateReservationStatus, restaurants } = useStore();
  const navigate = useNavigate();
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const handleCheckIn = () => {
    updateReservationStatus('checked_in');
  };

  if (!activeReservation) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-brand-violet/10 rounded-3xl flex items-center justify-center mb-6">
          <Calendar size={36} className="text-brand-violet" />
        </div>
        <h2 className="text-2xl font-bold text-brand-graphite dark:text-white mb-2">Nenhuma reserva encontrada</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          Você não possui reservas ativas no momento. Explore nossos parceiros e garanta seu benefício.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-gradient-loopis text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-brand-violet/20 hover:scale-[1.02] transition-transform cursor-pointer"
        >
          Explorar Parceiros
        </button>
      </div>
    );
  }

  const isCheckedIn = activeReservation.status === 'checked_in' || activeReservation.status === 'completed';
  const isCompleted = activeReservation.status === 'completed';
  const restaurantName = 
    activeReservation.restaurantName || 
    restaurants.find(r => r.id === activeReservation.restaurantId)?.nome || 
    'Restaurante Parceiro';

  return (
    <div className="pb-24 animate-in fade-in duration-500 max-w-2xl mx-auto px-4 sm:px-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-brand-graphite dark:text-brand-off-white">
            Minha Reserva & Check-in
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Valide sua chegada e pague sua comanda pelo app para acumular Loops.
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-brand-violet bg-brand-violet/10 px-3 py-1 rounded-full uppercase">
          #{activeReservation.id || '---'}
        </span>
      </div>

      <div className="bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-white/5 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-loopis text-white flex items-center justify-center font-bold text-xl shadow-md">
              {(restaurantName.charAt(0) || 'R').toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-graphite dark:text-white">
                {restaurantName}
              </h2>
              <span className="text-xs text-gray-400 flex items-center mt-0.5">
                <MapPin size={12} className="mr-1 text-brand-violet" />
                Florianópolis - SC
              </span>
            </div>
          </div>
          
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              : isCheckedIn 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-brand-violet/10 text-brand-violet'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>
              {isCompleted ? 'Conta Paga & Finalizada' : isCheckedIn ? 'Check-in Realizado (Na Mesa)' : 'Reserva Confirmada'}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl flex items-center space-x-3">
            <Clock size={20} className="text-brand-violet shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Data & Hora</p>
              <p className="font-bold text-brand-graphite dark:text-white">{activeReservation.date} • {activeReservation.time}</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl flex items-center space-x-3">
            <Users size={20} className="text-brand-violet shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Mesa para</p>
              <p className="font-bold text-brand-graphite dark:text-white">{activeReservation.guests} pessoas</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isCheckedIn ? (
          <motion.div
            key="checkin-action"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-brand-violet/10 via-brand-violet/5 to-transparent p-6 rounded-3xl border border-brand-violet/20 space-y-4"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-brand-violet/20 rounded-2xl text-brand-violet mt-0.5">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-graphite dark:text-white">Chegou ao parceiro?</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Confirme sua chegada para validar sua mesa. Em seguida, envie sua nota fiscal para ler os itens e pagar a comanda pelo app.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckIn}
              className="w-full bg-gradient-loopis text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <CheckCircle2 size={18} />
              <span>Confirmar Check-in no Parceiro</span>
            </button>
          </motion.div>
        ) : !isCompleted ? (
          <motion.div
            key="fiscal-action"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800 dark:text-emerald-300">
              <Check size={18} className="text-emerald-500 shrink-0" />
              <span>
                Você está conectado na mesa de <strong>{restaurantName}</strong>.
              </span>
            </div>

            <div className="bg-white dark:bg-[#1a1a1c] border border-brand-violet/20 rounded-3xl p-6 shadow-xl shadow-brand-violet/5 space-y-5">
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
                  <Receipt size={24} />
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-violet/10 text-brand-violet dark:text-brand-lilac text-[10px] font-extrabold uppercase tracking-wider">
                    Etapa Obrigatória
                  </span>
                  <h3 className="text-base font-extrabold text-brand-graphite dark:text-white">
                    Enviar Nota Fiscal & Pagar Conta
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Ao solicitar o fechamento da mesa, escaneie o cupom fiscal ou código da comanda. O sistema fará a leitura detalhada dos itens e valor da conta para você realizar o pagamento seguro por dentro do app.
                  </p>
                </div>
              </div>

              <div className="bg-brand-violet/5 p-4 rounded-2xl border border-brand-violet/15 space-y-2 text-xs text-brand-deep-purple dark:text-brand-lilac">
                <div className="flex items-center space-x-2 font-bold">
                  <Sparkles size={16} className="text-brand-violet" />
                  <span>Benefícios ao pagar pelo app:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-gray-600 dark:text-gray-300 pl-4 list-disc">
                  <li>Leitura automática de cada prato, bebida e taxas da nota</li>
                  <li>Divisão facilitada (Split Payment) com envio de link por WhatsApp</li>
                  <li>Crédito imediato de até 25% de cashback em Loops após o pagamento</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="w-full bg-gradient-loopis hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Receipt size={18} />
                  <span>Escanear Cupom Fiscal</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/carteira/ler-cupom')}
                  className="w-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-brand-graphite dark:text-white font-bold py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm border border-gray-200/60 dark:border-white/10 cursor-pointer"
                >
                  <ArrowRight size={16} />
                  <span>Upload de Foto da Nota</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="completed-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                Experiência Concluída & Conta Paga!
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sua comanda foi liquidada pelo app e seus Loops de cashback já foram creditados na carteira.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/carteira')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md transition-all"
            >
              Ver Saldo na Carteira
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ReceiptScannerModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
};
