import React, { useState } from 'react';

export const CalculatorSection: React.FC = () => {
  const [ticket, setTicket] = useState<number>(85);
  const [customersPerMonth, setCustomersPerMonth] = useState<number>(450);
  const [expectedRetentionIncrease, setExpectedRetentionIncrease] = useState<number>(25);

  // Calculations
  const currentMonthlyRevenue = ticket * customersPerMonth;
  const extraCustomers = Math.round(customersPerMonth * (expectedRetentionIncrease / 100));
  const estimatedExtraRevenue = extraCustomers * ticket;
  const totalProjectedRevenue = currentMonthlyRevenue + estimatedExtraRevenue;
  const estimatedCashbackPool = Math.round(estimatedExtraRevenue * 0.10); // 10% average cashback pool

  return (
    <section id="calculadora" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0d0b14] via-[#140e24] to-[#0d0b14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            Simulador de Impacto Financeiro
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Calcule quanto o <span className="text-gradient">Loopis</span> pode somar ao seu faturamento
          </h2>
          <p className="text-gray-300 text-base">
            Veja uma estimativa conservadora baseada nos resultados médios dos nossos restaurantes parceiros.
          </p>
        </div>

        {/* Interactive Simulator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Sliders Control Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-8 flex flex-col justify-between">
            
            {/* Slider 1: Ticket Médio */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold">
                <label className="text-gray-300">Ticket Médio por Cliente (R$)</label>
                <span className="text-purple-300 text-lg font-bold">R$ {ticket}</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={ticket}
                onChange={(e) => setTicket(Number(e.target.value))}
                className="w-full h-2 bg-purple-950/80 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                <span>R$ 20</span>
                <span>R$ 150</span>
                <span>R$ 300+</span>
              </div>
            </div>

            {/* Slider 2: Clientes por mês */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold">
                <label className="text-gray-300">Clientes Atendidos por Mês</label>
                <span className="text-purple-300 text-lg font-bold">{customersPerMonth} clientes</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={customersPerMonth}
                onChange={(e) => setCustomersPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-purple-950/80 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                <span>100</span>
                <span>1.500</span>
                <span>3.000+</span>
              </div>
            </div>

            {/* Slider 3: Recorrência Extra */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold">
                <label className="text-gray-300">Aumento Estimado na Recorrência</label>
                <span className="text-emerald-400 text-lg font-bold">+{expectedRetentionIncrease}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={expectedRetentionIncrease}
                onChange={(e) => setExpectedRetentionIncrease(Number(e.target.value))}
                className="w-full h-2 bg-purple-950/80 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                <span>10% (Conservador)</span>
                <span>25% (Média Loopis)</span>
                <span>50% (Alta Fidelização)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
              💡 <strong>Regra transparente:</strong> Você define o percentual de cashback que deseja oferecer. Nós trazemos os clientes de volta!
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-900/60 to-indigo-950/80 border border-purple-500/30 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Resultado Projetado / Mês</span>
              
              <div className="mt-4 space-y-1">
                <div className="text-xs text-gray-400">Faturamento Extra Estimado:</div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  + R$ {estimatedExtraRevenue.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-emerald-400 font-medium">
                  Corresponde a cerca de +{extraCustomers} clientes recorrentes por mês.
                </div>
              </div>

              <hr className="my-6 border-white/10" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Faturamento Atual Base:</span>
                  <span className="font-semibold text-white">R$ {currentMonthlyRevenue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Novo Faturamento Projetado:</span>
                  <span className="font-semibold text-emerald-300">R$ {totalProjectedRevenue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Cashback Gerado p/ Clientes:</span>
                  <span className="font-semibold text-purple-300">~ R$ {estimatedCashbackPool.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <a
                href="#cadastro"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-2xl transition-all text-center block shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Quero Alcançar Este Resultado
              </a>
              <p className="text-[11px] text-gray-400 text-center">Simulação baseada em dados hipotéticos com métricas médias da rede.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
