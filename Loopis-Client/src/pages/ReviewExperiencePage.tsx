import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageSquareText, ShieldCheck, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';

const ratingLabels = ['', 'Muito ruim', 'Ruim', 'Regular', 'Muito bom', 'Excelente'];

export const ReviewExperiencePage: React.FC = () => {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, notifications, internalReviews, submitReview } = useStore();
  const notification = notifications.find((item) => item.id === notificationId);
  const existingReview = useMemo(
    () => internalReviews.find((review) => review.notificationId === notificationId),
    [internalReviews, notificationId],
  );
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(Boolean(existingReview));

  if (!notification) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
        <MessageSquareText size={30} className="mx-auto text-gray-400" />
        <h1 className="mt-4 text-xl font-black dark:text-white">Avaliação não encontrada</h1>
        <button type="button" onClick={() => navigate('/notificacoes')} className="mt-5 rounded-xl bg-brand-violet px-4 py-2.5 text-sm font-black text-white">Voltar às notificações</button>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
        <ShieldCheck size={30} className="mx-auto text-brand-violet" />
        <h1 className="mt-4 text-xl font-black dark:text-white">Entre para avaliar sua experiência</h1>
        <p className="mt-2 text-sm text-gray-500">As avaliações são vinculadas a visitas concluídas e verificadas pelo Loopis.</p>
        <button type="button" onClick={() => navigate(`/auth?redirect=/avaliar/${notification.id}`)} className="mt-5 rounded-xl bg-brand-violet px-4 py-2.5 text-sm font-black text-white">Entrar no app</button>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (rating === 0) {
      setError('Selecione uma nota de 1 a 5 estrelas.');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Conte um pouco mais sobre sua experiência, usando pelo menos 10 caracteres.');
      return;
    }
    const reviewId = submitReview(notification.id, rating, comment);
    if (!reviewId) {
      setError('Não foi possível enviar esta avaliação. Verifique se ela já foi respondida.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1f]">
        <div className="bg-emerald-500/10 p-8 text-center">
          <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
          <h1 className="mt-4 text-2xl font-black text-brand-graphite dark:text-white">Avaliação enviada</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">Obrigado por compartilhar sua experiência. O comentário está aguardando moderação antes de aparecer na página do parceiro.</p>
        </div>
        <div className="grid gap-2 p-5 sm:grid-cols-2">
          <button type="button" onClick={() => navigate('/notificacoes')} className="rounded-xl border border-gray-200 py-3 text-sm font-black text-gray-600 dark:border-white/10 dark:text-gray-300">Notificações</button>
          <button type="button" onClick={() => navigate(notification.partnerRoute)} className="rounded-xl bg-brand-violet py-3 text-sm font-black text-white">Ver página do parceiro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl pb-24">
      <button type="button" onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-violet">
        <ArrowLeft size={17} /> Voltar
      </button>
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1f]">
        <div className="bg-brand-violet/8 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-wider text-brand-violet">Experiência concluída</p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-brand-graphite dark:text-white">O que achou da sua visita a {notification.partnerName}?</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{notification.experienceName}</p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <fieldset>
            <legend className="text-sm font-black text-brand-graphite dark:text-white">Sua nota</legend>
            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setRating(value); setError(''); }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                  aria-label={`${value} ${value === 1 ? 'estrela' : 'estrelas'}`}
                >
                  <Star size={25} className={value <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300 dark:text-gray-600'} />
                </button>
              ))}
            </div>
            <p className="mt-2 h-5 text-xs font-bold text-brand-violet">{rating > 0 ? ratingLabels[rating] : 'Selecione de 1 a 5 estrelas'}</p>
          </fieldset>

          <label className="block text-sm font-black text-brand-graphite dark:text-white">
            Conte como foi sua experiência
            <textarea
              title="Descrição da avaliação"
              value={comment}
              onChange={(event) => { setComment(event.target.value); setError(''); }}
              rows={6}
              maxLength={600}
              placeholder="Fale sobre atendimento, organização, estrutura e os momentos que mais gostou."
              className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-brand-graphite outline-none focus:border-brand-violet dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <span className="mt-1 block text-right text-[10px] font-bold text-gray-400">{comment.length}/600</span>
          </label>

          {error && <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-300">{error}</p>}

          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
            <p className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400"><ShieldCheck size={15} className="text-brand-violet" /> Sua avaliação passará por moderação antes da publicação.</p>
          </div>

          <button type="submit" className="w-full rounded-2xl bg-brand-violet py-3.5 text-sm font-black text-white shadow-lg shadow-brand-violet/20">Enviar avaliação</button>
        </div>
      </form>
    </div>
  );
};
