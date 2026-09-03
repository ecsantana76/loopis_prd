import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  Bot,
  ChevronRight,
  Star,
  MapPin,
  ArrowUpRight,
  RefreshCw,
  Gift,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import {
  generateLoopiResponse,
  type LoopiResponse,
  type RestaurantMenuData,
} from '../../services/loopiKnowledge';

interface ChatMessage {
  id: string;
  sender: 'user' | 'loopi';
  text: string;
  timestamp: string;
  matchedRestaurants?: RestaurantMenuData[];
  suggestions?: string[];
  actionType?: string;
  actionUrl?: string;
  actionLabel?: string;
}

const INITIAL_SUGGESTIONS = [
  '🍤 O que comer na Marisqueira Sintra?',
  '🍻 O que tem no Boteco ORI?',
  '🍝 Opções de comida italiana',
  '💰 Qual meu saldo de Loops?',
  '🍔 Hambúrgueres artesanais',
  '📍 O que fazer em Santo Antônio de Lisboa?',
];

export const LoopiChatbot: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, currentRole, loopsBalance, restaurants } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        sender: 'loopi',
        text: '👋 **Olá! Eu sou o Loopi, seu assistente inteligente no app!**\n\nPosso te ajudar a descobrir onde comer, o que pedir em cada restaurante, ver cardápios, checar seu saldo de Loops e muito mais. Como posso te ajudar hoje?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: INITIAL_SUGGESTIONS.slice(0, 4),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isTyping]);

  // Esconder o balão de boas-vindas após alguns segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Se não for cliente logado, não renderiza absolutamente nada
  if (!isLoggedIn || currentRole !== 'client') {
    return null;
  }

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simula tempo de resposta do assistente (350ms a 700ms)
    setTimeout(() => {
      const response: LoopiResponse = generateLoopiResponse(query, {
        loopsBalance,
        restaurants,
      });

      const loopiMsg: ChatMessage = {
        id: `loopi-${Date.now()}`,
        sender: 'loopi',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedRestaurants: response.matchedRestaurants,
        suggestions: response.suggestions,
        actionType: response.actionType,
        actionUrl: response.actionUrl,
        actionLabel: response.actionLabel,
      };

      setMessages((prev) => [...prev, loopiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'loopi',
        text: '🔄 **Conversa reiniciada!**\n\nComo posso te ajudar agora? Você pode perguntar sobre pratos, cardápios ou como usar seus Loops.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: INITIAL_SUGGESTIONS,
      },
    ]);
  };

  const handleActionClick = (url?: string) => {
    if (!url) return;
    setIsOpen(false);
    navigate(url);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Balão de Dica / Boas-vindas inicial */}
      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="pointer-events-auto mb-2 mr-1 bg-white dark:bg-[#1f1f23] text-brand-graphite dark:text-white p-3 rounded-2xl shadow-xl border border-brand-violet/20 max-w-xs text-xs flex items-center gap-2.5 cursor-pointer backdrop-blur-md"
            onClick={() => setIsOpen(true)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-loopis flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-brand-violet">Oi! Sou o Loopi 💬</p>
              <p className="text-gray-600 dark:text-gray-300">Quer saber o que comer em algum lugar ou consultar seus Loops?</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Fechar"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Janela de Chat Aberta */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto w-[92vw] sm:w-[420px] h-[560px] max-h-[82vh] bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3"
          >
            {/* Cabeçalho do Chat */}
            <div className="bg-gradient-to-r from-brand-violet via-purple-600 to-brand-coral p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <Bot size={22} className="text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-brand-violet rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base tracking-tight leading-none">Loopi</h3>
                    <span className="bg-white/20 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full">
                      IA Assistente
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80 mt-0.5">Gastronomia & Experiências em Floripa</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                  title="Limpar conversa"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                  title="Fechar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Barra de Status com Saldo de Loops */}
            <div className="bg-brand-violet/5 dark:bg-brand-violet/10 px-4 py-2 border-b border-brand-violet/10 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Gift size={13} className="text-brand-violet" />
                <span>Seu Saldo:</span>
                <span className="font-extrabold text-brand-violet dark:text-brand-purple">{loopsBalance} Loops</span>
              </div>
              <button
                onClick={() => handleActionClick('/carteira')}
                className="text-brand-violet hover:underline font-semibold flex items-center gap-0.5"
              >
                Carteira <ChevronRight size={12} />
              </button>
            </div>

            {/* Lista de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#121214]/60 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[88%] ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {msg.sender === 'loopi' && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-loopis flex items-center justify-center text-white shrink-0 text-xs shadow-sm mb-1">
                        <Sparkles size={14} />
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-loopis text-white rounded-br-none font-medium'
                          : 'bg-white dark:bg-[#222227] text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-800 rounded-bl-none'
                      }`}
                    >
                      {/* Renderização do texto com quebras de linha e formatação */}
                      <div className="space-y-2 whitespace-pre-line">
                        {msg.text.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="leading-snug">
                            {paragraph.split('**').map((part, pIdx) =>
                              pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Cards de Restaurantes Correspondentes */}
                      {msg.matchedRestaurants && msg.matchedRestaurants.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                          {msg.matchedRestaurants.map((rest) => (
                            <div
                              key={rest.restaurantId}
                              className="bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200/70 dark:border-gray-700 rounded-xl p-2.5 flex items-center gap-3 hover:border-brand-violet transition-colors group cursor-pointer"
                              onClick={() => handleActionClick(`/restaurante/${rest.restaurantId}`)}
                            >
                              <img
                                src={rest.imageUrl}
                                alt={rest.nome}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200';
                                }}
                                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-xs text-brand-graphite dark:text-white truncate">
                                    {rest.nome}
                                  </h4>
                                  <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                                    <Star size={10} className="fill-amber-400" />
                                    {rest.rating.toFixed(1)}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} /> {rest.bairro}
                                </p>
                                <span className="inline-block bg-brand-violet/10 dark:bg-brand-violet/20 text-brand-violet text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 truncate max-w-full">
                                  {rest.cashback}
                                </span>
                              </div>
                              <ArrowUpRight size={14} className="text-gray-400 group-hover:text-brand-violet shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Botão de Ação Direta se aplicável */}
                      {msg.actionUrl && msg.actionLabel && (
                        <div className="mt-3">
                          <button
                            onClick={() => handleActionClick(msg.actionUrl)}
                            className="w-full bg-gradient-loopis text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow hover:opacity-95 transition-opacity"
                          >
                            <span>{msg.actionLabel}</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>

                  {/* Sugestões de Perguntas Rápidas */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          className="bg-white dark:bg-[#1e1e22] hover:bg-brand-violet/10 dark:hover:bg-brand-violet/20 text-gray-700 dark:text-gray-300 hover:text-brand-violet border border-gray-200 dark:border-gray-700/80 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors text-left shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Indicador de Digitação */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-loopis flex items-center justify-center text-white shrink-0 text-xs shadow-sm">
                    <Sparkles size={14} />
                  </div>
                  <div className="bg-white dark:bg-[#222227] p-3 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-brand-violet rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-brand-coral rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-[11px] text-gray-500 pl-1 font-medium">Loopi pesquisando...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input e Envio de Mensagens */}
            <div className="p-3 bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Pergunte ao Loopi (ex: 'O que comer no Timoneiro?')"
                  className="flex-1 bg-gray-100 dark:bg-[#222227] border border-gray-200 dark:border-gray-700 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-violet transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-gradient-loopis disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-2xl shadow-md hover:opacity-95 transition-opacity flex items-center justify-center shrink-0 cursor-pointer"
                  title="Enviar mensagem"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante (FAB) do Loopi */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-loopis text-white shadow-xl shadow-brand-violet/25 focus:outline-none cursor-pointer border-2 border-white dark:border-gray-800"
        title="Conversar com o Loopi"
      >
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-violet via-brand-purple to-brand-coral opacity-75 blur-sm group-hover:opacity-100 transition duration-300 -z-10 animate-pulse"></div>

        {isOpen ? (
          <X size={26} className="text-white" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Bot size={24} className="text-white" />
            <span className="text-[8px] font-black tracking-tighter uppercase -mt-0.5">Loopi</span>
          </div>
        )}

        {/* Indicador de Status Online */}
        {!isOpen && (
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white dark:border-gray-800"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
