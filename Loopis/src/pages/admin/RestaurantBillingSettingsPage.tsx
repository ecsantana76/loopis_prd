import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  DollarSign, 
  Percent, 
  Coins, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  TrendingUp, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useRestaurantBilling } from '../../hooks/useRestaurantBilling';

export const RestaurantBillingSettingsPage: React.FC = () => {
  const {
    settings,
    setField,
    isLoading,
    isSaving,
    saveSuccess,
    errors,
    handleSave,
    simulatedMonthlyGmv,
    setSimulatedMonthlyGmv,
    projection,
  } = useRestaurantBilling('marisqueira-sintra');

  const [monthlyFeeInput, setMonthlyFeeInput] = useState<string>(
    settings.monthlyFeeAmount ? settings.monthlyFeeAmount.toFixed(2).replace('.', ',') : '0,00'
  );

  const [commissionInput, setCommissionInput] = useState<string>(
    settings.commissionPercent ? settings.commissionPercent.toString().replace('.', ',') : '12,0'
  );

  const [conversionRateInput, setConversionRateInput] = useState<string>(
    settings.loopConversionRate ? settings.loopConversionRate.toString().replace('.', ',') : '1,0'
  );

  React.useEffect(() => {
    if (settings) {
      setMonthlyFeeInput(settings.monthlyFeeAmount ? settings.monthlyFeeAmount.toFixed(2).replace('.', ',') : '0,00');
      setCommissionInput(settings.commissionPercent ? settings.commissionPercent.toString().replace('.', ',') : '12,0');
      setConversionRateInput(settings.loopConversionRate ? settings.loopConversionRate.toString().replace('.', ',') : '1,0');
    }
  }, [settings.updatedAt]);

  const handleMonthlyFeeChange = (val: string) => {
    let clean = val.replace(/[^\d,]/g, '');
    setMonthlyFeeInput(clean);
    const parsed = parseFloat(clean.replace(',', '.'));
    setField('monthlyFeeAmount', isNaN(parsed) ? 0 : parsed);
  };

  const handleCommissionChange = (val: string) => {
    let clean = val.replace(/[^\d,]/g, '');
    setCommissionInput(clean);
    const parsed = parseFloat(clean.replace(',', '.'));
    setField('commissionPercent', isNaN(parsed) ? 0 : parsed);
  };

  const handleConversionRateChange = (val: string) => {
    let clean = val.replace(/[^\d,]/g, '');
    setConversionRateInput(clean);
    const parsed = parseFloat(clean.replace(',', '.'));
    setField('loopConversionRate', isNaN(parsed) ? 1.0 : parsed);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-12 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-48 bg-white/5 rounded-3xl animate-pulse" />
        <div className="h-48 bg-white/5 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-violet dark:text-brand-lilac text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 size={16} />
            <span>Módulo Comercial B2B</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-graphite dark:text-white">
            Configurações Comerciais do Restaurante
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Defina mensalidade, modelo de comissionamento e regras de aceitação de créditos Loopis.
          </p>
        </div>

        <div className="shrink-0">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-violet dark:text-brand-lilac text-xs font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{settings.restaurantName}</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-brand-graphite rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-lg space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-graphite dark:text-white">
                  Cobrança de Mensalidade (SaaS)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Habilita plano de taxa fixa mensal recorrente para o restaurante parceiro.
                </p>
              </div>
            </div>

            <div
              onClick={() => setField('hasMonthlyFee', !settings.hasMonthlyFee)}
              className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors shrink-0 flex items-center ${
                settings.hasMonthlyFee ? 'bg-brand-violet' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: settings.hasMonthlyFee ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

          <AnimatePresence>
            {settings.hasMonthlyFee && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-gray-100 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Valor da Mensalidade (BRL)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      R$
                    </span>
                    <input
                      type="text"
                      value={monthlyFeeInput}
                      onChange={(e) => handleMonthlyFeeChange(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-base outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20"
                    />
                  </div>
                  {errors.monthlyFeeAmount && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.monthlyFeeAmount}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Valor debitado mensalmente via fatura Loopis B2B.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Dia de Vencimento da Fatura
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      <Calendar size={18} />
                    </span>
                    <select
                      value={settings.invoiceDueDay}
                      onChange={(e) => setField('invoiceDueDay', parseInt(e.target.value))}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-sm outline-none focus:border-brand-violet cursor-pointer"
                    >
                      {[5, 10, 15, 20, 25, 28].map((day) => (
                        <option key={day} value={day} className="dark:bg-brand-graphite">
                          Todo dia {day} do mês
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white dark:bg-brand-graphite rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-lg space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
              <Percent size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-graphite dark:text-white">
                Comissão sobre Vendas (Take Rate)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Percentual cobrado sobre o GMV gerado por clientes Loopis no restaurante.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Taxa de Comissão (%)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={commissionInput}
                  onChange={(e) => handleCommissionChange(e.target.value)}
                  placeholder="12,5"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-base outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold text-brand-violet">
                  %
                </span>
              </div>
              {errors.commissionPercent && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{errors.commissionPercent}</span>
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-1">
                Padrão de mercado para parceiros gastronômicos: entre 10,0% e 15,0%.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Sugestões Rápidas de Tabela
              </label>
              <div className="flex flex-wrap gap-2">
                {[8.0, 10.0, 12.5, 15.0, 18.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setField('commissionPercent', rate);
                      setCommissionInput(rate.toString().replace('.', ','));
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      settings.commissionPercent === rate
                        ? 'bg-brand-violet text-white border-brand-violet shadow-sm'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-brand-violet/40'
                    }`}
                  >
                    {rate.toString().replace('.', ',')}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-graphite rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-lg space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Coins size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-graphite dark:text-white">
                  Aceitação de Créditos Loop
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Permite que clientes utilizem saldo acumulado de Loops como abatimento no pagamento.
                </p>
              </div>
            </div>

            <div
              onClick={() => setField('acceptsLoopCredits', !settings.acceptsLoopCredits)}
              className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors shrink-0 flex items-center ${
                settings.acceptsLoopCredits ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: settings.acceptsLoopCredits ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

          <AnimatePresence>
            {settings.acceptsLoopCredits && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-gray-100 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Taxa de Conversão de Crédito
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      R$ 1,00 =
                    </span>
                    <input
                      type="text"
                      value={conversionRateInput}
                      onChange={(e) => handleConversionRateChange(e.target.value)}
                      placeholder="1,0"
                      className="w-full pl-20 pr-20 py-3.5 bg-gray-50 dark:bg-black/30 text-brand-graphite dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-base outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500">
                      Loops
                    </span>
                  </div>
                  {errors.loopConversionRate && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.loopConversionRate}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Ex: R$ 1,00 = 1,0 crédito para abatimento direto na conta.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-xs text-amber-700 dark:text-amber-300">
                  <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Restaurantes que aceitam créditos Loopis registram aumento médio de <strong>35% na taxa de retorno</strong> de clientes fidelizados.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-gradient-to-br from-brand-deep-purple/90 via-brand-graphite to-black text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-lilac">
                <Calculator size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Simulador de Projeção Comercial
                </h3>
                <p className="text-xs text-gray-400">
                  Cálculo em tempo real do faturamento líquido e repasses
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">GMV Mensal Estimado:</span>
              <select
                value={simulatedMonthlyGmv}
                onChange={(e) => setSimulatedMonthlyGmv(parseFloat(e.target.value))}
                className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-bold border border-white/15 outline-none"
              >
                <option value={15000} className="text-black">R$ 15.000,00 /mês</option>
                <option value={35000} className="text-black">R$ 35.000,00 /mês</option>
                <option value={75000} className="text-black">R$ 75.000,00 /mês</option>
                <option value={150000} className="text-black">R$ 150.000,00 /mês</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block">GMV Bruto</span>
              <span className="text-lg sm:text-xl font-bold text-white mt-1 block">
                R$ {projection.simulatedGmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block">
                Comissão Loopis ({settings.commissionPercent}%)
              </span>
              <span className="text-lg sm:text-xl font-bold text-brand-lilac mt-1 block">
                - R$ {projection.loopisCommissionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block">
                Mensalidade Fixa
              </span>
              <span className="text-lg sm:text-xl font-bold text-gray-300 mt-1 block">
                {settings.hasMonthlyFee ? `- R$ ${projection.monthlyFeeTotal.toFixed(2).replace('.', ',')}` : 'Isento (R$ 0)'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-[11px] text-emerald-400 uppercase font-semibold block">
                Repasse Líquido Estimado
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400 mt-1 block">
                R$ {projection.netRestaurantPayout.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <span className="flex items-center space-x-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              <span>Loops de cashback gerados para a base: <strong>+{projection.estimatedCustomerCashbackLoops} Loops</strong></span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-2xl border border-emerald-500/20"
              >
                <CheckCircle2 size={18} />
                <span className="text-xs sm:text-sm font-bold">
                  Configurações comerciais salvas com sucesso!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto bg-gradient-loopis hover:opacity-95 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-brand-violet/30 transition-all flex items-center space-x-2 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                <span>Salvar Configurações Comerciais</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
