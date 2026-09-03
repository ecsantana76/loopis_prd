import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Search, X } from 'lucide-react';

export const Billing: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const billingData = [
    { id: 'INV-001', restaurant: 'Ostraria do Córrego', gmv: 15400, commission: 1540, status: 'pending', month: 'Julho 2026' },
    { id: 'INV-002', restaurant: 'Bistro da Lagoa', gmv: 8200, commission: 820, status: 'paid', month: 'Julho 2026' },
    { id: 'INV-003', restaurant: 'Campeche Surf Burger', gmv: 12500, commission: 1250, status: 'pending', month: 'Julho 2026' },
    { id: 'INV-004', restaurant: 'Forneria Jurerê', gmv: 21000, commission: 2100, status: 'generated', month: 'Julho 2026' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded-md border border-yellow-500/20">Pendente</span>;
      case 'generated': return <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-md border border-blue-500/20">Boleto Gerado</span>;
      case 'paid': return <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded-md border border-green-500/20">Pago</span>;
      default: return null;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Gestão de Cobranças</h1>
        <p className="text-sm text-gray-400">Acompanhamento e fechamento mensal de comissões B2B.</p>
      </div>

      <div className="bg-brand-graphite rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between sm:items-center bg-white/5 gap-4">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar parceiro..." 
              className="w-full bg-black/20 text-sm text-white px-9 py-2 rounded-lg border border-white/5 focus:border-brand-violet outline-none"
            />
          </div>
          <select className="bg-black/20 text-sm text-white px-4 py-2 rounded-lg border border-white/5 focus:border-brand-violet outline-none">
            <option>Julho 2026</option>
            <option>Junho 2026</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Restaurante / Fatura</th>
                <th className="px-6 py-4 font-semibold">GMV Transacionado</th>
                <th className="px-6 py-4 font-semibold">Comissão Loopis</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {billingData.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{item.restaurant}</p>
                    <p className="text-xs text-gray-500">{item.id} • {item.month}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-300">
                    R$ {item.gmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-lilac">
                    R$ {item.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedInvoice(item)}
                      className="flex items-center space-x-2 text-xs font-bold text-brand-lilac hover:text-white bg-brand-violet/10 px-3 py-2 rounded-lg border border-brand-violet/20 hover:bg-brand-violet/20 transition-all"
                    >
                      <FileText size={14} /> <span>Gerar Extrato (Boleto Manual)</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal for Printing */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-brand-graphite">Visualização para Impressão</h2>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-brand-graphite">
                  <X size={20} />
                </button>
              </div>

              {/* Printable Area - Light Mode Enforced */}
              <div className="p-8 sm:p-12 flex-1 overflow-y-auto text-brand-graphite" id="printable-invoice">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter text-brand-graphite lowercase mb-1">loopis</h1>
                    <p className="text-sm text-gray-500">Tecnologia em Fidelização</p>
                    <p className="text-xs text-gray-400 mt-1">CNPJ: 00.000.000/0001-00</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-gray-300">Fatura</h2>
                    <p className="font-mono font-bold mt-1">{selectedInvoice.id}</p>
                    <p className="text-sm text-gray-500 mt-2">Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-gray-500">Ref: {selectedInvoice.month}</p>
                  </div>
                </div>

                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Sacado (Restaurante Parceiro)</p>
                  <p className="text-lg font-bold">{selectedInvoice.restaurant}</p>
                  <p className="text-sm text-gray-600">Florianópolis - SC</p>
                </div>

                <table className="w-full text-left mb-8">
                  <thead>
                    <tr className="border-b-2 border-brand-graphite">
                      <th className="py-2 font-bold uppercase text-xs">Descrição</th>
                      <th className="py-2 font-bold uppercase text-xs text-right">Valor Transacionado</th>
                      <th className="py-2 font-bold uppercase text-xs text-right">Taxa Loopis</th>
                      <th className="py-2 font-bold uppercase text-xs text-right">Total Devido</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 text-sm font-medium">Comissão sobre consumo via Check-in App</td>
                      <td className="py-4 text-sm text-right text-gray-600">
                        R$ {selectedInvoice.gmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 text-sm text-right text-gray-600">10%</td>
                      <td className="py-4 text-sm text-right font-bold">
                        R$ {selectedInvoice.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-bold text-gray-500">Subtotal</span>
                      <span className="text-sm font-bold">R$ {selectedInvoice.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg font-extrabold uppercase">Total</span>
                      <span className="text-2xl font-extrabold text-brand-violet">R$ {selectedInvoice.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-lg space-x-3">
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  Fechar
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-6 py-2 bg-brand-graphite text-white font-bold rounded-lg flex items-center space-x-2 text-sm hover:bg-black transition-colors"
                >
                  <Download size={16} /> <span>Imprimir / PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
