import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  UserPlus, 
  Search, 
  Check, 
  Clock, 
  Coins, 
  Share2, 
  Trash2, 
  CheckCircle2, 
  UserCheck, 
  Receipt
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { mockApi } from '../../services/mockApi';
import type { UserSearchResult } from '../../types';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({ isOpen, onClose }) => {
  const { 
    friends, 
    friendInvites, 
    sendFriendInvite, 
    acceptFriendInvite, 
    rejectFriendInvite, 
    removeFriend 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'friends' | 'invites' | 'search'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const receivedInvites = friendInvites.filter((inv) => inv.direction === 'received' && inv.status === 'pending');
  const sentInvites = friendInvites.filter((inv) => inv.direction === 'sent' && inv.status === 'pending');
  const totalInvitesCount = receivedInvites.length + sentInvites.length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      return;
    }

    if (activeTab !== 'search') return;

    let isMounted = true;
    async function doSearch() {
      setIsSearching(true);
      try {
        const users = await mockApi.searchUsers(searchQuery);
        if (isMounted) setSearchResults(users);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }

    const timer = setTimeout(doSearch, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, activeTab, searchQuery]);

  const handleSendInvite = (user: UserSearchResult) => {
    const success = sendFriendInvite(user);
    if (success) {
      showToast(`Convite de amizade enviado para ${user.name}!`);
    } else {
      showToast(`${user.name} já está na sua lista ou possui convite pendente.`);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      'Oi! Estou usando o Loopis para acumular cashback e dividir contas nos melhores restaurantes. Vamos nos conectar como amigos no app: https://loopis.com.br/amigos/convite?ref=me'
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

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
            className="app-modal-panel relative z-10 flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-t-3xl border border-gray-100 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-brand-graphite sm:rounded-3xl sm:p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-loopis text-white flex items-center justify-center shadow-md">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand-graphite dark:text-white flex items-center gap-2">
                    <span>Meus Amigos no Loopis</span>
                  </h3>
                  <p className="text-xs text-gray-500">Conecte-se para dividir contas e transferir Loops</p>
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

            {/* Banner Informativo sobre Divisão de Conta */}
            <div className="mt-4 rounded-2xl bg-brand-violet/10 p-3.5 border border-brand-violet/20 flex items-start gap-2.5">
              <Receipt size={18} className="text-brand-violet shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                <strong>Como funciona:</strong> Ao adicionar amigos na plataforma e eles aceitarem seu convite, eles ficam disponíveis instantaneamente para você <strong>dividir a conta no checkout</strong> dos restaurantes.
              </p>
            </div>

            {/* Toast temporário */}
            {toastMessage && (
              <div className="mt-3 bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Abas de Navegação */}
            <div className="flex border-b border-gray-100 dark:border-white/10 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab('friends')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'friends'
                    ? 'border-brand-violet text-brand-violet'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <UserCheck size={16} />
                <span>Amigos ({friends.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('invites')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'invites'
                    ? 'border-brand-violet text-brand-violet'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Clock size={16} />
                <span>Convites</span>
                {totalInvitesCount > 0 && (
                  <span className="bg-brand-coral text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {totalInvitesCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'search'
                    ? 'border-brand-violet text-brand-violet'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <UserPlus size={16} />
                <span>Adicionar</span>
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1 min-h-[280px]">
              {/* 1. ABA DE AMIGOS CONECTADOS */}
              {activeTab === 'friends' && (
                <div className="space-y-3">
                  {friends.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center mx-auto">
                        <Users size={28} />
                      </div>
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        Você ainda não tem amigos conectados
                      </p>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto">
                        Adicione seus amigos que usam o Loopis para dividir mesas e contas facilmente.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('search')}
                        className="mt-2 bg-gradient-loopis text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer"
                      >
                        Buscar amigos na plataforma
                      </button>
                    </div>
                  ) : (
                    friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 flex items-center justify-between gap-3 hover:border-brand-violet/30 transition-all"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={friend.avatarUrl}
                            alt={friend.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-brand-violet/20 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-brand-graphite dark:text-white truncate">
                              {friend.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="text-brand-violet font-bold">{friend.username}</span>
                              <span>•</span>
                              <span className="truncate">{friend.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Check size={10} />
                                Pronto para dividir conta
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                              <Coins size={12} />
                              <span>{friend.loopsBalance} Loops</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{friend.since}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFriend(friend.id)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Remover amigo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 2. ABA DE CONVITES PENDENTES */}
              {activeTab === 'invites' && (
                <div className="space-y-5">
                  {/* Convites Recebidos */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                      Convites Recebidos ({receivedInvites.length})
                    </h4>
                    {receivedInvites.length === 0 ? (
                      <p className="text-xs text-gray-400 py-3 italic">Nenhum convite recebido no momento.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {receivedInvites.map((inv) => (
                          <div
                            key={inv.id}
                            className="p-3.5 rounded-2xl bg-brand-violet/5 border border-brand-violet/20 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={inv.avatarUrl}
                                alt={inv.name}
                                className="w-11 h-11 rounded-full object-cover border border-brand-violet/40 shrink-0"
                              />
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-brand-graphite dark:text-white truncate">
                                  {inv.name}
                                </h5>
                                <p className="text-[11px] text-brand-violet font-semibold">{inv.username}</p>
                                <p className="text-[10px] text-gray-400">{inv.createdAt}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  acceptFriendInvite(inv.id);
                                  showToast(`Você e ${inv.name} agora são amigos!`);
                                }}
                                className="bg-gradient-loopis text-white text-xs font-black px-3 py-1.5 rounded-xl shadow hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Check size={14} />
                                <span>Aceitar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectFriendInvite(inv.id)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1.5 text-xs font-bold"
                              >
                                Recusar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Convites Enviados */}
                  <div className="pt-3 border-t border-gray-100 dark:border-white/10">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                      Convites Enviados por Você ({sentInvites.length})
                    </h4>
                    {sentInvites.length === 0 ? (
                      <p className="text-xs text-gray-400 py-3 italic">Nenhum convite enviado pendente.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {sentInvites.map((inv) => (
                          <div
                            key={inv.id}
                            className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={inv.avatarUrl}
                                alt={inv.name}
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-brand-graphite dark:text-white truncate">
                                  {inv.name}
                                </h5>
                                <p className="text-[11px] text-gray-500">{inv.username}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                <Clock size={10} />
                                Aguardando aceite
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  acceptFriendInvite(inv.id);
                                  showToast(`${inv.name} aceitou seu convite de amizade!`);
                                }}
                                className="text-[10px] font-bold text-brand-violet hover:underline cursor-pointer bg-brand-violet/10 px-2 py-1 rounded-lg"
                                title="Simular que o amigo aceitou o convite"
                              >
                                Simular Aceite
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. ABA DE BUSCAR E ADICIONAR NOVOS AMIGOS */}
              {activeTab === 'search' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nome, @handle, telefone ou e-mail..."
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white placeholder-gray-400 rounded-2xl border border-gray-200 dark:border-white/10 text-sm outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20"
                    />
                  </div>

                  {/* Compartilhar link via WhatsApp */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                        Não encontrou seu amigo?
                      </p>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300">
                        Envie um convite direto por WhatsApp com seu link de indicação.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Share2 size={14} />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  {/* Lista de Resultados da Busca */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                      Usuários na Plataforma Loopis
                    </h4>
                    {isSearching ? (
                      <div className="py-8 text-center text-gray-400 text-xs">
                        <div className="w-6 h-6 border-2 border-brand-violet border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Procurando usuários...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">
                        Nenhum usuário encontrado para "{searchQuery}".
                      </p>
                    ) : (
                      searchResults.map((user) => {
                        const isAlreadyFriend = friends.some((f) => f.userId === user.id || f.username === user.username);
                        const isPending = friendInvites.some(
                          (inv) => inv.userId === user.id && inv.status === 'pending'
                        );

                        return (
                          <div
                            key={user.id}
                            className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-11 h-11 rounded-full object-cover border border-brand-violet/20 shrink-0"
                              />
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-brand-graphite dark:text-white truncate">
                                  {user.name}
                                </h5>
                                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                  <span className="text-brand-violet font-semibold">{user.username}</span>
                                  <span>•</span>
                                  <span>{user.phone}</span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isAlreadyFriend ? (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                  <Check size={12} />
                                  Já é amigo
                                </span>
                              ) : isPending ? (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                  <Clock size={12} />
                                  Convite enviado
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSendInvite(user)}
                                  className="bg-brand-violet text-white text-xs font-black px-3 py-1.5 rounded-xl shadow hover:bg-brand-deep-purple transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <UserPlus size={14} />
                                  <span>Adicionar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
