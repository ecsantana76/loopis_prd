import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, Users, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-medium">
              <Sparkles size={16} className="text-purple-400" />
              <span>Plataforma #1 de Fidelização & Growth Gastronômico</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Transforme clientes casuais em <span className="text-gradient">frequentadores fiéis</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Sem mensalidades nem custos fixos. No Loopis, seu restaurante atrai novos clientes via cashback inteligente e só paga comissão quando as vendas realmente acontecem.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-gray-300 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>Zero mensalidade ou taxa de adesão</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>Leitura instantânea de cupom por IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>Aumento médio de +35% na recorrência</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>Dashboard completo em tempo real</span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-3 text-base"
              >
                <span>Cadastrar Meu Restaurante</span>
                <ArrowRight size={20} />
              </button>
              
              <a
                href="#calculadora"
                className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold rounded-2xl border border-white/10 transition-all flex items-center justify-center text-base"
              >
                Simular Faturamento
              </a>
            </div>

            <p className="text-xs text-gray-400 flex items-center justify-center lg:justify-start space-x-1 pt-1">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>Aprovação rápida em até 24 horas úteis</span>
            </p>
          </motion.div>

          {/* Right Column Interactive Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl p-6 glass-panel border border-white/15 shadow-2xl shadow-purple-950/40">
              
              {/* Card Header Mockup */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    🍕
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Bella Italia Bistro</h3>
                    <span className="text-xs text-purple-300">Parceiro Ouro Loopis</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                  Ativo
                </span>
              </div>

              {/* Stats Grid inside Mockup */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                    <Users size={14} className="text-purple-400" />
                    <span>Clientes Recorrentes</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white">+482</div>
                  <span className="text-[11px] text-emerald-400 font-medium">↑ +38% este mês</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                    <TrendingUp size={14} className="text-purple-400" />
                    <span>Vendas via Loopis</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white">R$ 24.850</div>
                  <span className="text-[11px] text-purple-300 font-medium">ROI de 8.4x</span>
                </div>
              </div>

              {/* Live Activity Feed Item */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Última Validação via IA</div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300">
                      🧾
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Cupom R$ 184,50 Validado</div>
                      <div className="text-[11px] text-gray-400">Cliente acumula 18 loops</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">+ 10% Cashback</span>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400/30 shadow-2xl backdrop-blur-xl hidden sm:flex flex-col items-center text-center space-y-1.5"
              >
                <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-sm flex items-center justify-center space-x-1">
                  <span>★</span>
                  <span>4.9</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Excelente Avaliação</div>
                  <div className="text-[11px] text-gray-300">+120 restaurantes em expansão</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
