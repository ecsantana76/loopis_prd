import React from 'react';
import { DollarSign, Cpu, BarChart3, Clock, Target, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Modelo 100% Baseado em Sucesso',
      description: 'Sem taxas fixas, sem pegadinhas. Você só investe um percentual quando o cliente efetivamente consome no seu restaurante.'
    },
    {
      icon: Cpu,
      title: 'IA para Leitura de Cupons',
      description: 'Zero integração técnica complexa com seu sistema PDV. O próprio cliente envia a foto do cupom e a IA do Loopis valida em segundos.'
    },
    {
      icon: BarChart3,
      title: 'Dashboard de Métricas em Tempo Real',
      description: 'Acompanhe vendas geradas, valor de cashback concedido, taxa de retenção e horários de maior impacto na sua palma.'
    },
    {
      icon: Clock,
      title: 'Campanhas em Horários Ociosos',
      description: 'Movimente dias de menor movimento (como terças e quartas) aumentando a pontuação de cashback nesses horários.'
    },
    {
      icon: Target,
      title: 'Marketing Direto e Segmentado',
      description: 'Comunique ofertas exclusivas para clientes da sua região que já demonstraram interesse no seu estilo gastronômico.'
    },
    {
      icon: Award,
      title: 'Selo de Parceiro Recomendado',
      description: 'Ganhe destaque no aplicativo Loopis e apareça na lista prioritária para milhares de amantes da boa gastronomia.'
    }
  ];

  return (
    <section id="beneficios" className="py-20 relative bg-gradient-to-b from-[#0d0b14] via-[#120a1f] to-[#0d0b14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            Vantagens Exclusivas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Por que os melhores restaurantes escolhem o <span className="text-gradient">Loopis</span>?
          </h2>
          <p className="text-gray-300 text-base">
            Tecnologia desenhada para aumentar seu ticket médio e maximizar o valor do tempo de vida do seu cliente (LTV).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="p-8 rounded-3xl glass-panel border border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all mb-6">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
