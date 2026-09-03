import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, 
  UserPlus, 
  Copy, 
  Check, 
  Sparkles, 
  Trash2, 
  QrCode, 
  MessageCircle,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Gift
} from 'lucide-react';
import type { SplitParticipant, SplitMode } from '../../types';

interface SplitParticipantCardProps {
  participant: SplitParticipant;
  isMe: boolean;
  splitMode: SplitMode;
  onUpdateAmount: (id: string, amount: number) => void;
  onOpenUserSearch: (participantId: string) => void;
  onRemove: (id: string) => void;
  onSimulatePayment: (id: string) => void;
  onCopyLink: (url: string) => void;
  getWhatsAppUrl: (participant: SplitParticipant) => string;
}

export const SplitParticipantCard: React.FC<SplitParticipantCardProps> = ({
  participant,
  isMe,
  splitMode,
  onUpdateAmount,
  onOpenUserSearch,
  onRemove,
  onSimulatePayment,
  onCopyLink,
  getWhatsAppUrl,
}) => {
  const [showQr, setShowQr] = useState<boolean>(!isMe);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    onCopyLink(participant.paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const participantLoops = Math.round(participant.amount);

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border transition-all ${
      participant.isPaid
        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
        : isMe
        ? 'bg-gradient-to-br from-brand-violet/5 via-white to-brand-lilac/5 dark:from-brand-deep-purple/30 dark:to-brand-graphite border-brand-violet/30 shadow-md'
        : 'bg-white dark:bg-brand-graphite border-gray-100 dark:border-white/10 shadow-sm'
    }`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            {participant.avatarUrl ? (
              <img
                src={participant.avatarUrl}
                alt={participant.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-violet"
              />
            ) : (
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                isMe
                  ? 'bg-gradient-loopis text-white shadow-md'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
              }`}>
                {isMe ? <User size={22} /> : (participant.name?.charAt(0) || '?').toUpperCase()}
              </div>
            )}
            {participant.isPaid && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-brand-graphite shadow">
                ✓
              </span>
            )}
          </div>

          {/* Name & Details */}
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <h4 className="text-sm font-bold text-brand-graphite dark:text-white truncate">
                {participant.name}
              </h4>
              {isMe && (
                <span className="text-[10px] bg-brand-violet/10 text-brand-violet dark:text-brand-lilac font-bold px-2 py-0.5 rounded-full">
                  Você
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {participant.assignedType === 'app_user' ? (
                <span className="text-brand-violet font-semibold">
                  {participant.username || participant.phone}
                </span>
              ) : isMe ? (
                <span>Organizador da Mesa</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenUserSearch(participant.id)}
                  className="text-[11px] text-brand-violet hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <UserPlus size={12} />
                  <span>Vincular usuário Loopis</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Amount / Value Display or Edit */}
        <div className="text-right shrink-0">
          {splitMode === 'custom' && !participant.isPaid ? (
            <div className="relative">
              <span className="text-xs text-gray-400 mr-1 font-bold">R$</span>
              <input
                type="number"
                step="0.50"
                value={participant.amount || ''}
                onChange={(e) => onUpdateAmount(participant.id, parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 bg-gray-50 dark:bg-black/40 border border-brand-violet/40 rounded-xl text-right font-extrabold text-sm text-brand-graphite dark:text-white outline-none focus:ring-2 focus:ring-brand-violet"
              />
            </div>
          ) : (
            <div>
              <span className="text-base sm:text-lg font-extrabold text-brand-graphite dark:text-white">
                R$ {participant.amount.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[11px] text-gray-400 block font-medium">
                {participant.percentage}% da conta
              </span>
            </div>
          )}

          {/* Delete Action (if not me and not paid) */}
          {!isMe && !participant.isPaid && (
            <button
              type="button"
              onClick={() => onRemove(participant.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 mt-1 inline-block cursor-pointer"
              title="Remover participante"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Loops Cashback Attribution Badge */}
      <div className="mt-3 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-semibold">
        <div className="flex items-center space-x-1.5">
          <Gift size={14} className="text-amber-500 shrink-0" />
          <span>
            {isMe
              ? 'Seu Cashback ao pagar:'
              : participant.assignedType === 'app_user'
              ? `Cashback no perfil de ${participant.name}:`
              : 'Cashback gerado nesta fração:'}
          </span>
        </div>
        <span className="font-extrabold bg-amber-400/20 px-2 py-0.5 rounded-md text-amber-700 dark:text-amber-200 text-[11px]">
          +{participantLoops} Loops
        </span>
      </div>

      {/* Guest Specific QR Code and Sharing Actions */}
      {!isMe && !participant.isPaid && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
          {/* Toggle QR Code Preview */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300 font-semibold hover:text-brand-violet transition-colors cursor-pointer"
            >
              <QrCode size={14} className="text-brand-violet" />
              <span>QR Code Pix da Fração</span>
              {showQr ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <span className="text-[11px] text-gray-400">Pix Copia e Cola / Link</span>
          </div>

          {/* QR Code Canvas */}
          {showQr && (
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200/60 dark:border-white/5">
              <div className="p-2.5 bg-white rounded-2xl shadow-md shrink-0">
                <QRCodeSVG
                  value={participant.pixQrCodePayload || participant.paymentUrl}
                  size={100}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-xs">
                  <span className="font-bold text-brand-graphite dark:text-white block">
                    Pagar R$ {participant.amount.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-gray-500 leading-tight block">
                    {participant.assignedType === 'app_user'
                      ? `Link exclusivo para ${participant.name} receber os Loops direto no perfil.`
                      : 'Envie o link para o convidado pagar e acumular Loops.'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-brand-graphite dark:text-white flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-brand-violet" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp Share Button */}
                  <a
                    href={getWhatsAppUrl(participant)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Simulate Payment Trigger Button */}
          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={() => onSimulatePayment(participant.id)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Simular Pagamento ({participant.name})</span>
            </button>
          </div>
        </div>
      )}

      {/* Organizer Direct Pay CTA */}
      {isMe && !participant.isPaid && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-500">Sua parte: R$ {participant.amount.toFixed(2).replace('.', ',')}</span>
          <button
            type="button"
            onClick={() => onSimulatePayment(participant.id)}
            className="px-4 py-2 bg-gradient-loopis hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 active:scale-95 cursor-pointer"
          >
            <CreditCard size={14} />
            <span>Pagar Minha Parte</span>
          </button>
        </div>
      )}

      {/* Paid Status Confirmation with Points Highlight */}
      {participant.isPaid && (
        <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <span className="flex items-center space-x-1.5">
            <Check size={14} />
            <span>
              {isMe
                ? `Pago! +${participantLoops} Loops creditados na sua conta`
                : participant.assignedType === 'app_user'
                ? `Pago! +${participantLoops} Loops creditados para @${participant.username || participant.name}`
                : `Pago! +${participantLoops} Loops liberados`}
            </span>
          </span>
          <span className="text-[11px] font-normal text-gray-500">
            {new Date(participant.paidAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
};
