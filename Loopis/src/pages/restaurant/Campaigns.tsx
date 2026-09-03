import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, CheckCircle, Upload, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Campanha } from '../../types';

export const Campaigns: React.FC = () => {
  const { addCustomPromotion } = useStore();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Campanha['tipo']>('porcentagem');
  const [value, setValue] = useState(20);
  const [days, setDays] = useState<string[]>(['Terça', 'Quarta']);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('22:00');
  const [imageUrl, setImageUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || days.length === 0) return;

    addCustomPromotion({
      restauranteId: '1',
      tipo: type,
      valor: value,
      regraHorario: `Válido ${days.join(', ')} das ${startTime} às ${endTime}`,
      status: 'ativa',
      imagemUrl: imageUrl || undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setImageUrl('');
    }, 3000);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-white">Criar Campanha</h1>
        <p className="text-sm text-gray-500">Atraia clientes em dias e horários de menor movimento.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 glassmorphism p-6 sm:p-8 rounded-3xl shadow-sm">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Título da Campanha</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
                  placeholder="Ex: Terça do Vinho em Dobro" 
                />
              </div>

              {/* Upload da Imagem da Campanha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Imagem da Campanha</label>
                {imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-gray-200 dark:border-white/10 group">
                    <img src={imageUrl} alt="Imagem da campanha" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-brand-violet rounded-2xl cursor-pointer bg-white/30 dark:bg-white/5 transition-all group">
                    <Upload size={28} className="text-gray-400 group-hover:text-brand-violet mb-2 transition-colors" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-brand-violet">Clique para carregar foto do prato / banner</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipo de Bônus</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as Campanha['tipo'])}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white"
                  >
                    <option value="cashback_dobro">Cashback em Dobro</option>
                    <option value="porcentagem">Desconto %</option>
                    <option value="valor_fixo">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Valor</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full pl-4 pr-8 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      {type === 'valor_fixo' ? 'R$' : '%'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dias da Semana</label>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        days.includes(day)
                          ? 'bg-brand-violet text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Início</label>
                  <input 
                    type="time" 
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fim</label>
                  <input 
                    type="time" 
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-loopis text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-brand-violet/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus size={18} />
                <span>Ativar Campanha</span>
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-brand-graphite dark:text-white mb-2">Campanha Ativa!</h3>
              <p className="text-gray-500 dark:text-gray-400">Sua campanha já está visível no app para os clientes.</p>
            </motion.div>
          )}
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-80">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Preview no App</h3>
          
          <div className="bg-white dark:bg-brand-graphite rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 dark:bg-white/5 rounded-2xl mb-4 relative overflow-hidden">
              <img 
                src={imageUrl || "https://images.unsplash.com/photo-1599813953495-2d6ec3105ff7?auto=format&fit=crop&q=80&w=400"} 
                className="w-full h-full object-cover opacity-85 transition-all duration-300" 
                alt="Preview" 
              />
              <div className="absolute top-2 right-2 bg-brand-violet/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                Patrocinado
              </div>
            </div>
            
            <h4 className="font-bold text-brand-graphite dark:text-white mb-1">Seu Restaurante</h4>
            <p className="text-xs text-gray-500 mb-4">Santo Antônio de Lisboa</p>
            
            {title ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-brand-lilac/15 border border-brand-lilac/30 rounded-xl p-3 flex items-start space-x-2"
              >
                <Tag size={16} className="text-brand-violet mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-violet uppercase mb-0.5">{type === 'cashback_dobro' ? 'Cashback' : type === 'porcentagem' ? 'Desconto' : 'Voucher'}</p>
                  <p className="text-sm font-semibold text-brand-deep-purple dark:text-brand-lilac leading-tight">
                    {title || `${value}${type === 'valor_fixo' ? 'R$' : '%'} off`}
                  </p>
                  <p className="text-[10px] text-brand-deep-purple/70 dark:text-brand-lilac/70 mt-1">
                    Válido {days.slice(0, 2).join(', ')}... das {startTime} às {endTime}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center text-xs text-gray-400">
                Preencha os dados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
