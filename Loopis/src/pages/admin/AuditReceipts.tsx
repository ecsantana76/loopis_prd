import React, { useState } from 'react';
import { Search, Filter, Receipt, Eye, Check, X, Edit3, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ReceiptData = {
  id: string;
  image: string;
  iaValue: number;
  source: 'cliente' | 'restaurante';
  status: 'pendente' | 'aprovado' | 'reprovado' | 'ajustado';
  date: string;
};

export const AuditReceipts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pendente');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  // Mock data for AI receipts
  const mockReceipts: ReceiptData[] = [
    { id: 'REC-1045', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', iaValue: 145.50, source: 'cliente', status: 'pendente', date: 'Hoje, 14:30' },
    { id: 'REC-1046', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', iaValue: 89.90, source: 'restaurante', status: 'pendente', date: 'Hoje, 15:10' },
    { id: 'REC-1047', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', iaValue: 210.00, source: 'cliente', status: 'aprovado', date: 'Ontem, 20:45' },
    { id: 'REC-1048', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', iaValue: 55.00, source: 'restaurante', status: 'reprovado', date: 'Ontem, 21:30' },
  ];

  const filtered = mockReceipts.filter(r => 
    (filterStatus === 'all' || r.status === filterStatus) &&
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (_action: 'approve' | 'reject' | 'adjust') => {
    // action handling logic
    setSelectedReceipt(null);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Auditoria IA (Cupons Fiscais)</h1>
          <p className="text-sm text-gray-400">Valide as leituras feitas pela inteligência artificial em notas e cupons.</p>
        </div>
      </div>

      <div className="bg-brand-graphite rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 bg-white/5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 text-sm text-white px-9 py-2.5 rounded-xl border border-white/5 focus:border-brand-violet outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black/20 text-sm text-white px-4 py-2.5 rounded-xl border border-white/5 focus:border-brand-violet outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendentes (Revisão)</option>
              <option value="aprovado">Aprovados</option>
              <option value="reprovado">Reprovados</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">ID / Data</th>
                <th className="px-6 py-4 font-semibold">Valor Lido (IA)</th>
                <th className="px-6 py-4 font-semibold">Origem</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedReceipt(r)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-lilac">
                        <Receipt size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{r.id}</p>
                        <p className="text-xs text-gray-500">{r.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">R$ {r.iaValue.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      r.source === 'cliente' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {r.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.status === 'pendente' ? 'bg-yellow-500/10 text-yellow-500' :
                      r.status === 'aprovado' || r.status === 'ajustado' ? 'bg-green-500/10 text-green-400' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="flex items-center justify-end space-x-2 text-xs font-bold text-gray-400 hover:text-white bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 hover:border-brand-violet/50 transition-all ml-auto">
                      <Eye size={14} /> <span>Inspecionar</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhum cupom encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal - Split Screen */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1a1c] border border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Receipt className="text-brand-violet" size={20} />
                  <span>Inspeção de Cupom: {selectedReceipt.id}</span>
                </h2>
                <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Left Side: Receipt Image */}
                <div className="md:w-1/2 p-4 border-r border-white/10 bg-black/40 overflow-y-auto">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center">Foto Enviada pelo {selectedReceipt.source === 'cliente' ? 'Cliente' : 'Restaurante'}</h3>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2 relative">
                    <img 
                      src={selectedReceipt.image} 
                      alt="Cupom Fiscal" 
                      className="w-full h-auto rounded-lg"
                    />
                    {/* Simulated scanning laser overlay */}
                    <motion.div
                      animate={{ y: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-brand-violet shadow-[0_0_10px_rgba(124,58,237,0.8)] z-10 mx-2 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Right Side: IA Data & Actions */}
                <div className="md:w-1/2 p-6 flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4">Dados Extraídos pela IA</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Confiança da IA</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[94%] rounded-full" />
                        </div>
                        <span className="text-green-400 font-bold text-sm">94%</span>
                      </div>
                    </div>

                    <div className="bg-brand-violet/10 p-5 rounded-xl border border-brand-violet/20 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-brand-lilac uppercase tracking-widest font-bold mb-1">Valor Total Identificado</p>
                        <p className="text-3xl font-extrabold text-white">R$ {selectedReceipt.iaValue.toFixed(2)}</p>
                      </div>
                      <button className="p-2 bg-black/20 rounded-lg hover:bg-black/40 text-brand-lilac transition-colors tooltip-trigger" title="Editar Valor">
                        <Edit3 size={18} />
                      </button>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">CNPJ do Restaurante</p>
                        <p className="text-lg font-bold text-white font-mono">12.345.678/0001-90</p>
                      </div>
                      <CheckCircle size={20} className="text-green-500" />
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleAction('reject')}
                      className="flex items-center justify-center space-x-2 bg-red-500/10 text-red-500 font-bold py-3 px-4 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20"
                    >
                      <X size={18} /> <span>Recusar</span>
                    </button>
                    <button 
                      onClick={() => handleAction('approve')}
                      className="flex items-center justify-center space-x-2 bg-gradient-loopis text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:scale-[1.02] transition-transform"
                    >
                      <Check size={18} /> <span>Aprovar</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
