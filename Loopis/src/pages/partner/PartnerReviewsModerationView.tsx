import React, { useMemo, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, MessageSquareText, Search, ShieldCheck, Star, XCircle } from 'lucide-react';
import { usePartnerContext } from '../../hooks/usePartnerContext';
import { PartnerType, type PartnerType as PartnerTypeValue } from '../../types';

type ReviewStatus = 'pending' | 'approved' | 'hidden' | 'rejected';
type ReviewFilter = 'all' | ReviewStatus;

interface ModerationReview {
  id: string;
  partnerType: PartnerTypeValue;
  clientName: string;
  experienceName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
}

const initialReviews: ModerationReview[] = [
  { id: 'review-rest-1', partnerType: PartnerType.RESTAURANT, clientName: 'Marina Costa', experienceName: 'Reserva para jantar', rating: 5, comment: 'Atendimento muito cuidadoso e a sequência de frutos do mar estava excelente. A reserva pelo Loopis funcionou sem espera.', createdAt: '2026-08-20T12:40:00.000Z', status: 'pending' },
  { id: 'review-rest-2', partnerType: PartnerType.RESTAURANT, clientName: 'Felipe Andrade', experienceName: 'Sunset no deck', rating: 4, comment: 'Vista linda, pratos bem servidos e pagamento com Loops muito simples.', createdAt: '2026-08-18T20:15:00.000Z', status: 'approved' },
  { id: 'review-rest-3', partnerType: PartnerType.RESTAURANT, clientName: 'Carolina Medeiros', experienceName: 'Almoço em família', rating: 3, comment: 'A comida estava boa, mas demorou um pouco mais do que esperávamos.', createdAt: '2026-08-16T15:10:00.000Z', status: 'hidden' },
  { id: 'review-tour-1', partnerType: PartnerType.TOUR, clientName: 'Bianca Souza', experienceName: 'Passeio de Lancha na Costa da Lagoa', rating: 5, comment: 'Passeio pontual, equipe atenciosa e paradas excelentes para banho.', createdAt: '2026-08-20T18:25:00.000Z', status: 'pending' },
  { id: 'review-tour-2', partnerType: PartnerType.TOUR, clientName: 'Rodrigo Lima', experienceName: 'Trilha da Lagoinha do Leste', rating: 5, comment: 'Guia muito preparado e grupo pequeno. A experiência foi segura do início ao fim.', createdAt: '2026-08-17T17:40:00.000Z', status: 'approved' },
  { id: 'review-event-1', partnerType: PartnerType.EVENT, clientName: 'Camila Silveira', experienceName: 'Floripa Sunset Sessions', rating: 4, comment: 'Entrada rápida pelo voucher e estrutura ótima. Poderiam ter mais pontos de água.', createdAt: '2026-08-19T23:45:00.000Z', status: 'pending' },
  { id: 'review-event-2', partnerType: PartnerType.EVENT, clientName: 'André Freitas', experienceName: 'Jazz & Wine Experience', rating: 5, comment: 'Organização impecável, som excelente e setor VIP realmente confortável.', createdAt: '2026-08-15T23:15:00.000Z', status: 'approved' },
  { id: 'review-rental-1', partnerType: PartnerType.RENTAL, clientName: 'Lucas Neves', experienceName: 'Quadra de beach tennis', rating: 5, comment: 'Quadra bem cuidada, iluminação ótima e retirada dos equipamentos sem burocracia.', createdAt: '2026-08-20T10:30:00.000Z', status: 'pending' },
  { id: 'review-rental-2', partnerType: PartnerType.RENTAL, clientName: 'Paula Nunes', experienceName: 'Locação de jet-ski', rating: 4, comment: 'Equipamento novo e briefing claro. O atendimento no ponto de retirada foi rápido.', createdAt: '2026-08-14T16:20:00.000Z', status: 'approved' },
];

const statusConfig: Record<ReviewStatus, { label: string; className: string }> = {
  pending: { label: 'Aguardando moderação', className: 'bg-yellow-500/15 text-yellow-300' },
  approved: { label: 'Publicada', className: 'bg-emerald-500/15 text-emerald-300' },
  hidden: { label: 'Oculta', className: 'bg-blue-500/15 text-blue-300' },
  rejected: { label: 'Rejeitada', className: 'bg-red-500/15 text-red-300' },
};

