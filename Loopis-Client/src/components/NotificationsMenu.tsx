import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const NotificationsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openNotification = (notificationId: string) => {
    markNotificationRead(notificationId);
    setIsOpen(false);
    navigate(`/avaliar/${notificationId}`);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/70 bg-gray-100 text-gray-700 transition hover:bg-gray-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        title="Notificações"
        aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ''}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-brand-violet px-1 text-[9px] font-black text-white dark:border-[#1a1a1c]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1f]">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/10">
            <div>
              <p className="text-sm font-black text-brand-graphite dark:text-white">Notificações</p>
              <p className="mt-0.5 text-[11px] text-gray-500">Atualizações das suas experiências</p>
            </div>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllNotificationsRead} className="inline-flex items-center gap-1 text-[11px] font-black text-brand-violet">
                <CheckCheck size={14} /> Marcar lidas
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto p-2">
            {notifications.slice(0, 4).map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openNotification(notification.id)}
                className={`mb-1 flex w-full items-start gap-3 rounded-xl p-3 text-left transition last:mb-0 ${notification.read ? 'hover:bg-gray-50 dark:hover:bg-white/5' : 'bg-brand-violet/8 hover:bg-brand-violet/12'}`}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
                  <Star size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-xs font-black text-brand-graphite dark:text-white">{notification.title}</span>
                    {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-violet" />}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{notification.message}</span>
                  <span className="mt-2 block text-[10px] font-bold text-brand-violet">{notification.reviewId ? 'Avaliação enviada' : 'Avaliar agora'}</span>
                </span>
                <ChevronRight size={15} className="mt-3 shrink-0 text-gray-400" />
              </button>
            ))}
          </div>

          <button type="button" onClick={() => { setIsOpen(false); navigate('/notificacoes'); }} className="w-full border-t border-gray-100 px-4 py-3 text-xs font-black text-brand-violet transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5">
            Ver todas as notificações
          </button>
        </div>
      )}
    </div>
  );
};
