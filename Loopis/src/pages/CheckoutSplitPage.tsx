import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Users, 
  Plus, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  Copy, 
  Lock, 
  ShieldCheck, 
  Home
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useSplitPayment } from '../hooks/useSplitPayment';
import { SplitParticipantCard } from '../components/checkout/SplitParticipantCard';
import { SplitProgressBar } from '../components/checkout/SplitProgressBar';
import { UserSearchModal } from '../components/checkout/UserSearchModal';
import { Toast } from '../components/common/Toast';
import type { UserSearchResult } from '../types';

export const CheckoutSplitPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderCode = searchParams.get('orderCode') || 'LOOP-8821';
  const netTotalParam = searchParams.get('netTotal');
  const netTotal = netTotalParam ? parseFloat(netTotalParam) : 241.20;

  const [singlePayMethod, setSinglePayMethod] = useState<'pix' | 'credit_card' | 'apple_pay'>('pix');
  const [userSearchParticipantId, setUserSearchParticipantId] = useState<string | null>(null);

  const {
    activeTab,
    setActiveTab,
    splitMode,
    setSplitMode,
    totalParts,
    participants,
    handleSetEqualParts,
    handleAddParticipant,
    handleRemoveParticipant,
    handleUpdateParticipantAmount,
    handleAssignUser,
    handleSimulatePayment,
    handlePayFullDirect,
    handleCopyLink,
    getWhatsAppShareUrl,
    stats,
    toastMessage,
    isCompletedModalOpen,
    setIsCompletedModalOpen,
  } = useSplitPayment({
    orderCode,
    restaurantName: 'Marisqueira Sintra',
    totalAmount: netTotal,
    initialParts: 2,
  });

  return (
    <div className="min-h-screen bg-brand-off-white dark:bg-brand-graphite pb-28 pt-4 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`/order-summary?code=${orderCode}`)}
            className="p-2.5 rounded-2xl bg-white dark:bg-white/10 text-brand-graphite dark:text-white hover:bg-gray-100 dark:hover:bg-white/15 border border-gray-200/60 dark:border-white/10 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-brand-graphite dark:text-white">
              Checkout Loopis
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              Comanda {orderCode} • Total R$ {netTotal.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="w-10 h-10 flex items-center justify-center text-brand-violet">
            <ShieldCheck size={22} className="text-emerald-500" />
          </div>
        </div>

        <div className="bg-gray-200/80 dark:bg-black/40 p-1.5 rounded-2xl flex relative">
          <button
            type="button"
            onClick={() => setActiveTab('full')}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'full'
                ? 'bg-white dark:bg-brand-graphite text-brand-violet shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-brand-graphite dark:hover:text-white'
            }`}
          >
            <CreditCard size={16} />
            <span>Pagar Tudo (Integral)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'split'
                ? 'bg-white dark:bg-brand-graphite text-brand-violet shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-brand-graphite dark:hover:text-white'
            }`}
          >
            <Users size={16} />
            <span>Dividir Conta (Split)</span>
          </button>
        </div>

        {activeTab === 'full' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-brand-graphite rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-lg text-center space-y-2">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Valor Total a Pagar
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-graphite dark:text-white">
                R$ {netTotal.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Você acumula +{Math.round(netTotal)} Loops de Cashback imediatamente após o pagamento!
              </p>
            </div>

            <div className="bg-white dark:bg-brand-graphite rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-brand-graphite dark:text-white">
                Escolha o Método de Pagamento
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSinglePayMethod('pix')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    singlePayMethod === 'pix'
                      ? 'border-brand-violet bg-brand-violet/5 dark:bg-brand-violet/10 text-brand-violet shadow-sm'
                      : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <QrCode size={22} className="mb-2" />
                  <h4 className="text-xs font-bold">Pix Instantâneo</h4>
                  <span className="text-[10px] text-gray-400">Aprovação imediata</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSinglePayMethod('credit_card')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    singlePayMethod === 'credit_card'
                      ? 'border-brand-violet bg-brand-violet/5 dark:bg-brand-violet/10 text-brand-violet shadow-sm'
                      : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <CreditCard size={22} className="mb-2" />
                  <h4 className="text-xs font-bold">Cartão de Crédito</h4>
                  <span className="text-[10px] text-gray-400">Até 3x sem juros</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSinglePayMethod('apple_pay')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    singlePayMethod === 'apple_pay'
                      ? 'border-brand-violet bg-brand-violet/5 dark:bg-brand-violet/10 text-brand-violet shadow-sm'
                      : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Sparkles size={22} className="mb-2" />
                  <h4 className="text-xs font-bold">Carteira Digital</h4>
                  <span className="text-[10px] text-gray-400">Apple / Google Pay</span>
                </button>
              </div>

              {singlePayMethod === 'pix' && (
                <div className="mt-4 p-5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="p-3 bg-white rounded-2xl shadow-md shrink-0">
                    <QRCodeSVG
                      value={`00020126580014BR.GOV.BCB.PIX0136${orderCode}-FULL520400005303986540${netTotal.toFixed(2)}5802BR5916LOOPIS BRASIL`}
                      size={120}
                      level="M"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="text-xs font-bold text-brand-graphite dark:text-white">
                      Escaneie ou copie a chave Pix
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Abra o app do seu banco e aponte para o QR Code acima para liquidar a comanda integral.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(`00020126580014BR.GOV.BCB.PIX0136${orderCode}-FULL`)}
                      className="px-3 py-1.5 bg-white dark:bg-white/10 hover:bg-gray-100 text-xs font-semibold rounded-xl border border-gray-200 dark:border-white/10 flex items-center space-x-1.5 mx-auto sm:mx-0 shadow-sm"
                    >
                      <Copy size={13} className="text-brand-violet" />
                      <span>Copiar Chave Pix</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handlePayFullDirect}
              className="w-full py-4.5 bg-gradient-loopis hover:opacity-95 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-xl shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock size={18} />
              <span>Confirmar Pagamento Integral (R$ {netTotal.toFixed(2).replace('.', ',')})</span>
            </button>
          </div>
        )}

        {activeTab === 'split' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SplitProgressBar
              totalAmount={netTotal}
              totalPaid={stats.totalPaid}
              totalRemaining={stats.totalRemaining}
              paidPercentage={stats.paidPercentage}
              totalParticipants={stats.totalParticipantsCount}
              paidParticipants={stats.paidParticipantsCount}
            />

            <div className="bg-white dark:bg-brand-graphite rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-brand-graphite dark:text-white">
                    Modo de Divisão
                  </h3>
                  <p className="text-xs text-gray-500">
                    Selecione a quantidade de partes iguais ou personalize valores
                  </p>
                </div>

                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-black/30 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSplitMode('equal');
                      handleSetEqualParts(totalParts);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      splitMode === 'equal'
                        ? 'bg-white dark:bg-brand-violet text-brand-violet dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-brand-graphite dark:hover:text-white'
                    }`}
                  >
                    Partes Iguais
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('custom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      splitMode === 'custom'
                        ? 'bg-white dark:bg-brand-violet text-brand-violet dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-brand-graphite dark:hover:text-white'
                    }`}
                  >
                    Customizado
                  </button>
                </div>
              </div>

              {splitMode === 'equal' && (
                <div>
                  <span className="text-[11px] text-gray-400 block mb-2 font-medium">
                    Dividir em quantas pessoas?
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[2, 3, 4, 5, 6, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSetEqualParts(num)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          totalParts === num
                            ? 'bg-brand-violet text-white border-brand-violet shadow-md'
                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-brand-violet/40'
                        }`}
                      >
                        {num} pessoas (R$ {(netTotal / num).toFixed(2).replace('.', ',')})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-gray-100 dark:border-white/10">
                <span className="text-xs text-gray-500">
                  {participants.length} participantes definidos
                </span>

                <button
                  type="button"
                  onClick={() => handleAddParticipant()}
                  className="px-3.5 py-1.5 bg-brand-violet/10 hover:bg-brand-violet/20 text-brand-violet dark:text-brand-lilac rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Plus size={14} />
                  <span>Adicionar Convidado</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {participants.map((participant, index) => (
                <SplitParticipantCard
                  key={participant.id}
                  participant={participant}
                  isMe={index === 0}
                  splitMode={splitMode}
                  onUpdateAmount={handleUpdateParticipantAmount}
                  onOpenUserSearch={(id) => setUserSearchParticipantId(id)}
                  onRemove={handleRemoveParticipant}
                  onSimulatePayment={handleSimulatePayment}
                  onCopyLink={handleCopyLink}
                  getWhatsAppUrl={getWhatsAppShareUrl}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <UserSearchModal
        isOpen={userSearchParticipantId !== null}
        onClose={() => setUserSearchParticipantId(null)}
        onSelectUser={(user: UserSearchResult) => {
          if (userSearchParticipantId) {
            handleAssignUser(userSearchParticipantId, user);
            setUserSearchParticipantId(null);
          }
        }}
      />

      <Toast message={toastMessage} />

      <AnimatePresence>
        {isCompletedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-brand-graphite rounded-3xl p-6 sm:p-8 text-center text-white border border-emerald-500/30 shadow-2xl z-10 space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  Conta 100% Liquidada!
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Todas as frações da comanda <span className="font-mono text-brand-lilac font-bold">{orderCode}</span> foram pagas com sucesso.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-amber-300 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Cashback Concedido:</span>
                </span>
                <span className="font-bold text-sm bg-amber-400/20 px-2 py-0.5 rounded-md">
                  +{Math.round(netTotal)} Loops
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCompletedModalOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-3.5 bg-gradient-loopis hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Home size={18} />
                  <span>Voltar para o Início</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
