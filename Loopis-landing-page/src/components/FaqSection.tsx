import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'Quanto custa para cadastrar meu restaurante no Loopis?',
      a: 'O cadastro no Loopis é 100% gratuito. Não cobramos taxa de adesão, nem mensalidade. Você só paga um percentual de comissão sobre as vendas reais geradas através do programa de cashback.'
    },
    {
      q: 'Preciso trocar meu sistema de caixa/PDV ou instalar algo no computador?',
      a: 'Não! O Loopis funciona de forma totalmente independente. O próprio cliente tira foto do cupom fiscal via app móvel e nossa inteligência artificial lê e valida as informações de consumo.'
    },
    {
      q: 'Quanto tempo leva para meu cadastro ser aprovado?',
      a: 'Após o envio do formulário de parceria, nossa equipe realiza a validação dos dados em até 24 horas úteis. Em seguida, seu restaurante já fica visível para a comunidade Loopis!'
    },
    {
      q: 'Eu posso escolher a porcentagem de cashback que vou oferecer?',
      a: 'Sim! Você define a margem ideal para a realidade do seu negócio. Além disso, pode criar ofertas especiais em horários de menor movimento para atrair mais público.'
    },
    {
      q: 'Como recebo os dados dos clientes e relatórios?',
      a: 'Cada parceiro possui acesso a um Painel de Controle (Dashboard) exclusivo, com métricas detalhadas de ticket médio, frequência de retorno e faturamento total vindo de clientes Loopis.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#0d0b14] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={14} />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-300 text-base">
            Tudo o que você precisa saber para começar a usar o Loopis no seu estabelecimento.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl glass-panel border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-purple-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
