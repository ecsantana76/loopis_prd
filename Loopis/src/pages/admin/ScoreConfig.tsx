import React, { useState } from 'react';
import { Star, Save, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScoreConfig: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [scores, setScores] = useState({
    cadastroCompleto: 50,
    reservaRealizada: 10,
    checkInEfetuado: 20,
    indicacaoAmigo: 100
  });

  const handleChange = (field: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Tabela de Pontuação</h1>
        <p className="text-sm text-gray-400">Configure quantos Loops os usuários ganham por cada ação na plataforma.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-brand-graphite rounded-3xl border border-white/5 p-6 shadow-xl">
          <div className="flex items-center space-x-3 text-white mb-6">
            <Star className="text-brand-violet" />
            <h2 className="text-lg font-bold">Ações de Gamificação</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Cadastro Completo</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={scores.cadastroCompleto}
                  onChange={(e) => handleChange('cadastroCompleto', Number(e.target.value))}
                  className="w-full bg-black/20 text-white px-4 py-3 rounded-xl border border-white/5 focus:border-brand-violet outline-none font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-lilac font-bold text-xs uppercase">Loops</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Bônus ao preencher todos os dados do perfil.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Reserva Realizada</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={scores.reservaRealizada}
                  onChange={(e) => handleChange('reservaRealizada', Number(e.target.value))}
                  className="w-full bg-black/20 text-white px-4 py-3 rounded-xl border border-white/5 focus:border-brand-violet outline-none font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-lilac font-bold text-xs uppercase">Loops</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Pontos iniciais apenas por confirmar a reserva.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Check-in Efetuado</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={scores.checkInEfetuado}
                  onChange={(e) => handleChange('checkInEfetuado', Number(e.target.value))}
                  className="w-full bg-black/20 text-white px-4 py-3 rounded-xl border border-white/5 focus:border-brand-violet outline-none font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-lilac font-bold text-xs uppercase">Loops</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recompensa ao chegar no restaurante (além do cashback do consumo).</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Indicação de Amigos (Referral)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={scores.indicacaoAmigo}
                  onChange={(e) => handleChange('indicacaoAmigo', Number(e.target.value))}
                  className="w-full bg-black/20 text-white px-4 py-3 rounded-xl border border-white/5 focus:border-brand-violet outline-none font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-lilac font-bold text-xs uppercase">Loops</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ganha quando o amigo indicado faz a primeira reserva/consumo.</p>
            </div>
          </div>
        </div>

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
                <span className="text-sm font-bold">Pontuação Atualizada!</span>
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
