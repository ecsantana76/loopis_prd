import React, { useMemo } from 'react';
import { MessageSquareText, Star } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface ApprovedReviewsSectionProps {
  partnerId: string;
  title?: string;
}

export const ApprovedReviewsSection: React.FC<ApprovedReviewsSectionProps> = ({
  partnerId,
  title = 'Avaliações da comunidade Loopis',
}) => {
  const internalReviews = useStore((state) => state.internalReviews);
  const reviews = useMemo(
    () => internalReviews.filter((review) => review.partnerId === partnerId && review.status === 'approved'),
    [internalReviews, partnerId],
  );
  const average = reviews.length > 0
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;

  return (
    <section className="mt-8 border-t border-gray-200 pt-7 dark:border-white/10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-brand-violet">Experiências verificadas</p>
          <h2 className="mt-1 text-xl font-black text-brand-graphite dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comentários de clientes que concluíram uma experiência pelo app.</p>
        </div>
        {reviews.length > 0 && (
          <div className="shrink-0 rounded-2xl bg-yellow-500/10 px-4 py-3 text-right">
            <p className="inline-flex items-center gap-1 text-lg font-black text-brand-graphite dark:text-white">
              <Star size={17} className="fill-yellow-500 text-yellow-500" /> {average.toFixed(1)}
            </p>
            <p className="text-[10px] font-bold text-gray-500">{reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}</p>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-violet/10 text-xs font-black text-brand-violet">
                    {review.userName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-brand-graphite dark:text-white">{review.userName}</p>
                    <p className="truncate text-[11px] text-gray-500">{review.experienceName}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-0.5" aria-label={`${review.rating} de 5 estrelas`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={13} className={star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300 dark:text-gray-700'} />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">“{review.comment}”</p>
              <p className="mt-3 text-[10px] font-bold text-gray-400">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 p-5 text-gray-500 dark:border-white/10 dark:text-gray-400">
          <MessageSquareText size={20} />
          <p className="text-sm">Este parceiro ainda não possui avaliações internas publicadas.</p>
        </div>
      )}
    </section>
  );
};
