import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Save, ShieldAlert, Percent, MapPin, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Settings: React.FC = () => {
  const { systemConfig, updateSystemConfig } = useStore();
  const [formData, setFormData] = useState(systemConfig);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof typeof systemConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig(formData);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 md:pb-0 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Configurações Globais</h1>
        <p className="text-sm text-gray-400">Parâmetros centrais do motor de regras Loopis.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Parametros Financeiros */}
        <div className="bg-brand-graphite rounded-3xl border border-white/5 p-6 shadow-xl">
          <div className="flex items-center space-x-3 text-white mb-6">
            <Percent className="text-brand-violet" />
            <h2 className="text-lg font-bold">Motor Financeiro</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Comissão Base Loopis (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.loopisCommissionPercent}
                  onChange={(e) => handleChange('loopisCommissionPercent', Number(e.target.value))}
                  className="w-full bg-black/20 text-white px-4 py-3 rounded-xl border border-white/5 focus:border-brand-violet outline-none font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Taxa cobrada do parceiro sobre o GMV via app.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Cashback Padrão (Loops : R$)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.defaultCashbackPercent}
                  onChange={(e) => handleChange('defaultCashbackPercent', Number(e.target.value))}
                  className="w-full bg-black/20 text-white px-4 py-3 rounded-xl border border-white/5 focus:border-brand-violet outline-none font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Fator de conversão base. 1% = 1 Loop a cada R$ 100.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Teto de Desconto Máximo (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.maxDiscountAllowed}
                  onChange={(e) => handleChange('maxDiscountAllowed', Number(e.target.value))}
                  className="w-full bg-black/20 text-white px-4 py-3 rounded-xl border border-white/5 focus:border-brand-violet outline-none font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Limita campanhas agressivas criadas por parceiros para evitar dumping.</p>
            </div>
          </div>
        </div>

        {/* Expansão e Operação */}
        <div className="bg-brand-graphite rounded-3xl border border-white/5 p-6 shadow-xl">
          <div className="flex items-center space-x-3 text-white mb-6">
            <MapPin className="text-blue-500" />
            <h2 className="text-lg font-bold">Praças Operacionais</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
            <div>
              <h3 className="font-bold text-white">{formData.activeCity}</h3>
              <p className="text-sm text-gray-500">Status atual do MVP</p>
            </div>
            
            {/* Custom Toggle Switch */}
            <div 
              className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${formData.isCityActive ? 'bg-brand-violet' : 'bg-gray-600'}`}
              onClick={() => handleChange('isCityActive', !formData.isCityActive)}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: formData.isCityActive ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </div>
        </div>

        {/* Zona de Perigo */}
        <div className="bg-red-500/5 rounded-3xl border border-red-500/10 p-6">
          <div className="flex items-center space-x-3 text-red-400 mb-2">
            <ShieldAlert size={20} />
            <h2 className="text-lg font-bold">Zona de Perigo</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Ações irreversíveis que afetam toda a base.</p>
          <button type="button" className="px-4 py-2 border border-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/10 transition-colors">
            Limpar Banco de Dados (Reset MVP)
          </button>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <AnimatePresence>
            {isSaved && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-lg"
              >
                <CheckCircle size={16} />
                <span className="text-sm font-bold">Configurações Atualizadas!</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            type="submit"
            className="ml-auto bg-gradient-loopis text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-brand-violet/30 transition-all flex items-center space-x-2"
          >
            <Save size={18} />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
