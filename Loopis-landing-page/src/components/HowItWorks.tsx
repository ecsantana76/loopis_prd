import React from 'react';
import { UserPlus, Sparkles, Receipt, Repeat } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      step: '01',
      title: 'Cadastre seu restaurante',
      description: 'Preencha os dados básicos em menos de 2 minutos. Nossa equipe valida seu perfil e ativa sua conta rapidamente.'
    },
    {
      icon: Sparkles,
      step: '02',
      title: 'Configure suas ofertas e cashback',
      description: 'Escolha a porcentagem de cashback (ex: 5% a 15%) ou crie campanhas específicas para dias de menor movimento.'
    },
    {
      icon: Receipt,
      step: '03',
      title: 'Cliente lê o cupom via IA',
      description: 'O cliente grava a nota fiscal no app Loopis pelo celular. Nossa IA valida automaticamente o valor sem atrasar seu caixa.'
    },
    {
      icon: Repeat,
      step: '04',
      title: 'Cliente volta para resgatar!',
      description: 'O saldo em Loops acumula para ser trocado em novas visitas ao seu próprio estabelecimento ou rede parceira.'
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-[#0d0b14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            Simplicidade no dia a dia
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Como funciona na prática?
          </h2>
          <p className="text-gray-300 text-base">
            Desenvolvido para não mudar nada na rotina da sua equipe ou do seu sistema PDV.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="relative p-6 rounded-3xl glass-card border border-white/10 hover:border-purple-500/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Icon size={24} />
                  </div>
                  <span className="text-3xl font-black text-white/10 group-hover:text-purple-500/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
