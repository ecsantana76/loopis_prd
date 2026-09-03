import React from 'react';
import { Bell, CheckCheck, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-brand-violet">Sua atividade</p>
          <h1 className="mt-1 text-3xl font-black text-brand-graphite dark:text-white">Notificações</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Acompanhe compras, reservas e pedidos de avaliação.</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllNotificationsRead} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-brand-violet dark:border-white/10 dark:bg-white/5">
            <CheckCheck size={15} /> Marcar lidas
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => { markNotificationRead(notification.id); navigate(`/avaliar/${notification.id}`); }}
            className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${notification.read ? 'border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.04]' : 'border-brand-violet/20 bg-brand-violet/5'}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
              <Star size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-black text-brand-graphite dark:text-white">{notification.title}</span>
                {!notification.read && <span className="h-2 w-2 rounded-full bg-brand-violet" />}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">{notification.message}</span>
              <span className="mt-2 block text-xs font-bold text-brand-violet">{notification.reviewId ? 'Avaliação enviada para moderação' : 'Toque para avaliar'}</span>
            </span>
            <ChevronRight size={18} className="mt-3 shrink-0 text-gray-400" />
          </button>
        ))}
        {notifications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-white/10">
            <Bell size={28} className="mx-auto text-gray-400" />
            <p className="mt-3 text-sm font-bold text-gray-500">Nenhuma notificação por enquanto.</p>
          </div>
        )}
      </div>
    </div>
  );
};
