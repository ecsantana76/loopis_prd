import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { 
  X, 
  Search, 
  Store, 
  Eye, 
  ChevronRight, 
  Check, 
  UtensilsCrossed, 
  Compass, 
  Ticket, 
} from 'lucide-react';
import type { PartnerRequest, PartnerType } from '../../types';

export const Approvals: React.FC = () => {
  const { partnerRequests, approvePartnerRequest, rejectPartnerRequest } = useStore();
  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);

  const pendingRequests = partnerRequests.filter(r => r.status === 'pending');

  const handleApprove = (id: string) => {
    approvePartnerRequest(id);
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    rejectPartnerRequest(id);
    setSelectedRequest(null);
  };

  const getPartnerIcon = (type?: PartnerType) => {
    switch (type) {
      case 'restaurante': return <UtensilsCrossed size={16} className="text-brand-lilac" />;
      case 'tour': return <Compass size={16} className="text-blue-400" />;
      case 'evento': return <Ticket size={16} className="text-emerald-400" />;
      case 'rental': return <Store size={16} className="text-pink-400" />;
      default: return <Store size={16} className="text-brand-lilac" />;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Fila de Aprovação de Parceiros</h1>
          <p className="text-sm text-gray-400">Avalie solicitações de restaurantes, experiências, tours, eventos e shows.</p>
        </div>
      </div>

      <div className="bg-brand-graphite rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        {/* Table Header / Filter Bar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              className="w-full bg-black/20 text-sm text-white px-9 py-2 rounded-lg border border-white/5 focus:border-brand-violet outline-none"
            />
          </div>
          <div className="text-sm font-semibold text-gray-400">
            {pendingRequests.length} solicitações pendentes
          </div>
        </div>

        {/* Flex-box Table Body */}
        <div className="flex flex-col">
          {pendingRequests.map(req => (
            <div key={req.id} className="group flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-violet/20 flex items-center justify-center">
                  {getPartnerIcon(req.partnerType)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-sm">{req.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-brand-lilac">
                      {req.partnerType || 'Restaurante'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{req.category} • {req.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500 hidden lg:block">
                  Recebido em {new Date(req.requestDate).toLocaleDateString('pt-BR')}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                  Aguardando
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
                    className="p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="Reprovar"
                  >
                    <X size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                    className="p-1.5 bg-brand-violet/10 text-brand-lilac rounded-md hover:bg-brand-violet/30 transition-colors cursor-pointer"
                    title="Aprovar"
                  >
                    <Check size={16} />
                  </button>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Store size={40} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma solicitação pendente no momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Inspection Drawer / Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-brand-graphite h-full border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Eye className="text-brand-violet" size={20} />
                  <span>Inspecionar Cadastro</span>
                </h2>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="aspect-video bg-black/30 rounded-2xl overflow-hidden relative border border-white/5">
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" alt="Fachada" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-brand-violet text-white px-2 py-0.5 rounded">
                        {selectedRequest.partnerType || 'Restaurante'}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">{selectedRequest.name}</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Categoria</p>
                    <p className="text-sm text-white">{selectedRequest.category}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Endereço Completo</p>
                    <p className="text-sm text-white">{selectedRequest.address}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Contato Telefônico</p>
                    <p className="text-sm text-white">{selectedRequest.phone}</p>
                  </div>
                  {selectedRequest.detailsSummary && (
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Resumo de Conteúdo</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{selectedRequest.detailsSummary}</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-brand-violet/10 border border-brand-violet/20 p-4 rounded-xl">
                  <p className="text-xs text-brand-lilac mb-2 font-semibold">Validação de Conformidade Loopis</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-brand-violet text-white text-[10px] font-bold px-2 py-1 rounded">Cardápio & Preços OK</span>
                    <span className="bg-brand-violet text-white text-[10px] font-bold px-2 py-1 rounded">Fotos em Alta Resolução</span>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded">Isenção Setup Aplicada</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-black/20 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleReject(selectedRequest.id)}
                  className="py-3 rounded-xl font-bold text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <X size={16} />
                  <span>Reprovar</span>
                </button>
                <button 
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="py-3 rounded-xl font-bold text-xs bg-gradient-loopis text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Check size={16} />
                  <span>Aprovar Parceiro</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
