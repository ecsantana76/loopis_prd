import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserCheck, Coins, Users, UserPlus, Clock, Check, Sparkles } from 'lucide-react';
import type { UserSearchResult } from '../../types';
import { mockApi } from '../../services/mockApi';
import { useStore } from '../../store/useStore';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserSearchResult) => void;
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const { friends, friendInvites, sendFriendInvite, acceptFriendInvite } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  const showInviteFeedback = (msg: string) => {
    setInviteSuccessMsg(msg);
    setTimeout(() => setInviteSuccessMsg(null), 3000);
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    let isMounted = true;
    async function search() {
      setIsLoading(true);
      try {
        const list = await mockApi.searchUsers(query);
        if (isMounted) {
          setResults(list);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    const timer = setTimeout(search, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, query]);

  // Lista de amigos formatada como UserSearchResult
  const friendsAsResults: UserSearchResult[] = friends.map((f) => ({
    id: f.userId,
    name: f.name,
    username: f.username,
    phone: f.phone,
    email: f.email,
    avatarUrl: f.avatarUrl,
    loopsBalance: f.loopsBalance,
  }));

  // Filtra amigos pela query se houver
  const filteredFriends = query.trim() === ''
    ? friendsAsResults
    : friendsAsResults.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.username.toLowerCase().includes(query.toLowerCase()) ||
        f.phone.includes(query)
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="app-modal-backdrop fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="app-modal-panel relative z-10 flex w-full max-w-md max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border border-gray-100 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-brand-graphite sm:rounded-3xl sm:p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-loopis text-white flex items-center justify-center shadow-md">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-graphite dark:text-white">
                    Dividir Conta com Amigos
                  </h3>
                  <p className="text-xs text-gray-500">Selecione um amigo conectado para dividir</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Banner Informativo */}
            <div className="mt-3 p-2.5 rounded-xl bg-brand-violet/5 border border-brand-violet/15 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <Sparkles size={15} className="text-brand-violet shrink-0" />
              <span>Apenas amigos que <strong>aceitaram seu convite</strong> podem ser adicionados à mesa.</span>
            </div>

            {inviteSuccessMsg && (
              <div className="mt-2 p-2 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow animate-in fade-in">
                <Check size={14} />
                <span>{inviteSuccessMsg}</span>
              </div>
            )}

            {/* Search Input */}
            <div className="my-3 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar amigo por nome, @handle ou telefone..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white placeholder-gray-400 rounded-2xl border border-gray-200 dark:border-white/10 text-xs outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* 1. SEÇÃO DE AMIGOS CONECTADOS (PRIORIDADE) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-brand-violet dark:text-brand-lilac flex items-center gap-1">
                    <UserCheck size={13} />
                    <span>Seus Amigos Conectados ({filteredFriends.length})</span>
                  </h4>
                </div>

                {filteredFriends.length === 0 ? (
                  <div className="py-4 text-center text-xs text-gray-400 bg-gray-50 dark:bg-white/[0.02] rounded-xl p-3">
                    {query.trim() === ''
                      ? 'Nenhum amigo conectado ainda. Convide amigos abaixo!'
                      : `Nenhum amigo encontrado para "${query}".`}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFriends.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-brand-violet/5 dark:bg-brand-violet/10 border border-brand-violet/20 hover:border-brand-violet cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-brand-violet shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-brand-graphite dark:text-white group-hover:text-brand-violet transition-colors truncate">
                              {user.name}
                            </h4>
                            <div className="flex items-center space-x-1.5 text-[11px] text-gray-500">
                              <span className="text-brand-violet font-bold">{user.username}</span>
                              <span>•</span>
                              <span>{user.phone}</span>
                            </div>
                            <span className="inline-block mt-0.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded">
                              ✓ Amigo Conectado
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                            <Coins size={11} />
                            <span>{user.loopsBalance} Loops</span>
                          </div>
                          <span className="text-[10px] text-brand-violet font-extrabold block mt-1">
                            Adicionar à mesa →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. SEÇÃO DE OUTROS USUÁRIOS NA PLATAFORMA (PARA CONVIDAR) */}
              {query.trim() !== '' && (
                <div className="pt-3 border-t border-gray-100 dark:border-white/10">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    Outros Usuários na Plataforma
                  </h4>

                  {isLoading ? (
                    <div className="py-4 text-center text-gray-400 text-xs">
                      Buscando na rede Loopis...
                    </div>
                  ) : results.filter((u) => !friends.some((f) => f.userId === u.id || f.username === u.username)).length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-2">
                      Nenhum outro usuário encontrado.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {results
                        .filter((u) => !friends.some((f) => f.userId === u.id || f.username === u.username))
                        .map((user) => {
                          const pendingInvite = friendInvites.find(
                            (inv) => inv.userId === user.id && inv.status === 'pending'
                          );

                          return (
                            <div
                              key={user.id}
                              className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <img
                                  src={user.avatarUrl}
                                  alt={user.name}
                                  className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-brand-graphite dark:text-white truncate">
                                    {user.name}
                                  </h5>
                                  <p className="text-[10px] text-gray-500">{user.username}</p>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {pendingInvite ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                      <Clock size={10} />
                                      Pendente
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        acceptFriendInvite(pendingInvite.id);
                                        showInviteFeedback(`${user.name} agora é seu amigo!`);
                                      }}
                                      className="text-[10px] font-bold text-brand-violet bg-brand-violet/10 px-2 py-0.5 rounded cursor-pointer"
                                      title="Simular aceite para liberar divisão agora"
                                    >
                                      Simular Aceite
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      sendFriendInvite(user);
                                      showInviteFeedback(`Convite enviado para ${user.name}!`);
                                    }}
                                    className="bg-brand-violet text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow hover:bg-brand-deep-purple flex items-center gap-1 cursor-pointer"
                                  >
                                    <UserPlus size={12} />
                                    <span>Convidar</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
