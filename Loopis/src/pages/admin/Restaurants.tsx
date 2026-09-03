import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Search, Store, Edit2, Ban, Trash2, X, Filter } from 'lucide-react';
import type { Restaurante } from '../../types';

export const Restaurants: React.FC = () => {
  const { restaurants } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurante | null>(null);

  const [selectedPartnerType, setSelectedPartnerType] = useState<string>('all');

  const filteredRestaurants = restaurants.filter(r => 
    (selectedStatus === 'all' || r.status === selectedStatus) &&
    (selectedPartnerType === 'all' || (r.tipoParceiro || 'restaurante') === selectedPartnerType) &&
    r.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (r: Restaurante) => {
    setSelectedRestaurant(r);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Parceiros & Estabelecimentos</h1>
          <p className="text-sm text-gray-400">Gestão completa da rede de parceiros (Restaurantes, Experiências, Tours, Eventos e Shows).</p>
        </div>
      </div>

      <div className="bg-brand-graphite rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 bg-white/5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar parceiro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 text-sm text-white px-9 py-2.5 rounded-xl border border-white/5 focus:border-brand-violet outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={selectedPartnerType}
              onChange={(e) => setSelectedPartnerType(e.target.value)}
              className="bg-black/20 text-xs font-bold text-white px-3 py-2.5 rounded-xl border border-white/5 focus:border-brand-violet outline-none cursor-pointer"
            >
              <option value="all">Todos os Tipos</option>
              <option value="restaurante">Restaurantes</option>
              <option value="tour">Tours</option>
              <option value="evento">Eventos</option>
              <option value="rental">Locações</option>
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-black/20 text-xs font-bold text-white px-3 py-2.5 rounded-xl border border-white/5 focus:border-brand-violet outline-none cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="aprovado">Ativos (Aprovado)</option>
              <option value="pendente">Pendentes</option>
              <option value="bloqueado">Bloqueados</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400 border-b border-white/5 text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Parceiro</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRestaurants.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-lilac">
                        <Store size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">{r.nome}</p>
                        <p className="text-[11px] text-gray-500">{r.endereco.split(',')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-violet/10 text-brand-lilac border border-brand-violet/20">
                      {r.tipoParceiro || 'restaurante'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-300">{r.categoria}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.status === 'aprovado' ? 'bg-green-500/10 text-green-400' : 
                      r.status === 'pendente' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(r)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer" title="Bloquear">
                        <Ban size={16} />
                      </button>
                      <button onClick={() => console.log('Delete', r.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRestaurants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhum parceiro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Modal (Mock) */}
      <AnimatePresence>
        {isModalOpen && selectedRestaurant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Editar Restaurante</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Nome</label>
                  <input type="text" defaultValue={selectedRestaurant.nome} className="w-full bg-black/30 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-violet outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Status</label>
                  <select defaultValue={selectedRestaurant.status} className="w-full bg-black/30 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-brand-violet outline-none">
                    <option value="aprovado">Aprovado</option>
                    <option value="pendente">Pendente</option>
                    <option value="bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-400 font-bold hover:bg-white/5">Cancelar</button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-brand-violet text-white font-bold rounded-xl shadow-lg hover:bg-brand-violet/90">Salvar Alterações</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
