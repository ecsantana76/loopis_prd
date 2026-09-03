interface GenerateWhatsAppSplitLinkParams {
  experienceName: string;
  participantName: string;
  amount: number;
  guestPaymentUrl: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const generateWhatsAppSplitLink = ({
  experienceName,
  participantName,
  amount,
  guestPaymentUrl,
}: GenerateWhatsAppSplitLinkParams): string => {
  const message = [
    `Oi, ${participantName}!`,
    `Sua parte em ${experienceName}, em Floripa, ficou ${formatCurrency(amount)}.`,
    `Pague pelo link: ${guestPaymentUrl}`,
  ].join(' ');

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};
