import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserCheck, Coins, Phone, AtSign } from 'lucide-react';
import type { UserSearchResult } from '../../types';
import { mockApi } from '../../services/mockApi';

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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
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
            className="partner-modal-panel relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-gray-100 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-brand-graphite sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-graphite dark:text-white">
                    Atribuir a Usuário Loopis
                  </h3>
                  <p className="text-xs text-gray-500">Busque por nome, @handle ou telefone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-4 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Ana, @lucas, (48) 99123..."
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white placeholder-gray-400 rounded-2xl border border-gray-200 dark:border-white/10 text-sm outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  <div className="w-6 h-6 border-2 border-brand-violet border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Buscando usuários...
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  Nenhum usuário encontrado para "{query}".
                </div>
              ) : (
                results.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className="pt-2 pb-2 flex items-center justify-between p-2 rounded-2xl hover:bg-brand-violet/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-11 h-11 rounded-full object-cover border border-brand-violet/30"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-brand-graphite dark:text-white group-hover:text-brand-violet transition-colors">
                          {user.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                          <span className="flex items-center space-x-0.5 text-brand-violet">
                            <AtSign size={10} />
                            <span>{user.username.replace('@', '')}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-0.5">
                            <Phone size={10} />
                            <span>{user.phone}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                        <Coins size={12} />
                        <span>{user.loopsBalance} Loops</span>
                      </div>
                      <span className="text-[10px] text-brand-violet font-semibold block mt-1">
                        Selecionar
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
