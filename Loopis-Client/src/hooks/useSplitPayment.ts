import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type {
  SplitParticipant,
  SplitMode,
  UserSearchResult,
} from '../types';

import { useStore } from '../store/useStore';

interface UseSplitPaymentOptions {
  orderCode?: string;
  restaurantName?: string;
  totalAmount?: number;
  initialParts?: number;
  initialTab?: 'full' | 'split';
}

export const useSplitPayment = ({
  orderCode = 'LOOP-8821',
  restaurantName = 'Marisqueira Sintra',
  totalAmount = 241.20,
  initialParts = 2,
  initialTab = 'split',
}: UseSplitPaymentOptions = {}) => {
  const [activeTab, setActiveTab] = useState<'full' | 'split'>(initialTab);
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');
  const [totalParts, setTotalParts] = useState<number>(initialParts);

  const [participants, setParticipants] = useState<SplitParticipant[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);
  const completeClientPayment = useStore((state) => state.completeClientPayment);

  const buildEqualParticipants = useCallback((numParts: number, total: number): SplitParticipant[] => {
    const partAmount = Number((total / numParts).toFixed(2));
    const list: SplitParticipant[] = [];

    let allocatedSum = 0;

    for (let i = 0; i < numParts; i++) {
      const isMe = i === 0;
      let finalAmount = partAmount;

      if (i === numParts - 1) {
        finalAmount = Number((total - allocatedSum).toFixed(2));
      } else {
        allocatedSum += partAmount;
      }

      const id = isMe ? 'part_me' : `part_guest_${i + 1}`;
      const name = isMe ? 'Você (Organizador)' : `Convidado ${i + 1}`;
      const percentage = Number(((finalAmount / total) * 100).toFixed(1));
      const paymentUrl = `${window.location.origin}/checkout/pay?ref=${orderCode}&p=${id}&amt=${finalAmount}`;
      const pixPayload = `00020126580014BR.GOV.BCB.PIX0136${orderCode}-${id}520400005303986540${finalAmount.toFixed(2)}5802BR5916LOOPIS BRASIL6012FLORIANOPOLIS62070503***6304`;

      list.push({
        id,
        name,
        assignedType: isMe ? 'me' : 'guest',
        amount: finalAmount,
        percentage,
        isPaid: false,
        paymentUrl,
        pixQrCodePayload: pixPayload,
      });
    }
    return list;
  }, [orderCode]);

  useEffect(() => {
    setParticipants(buildEqualParticipants(totalParts, totalAmount));
  }, [totalParts, totalAmount, buildEqualParticipants]);

  const handleSetEqualParts = (parts: number) => {
    const clamped = Math.max(2, Math.min(12, parts));
    setTotalParts(clamped);
    setSplitMode('equal');
    setParticipants(buildEqualParticipants(clamped, totalAmount));
  };

  const handleAddParticipant = (user?: UserSearchResult) => {
    setParticipants(prev => {
      const nextIndex = prev.length + 1;
      const id = user ? `part_user_${user.id}` : `part_guest_${Date.now()}`;
      const name = user ? user.name : `Convidado ${nextIndex}`;
      const assignedType = user ? 'app_user' : 'guest';

      const newParticipant: SplitParticipant = {
        id,
        name,
        assignedType,
        username: user?.username,
        phone: user?.phone,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        amount: 0.00,
        percentage: 0,
        isPaid: false,
        paymentUrl: `${window.location.origin}/checkout/pay?ref=${orderCode}&p=${id}&amt=0`,
        pixQrCodePayload: `00020126580014BR.GOV.BCB.PIX0136${orderCode}-${id}5204000053039865400.005802BR5916LOOPIS BRASIL`,
      };

      const updated = [...prev, newParticipant];

      if (splitMode === 'equal') {
        return buildEqualParticipants(updated.length, totalAmount);
      }
      return updated;
    });
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 2) {
      showToast('O split precisa ter no mínimo 2 participantes.');
      return;
    }

    setParticipants(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (splitMode === 'equal') {
        return buildEqualParticipants(filtered.length, totalAmount);
      }
      return filtered;
    });
  };

  const handleUpdateParticipantAmount = (id: string, newAmount: number) => {
    setSplitMode('custom');
    setParticipants(prev =>
      prev.map(p => {
        if (p.id === id) {
          const clamped = Math.max(0, newAmount);
          const pct = Number(((clamped / totalAmount) * 100).toFixed(1));
          return {
            ...p,
            amount: Number(clamped.toFixed(2)),
            percentage: pct,
            paymentUrl: `${window.location.origin}/checkout/pay?ref=${orderCode}&p=${p.id}&amt=${clamped.toFixed(2)}`,
            pixQrCodePayload: `00020126580014BR.GOV.BCB.PIX0136${orderCode}-${p.id}520400005303986540${clamped.toFixed(2)}5802BR5916LOOPIS BRASIL`,
          };
        }
        return p;
      })
    );
  };

  const handleAssignUser = (participantId: string, user: UserSearchResult) => {
    setParticipants(prev =>
      prev.map(p => {
        if (p.id === participantId) {
          return {
            ...p,
            name: user.name,
            username: user.username,
            phone: user.phone,
            email: user.email,
            avatarUrl: user.avatarUrl,
            assignedType: 'app_user',
          };
        }
        return p;
      })
    );
    showToast(`Participante atribuído a ${user.name}`);
  };

  const handleSimulatePayment = (participantId: string) => {
    let participantName = '';
    let isCurrentMe = false;
    let participantEarnedLoops = 0;
    let assignedUsername = '';

    setParticipants(prev => {
      const updated = prev.map(p => {
        if (p.id === participantId) {
          participantName = p.name;
          isCurrentMe = p.id === 'part_me' || p.assignedType === 'me';
          participantEarnedLoops = Math.round(p.amount);
          assignedUsername = p.username || '';
          return {
            ...p,
            isPaid: true,
            paidAt: new Date().toISOString(),
            paymentMethod: 'pix' as const,
          };
        }
        return p;
      });

      // Se o próprio usuário (organizador) pagou a fração dele, credita na carteira dele
      if (isCurrentMe && participantEarnedLoops > 0) {
        useStore.setState((state) => ({
          loopsBalance: state.loopsBalance + participantEarnedLoops,
          transactions: [
            {
              id: 'split-me-' + Math.random().toString(36).substring(2, 9),
              date: new Date().toISOString(),
              amount: participantEarnedLoops,
              type: 'earn',
              description: `Sua Fração Paga: Comanda ${orderCode} (${restaurantName})`
            },
            ...state.transactions
          ]
        }));
      }

      const allPaid = updated.every(p => p.isPaid);
      if (allPaid) {
        triggerConfetti();
        setIsCompletedModalOpen(true);
      }

      return updated;
    });

    if (isCurrentMe) {
      showToast(`Você pagou sua parte e recebeu +${participantEarnedLoops} Loops na sua carteira! 🎉`);
    } else if (assignedUsername) {
      showToast(`Pagamento confirmado! +${participantEarnedLoops} Loops creditados no perfil de @${assignedUsername} 🎁`);
    } else {
      showToast(`Fração de ${participantName} liquidada (+${participantEarnedLoops} Loops gerados) ✨`);
    }
  };

  const handlePayFullDirect = (loopsUsed = 0) => {
    const normalizedLoops = Math.max(0, Math.min(Math.floor(loopsUsed), Math.floor(totalAmount)));
    const cashPaid = Math.max(0, Number((totalAmount - normalizedLoops).toFixed(2)));
    const earnedLoops = Math.round(cashPaid);
    const completed = completeClientPayment(
      `Pagamento integral da comanda ${orderCode} (${restaurantName})`,
      normalizedLoops,
      earnedLoops,
    );
    if (!completed) {
      showToast('Saldo de Loops insuficiente. Revise a quantidade informada.');
      return;
    }

    setParticipants(prev =>
      prev.map(p => ({
        ...p,
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentMethod: 'credit_card' as const,
      }))
    );
    triggerConfetti();
    setIsCompletedModalOpen(true);
    showToast(normalizedLoops > 0 ? `Pagamento concluído com ${normalizedLoops} Loops de abatimento.` : 'Comanda integral paga com sucesso!');
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#C4A1F5', '#3D1E6D', '#10B981', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopyLink = async (paymentUrl: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(paymentUrl);
      }
      showToast('Link de pagamento copiado para a área de transferência!');
    } catch {
      showToast('Link copiado: ' + paymentUrl);
    }
  };

  const getWhatsAppShareUrl = (participant: SplitParticipant) => {
    const text = encodeURIComponent(
      `Olá ${participant.name}! Aqui está a sua parte da conta no ${restaurantName} (Comanda ${orderCode}).\n\n` +
      `💰 Valor da sua fração: R$ ${participant.amount.toFixed(2).replace('.', ',')}\n` +
      `📲 Pague via Pix ou Cartão pelo link: ${participant.paymentUrl}\n\n` +
      `Pague pelo Loopis e acumule Loops de Cashback! ✨`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const stats = useMemo(() => {
    const totalAssigned = participants.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = participants.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0);
    const totalRemaining = Math.max(0, Number((totalAmount - totalPaid).toFixed(2)));
    const unallocatedDifference = Number((totalAmount - totalAssigned).toFixed(2));
    const paidPercentage = Math.min(100, Math.round((totalPaid / totalAmount) * 100));
    const isFullyPaid = totalRemaining <= 0.01;
    const isBalanced = Math.abs(unallocatedDifference) <= 0.05;

    return {
      totalAssigned: Number(totalAssigned.toFixed(2)),
      totalPaid: Number(totalPaid.toFixed(2)),
      totalRemaining,
      unallocatedDifference,
      paidPercentage,
      isFullyPaid,
      isBalanced,
      totalParticipantsCount: participants.length,
      paidParticipantsCount: participants.filter(p => p.isPaid).length,
    };
  }, [participants, totalAmount]);

  return {
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
    showToast,
    isCompletedModalOpen,
    setIsCompletedModalOpen,
  };
};