export const PartnerReviewsModerationView: React.FC = () => {
  const partner = usePartnerContext();
  const [reviews, setReviews] = useState<ModerationReview[]>(initialReviews);
  const [filter, setFilter] = useState<ReviewFilter>('all');
  const [search, setSearch] = useState('');

  const partnerReviews = useMemo(
    () => reviews.filter((review) => review.partnerType === partner.partnerType),
    [partner.partnerType, reviews],
  );
  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    return partnerReviews.filter((review) => {
      if (filter !== 'all' && review.status !== filter) return false;
      if (!query) return true;
      return `${review.clientName} ${review.experienceName} ${review.comment}`.toLowerCase().includes(query);
    });
  }, [filter, partnerReviews, search]);

  const updateStatus = (reviewId: string, status: ReviewStatus) => {
    setReviews((current) => current.map((review) => (review.id === reviewId ? { ...review, status } : review)));
  };

  const counts = {
    pending: partnerReviews.filter((review) => review.status === 'pending').length,
    approved: partnerReviews.filter((review) => review.status === 'approved').length,
    hidden: partnerReviews.filter((review) => review.status === 'hidden').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-lilac">Reputação do parceiro</p>
          <h2 className="mt-1 text-2xl font-black">Avaliações</h2>
          <p className="mt-1 text-sm text-gray-400">Modere comentários de clientes verificados e controle o que aparece na página pública.</p>
        </div>
        <div className="relative w-full lg:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <label htmlFor="review-search" className="sr-only">Buscar avaliações</label>
          <input id="review-search" title="Buscar avaliações" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cliente ou experiência" className="w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-brand-violet" />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Pendentes', value: counts.pending, icon: ShieldCheck, color: 'text-yellow-300' },
          { label: 'Publicadas', value: counts.approved, icon: Eye, color: 'text-emerald-300' },
          { label: 'Ocultas', value: counts.hidden, icon: EyeOff, color: 'text-blue-300' },
        ].map((metric) => (
          <div key={metric.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-black/25 ${metric.color}`}><metric.icon size={20} /></div>
            <div><p className="text-2xl font-black">{metric.value}</p><p className="text-xs font-bold text-gray-500">{metric.label}</p></div>
          </div>
        ))}
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {([
          ['all', 'Todas'],
          ['pending', 'Pendentes'],
          ['approved', 'Publicadas'],
          ['hidden', 'Ocultas'],
          ['rejected', 'Rejeitadas'],
        ] as Array<[ReviewFilter, string]>).map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black transition ${filter === value ? 'bg-brand-violet text-white' : 'border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white'}`}>{label}</button>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        <div className="divide-y divide-white/10">
          {filteredReviews.map((review) => (
            <article key={review.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-violet/15 text-xs font-black text-brand-lilac">
                    {review.clientName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-white">{review.clientName}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusConfig[review.status].className}`}>{statusConfig[review.status].label}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{review.experienceName} • {new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
                    <div className="mt-3 flex gap-0.5" aria-label={`${review.rating} de 5 estrelas`}>
                      {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} className={star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'} />)}
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">“{review.comment}”</p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 pl-14 lg:pl-0">
                  {review.status !== 'approved' && review.status !== 'rejected' && (
                    <button type="button" onClick={() => updateStatus(review.id, 'approved')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white"><CheckCircle2 size={15} /> Publicar</button>
                  )}
                  {review.status === 'approved' && (
                    <button type="button" onClick={() => updateStatus(review.id, 'hidden')} className="inline-flex items-center gap-2 rounded-xl border border-blue-500/25 px-3 py-2 text-xs font-black text-blue-300"><EyeOff size={15} /> Ocultar</button>
                  )}
                  {review.status !== 'rejected' && (
                    <button type="button" onClick={() => updateStatus(review.id, 'rejected')} className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 px-3 py-2 text-xs font-black text-red-300"><XCircle size={15} /> Rejeitar</button>
                  )}
                </div>
              </div>
            </article>
          ))}
          {filteredReviews.length === 0 && (
            <div className="p-10 text-center">
              <MessageSquareText size={28} className="mx-auto text-gray-600" />
              <p className="mt-3 text-sm font-bold text-gray-500">Nenhuma avaliação encontrada neste filtro.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
