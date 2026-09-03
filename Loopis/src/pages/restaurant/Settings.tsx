import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Video, MapPin, AtSign, Globe, Save, CheckCircle, Plus, Trash2, Upload, UtensilsCrossed, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuItem } from '../../types';
import { useStore } from '../../store/useStore';

export const Settings: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const { menuItems, addMenuItem, removeMenuItem } = useStore();

  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemImage) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      nome: newItemName,
      descricao: newItemDesc,
      preco: parseFloat(newItemPrice),
      imagemUrl: newItemImage
    };

    addMenuItem(newItem);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemImage('');
    setIsMenuModalOpen(false);
  };

  const handleRemoveMenuItem = (id: string) => {
    removeMenuItem(id);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-white">Configurações e Mídia</h1>
        <p className="text-sm text-gray-500">Gerencie a aparência, o cardápio e os links do seu restaurante no app Loopis.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Seção de Cardápio */}
        <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-brand-graphite dark:text-white flex items-center space-x-2">
              <UtensilsCrossed className="text-brand-violet" />
              <span>Cardápio do Restaurante</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsMenuModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-brand-violet/90"
            >
              <Plus size={16} />
              Adicionar item
            </button>
          </div>

          {isMenuModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end bg-black/60 p-0 sm:items-center sm:justify-center sm:p-4">
              <div className="w-full max-h-[92vh] overflow-y-auto rounded-t-3xl border border-gray-200/60 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-brand-graphite sm:max-w-2xl sm:rounded-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-brand-graphite dark:text-white flex items-center space-x-1.5">
                    <Plus size={16} className="text-brand-violet" />
                    <span>Cadastrar item no cardápio</span>
                  </h3>
                  <button type="button" onClick={() => setIsMenuModalOpen(false)} className="rounded-xl bg-gray-100 p-2 text-gray-500 transition-colors hover:text-red-500 dark:bg-white/10 dark:text-gray-300">
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome do Prato / Item</label>
                      <input 
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Ex: Moqueca Capixaba Mista"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-brand-violet outline-none dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preço (R$)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-brand-violet outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                    <textarea 
                      rows={2}
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      placeholder="Ex: Porção bem servida para 2 pessoas, acompanhada de pirão e farofa de dendê."
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-brand-violet outline-none dark:text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Foto do Prato</label>
                    {newItemImage ? (
                      <div className="relative rounded-xl overflow-hidden h-36 border border-gray-200 dark:border-white/10 group w-full">
                        <img src={newItemImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setNewItemImage('')}
                          className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center p-5 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-brand-violet rounded-xl cursor-pointer bg-white/50 dark:bg-white/5 transition-all group">
                        <Upload size={20} className="text-gray-400 group-hover:text-brand-violet mr-2" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-brand-violet">Fazer upload da foto do prato</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddMenuItem}
                    disabled={!newItemName || !newItemPrice || !newItemImage}
                    className="w-full px-5 py-3 bg-brand-violet hover:bg-brand-violet/90 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <Plus size={16} />
                    <span>Adicionar ao Cardápio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listagem dos Itens do Cardápio */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Listagem do Cardápio ({menuItems.length} itens)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start space-x-3 p-4 rounded-2xl bg-white dark:bg-black/30 border border-gray-100 dark:border-white/10 shadow-sm relative group"
                >
                  <img 
                    src={item.imagemUrl} 
                    alt={item.nome} 
                    className="w-20 h-20 rounded-xl object-cover shrink-0 mt-0.5" 
                  />
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-brand-graphite dark:text-white truncate">{item.nome}</h4>
                    </div>
                    <span className="text-xs font-bold text-brand-violet bg-brand-violet/10 px-2 py-0.5 rounded-md inline-block mt-1">
                      R$ {item.preco.toFixed(2).replace('.', ',')}
                    </span>
                    {item.descricao && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {item.descricao}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMenuItem(item.id)}
                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Remover item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-brand-graphite dark:text-white mb-6 flex items-center space-x-2">
            <ImageIcon className="text-brand-violet" />
            <span>Fotos do Ambiente</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 hover:text-brand-violet hover:border-brand-violet transition-colors cursor-pointer group">
                <Camera size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Adicionar</span>
              </div>
            ))}
            <div className="aspect-square bg-brand-violet/10 rounded-2xl flex flex-col items-center justify-center text-brand-violet font-bold cursor-pointer hover:bg-brand-violet/20 transition-colors">
              <span className="text-3xl mb-1">+</span>
              <span className="text-xs">Ver mais</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Dica: Fotos claras e bem iluminadas atraem até 40% mais clientes.</p>
        </div>

        <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-brand-graphite dark:text-white mb-6 flex items-center space-x-2">
            <Video className="text-brand-violet" />
            <span>Vídeo de Apresentação</span>
          </h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Link do Vídeo (YouTube/Vimeo)</label>
            <input 
              type="url" 
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
              placeholder="https://youtube.com/..." 
            />
          </div>
        </div>

        <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-brand-graphite dark:text-white mb-6 flex items-center space-x-2">
            <MapPin className="text-brand-violet" />
            <span>Presença Digital e Localização</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin size={16} className="text-brand-violet" />
                <span>Link do Google Maps</span>
              </label>
              <input 
                type="url" 
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
                placeholder="https://maps.google.com/..." 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <AtSign size={16} className="text-pink-500" />
                  <span>Instagram (URL)</span>
                </label>
                <input 
                  type="url" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
                  placeholder="https://instagram.com/..." 
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Globe size={16} className="text-blue-600" />
                  <span>Facebook (URL)</span>
                </label>
                <input 
                  type="url" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-violet outline-none transition-all dark:text-white" 
                  placeholder="https://facebook.com/..." 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 pb-safe z-10">
          <button type="submit" className="bg-gradient-loopis text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-brand-violet/40 hover:scale-[1.02] transition-all flex items-center space-x-2">
            <AnimatePresence mode="wait">
              {isSaved ? (
                <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Salvo com Sucesso!</span>
                </motion.div>
              ) : (
                <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center space-x-2">
                  <Save size={20} />
                  <span>Salvar Configurações</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </form>
    </div>
  );
};
