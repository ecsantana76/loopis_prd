import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Receipt, 
  Eye, 
  X, 
  UtensilsCrossed, 
  Compass, 
  Ticket, 
  FileText
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { PartnerActivityRecord, PartnerType } from '../../types';

export const ActivityLog: React.FC = () => {
  const { partnerActivities } = useStore();

  // Estados de Filtro
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-18');
  const [dateMode, setDateMode] = useState<'today' | 'yesterday' | 'week' | 'custom' | 'all'>('today');
  const [statusFilter, setStatusFilter] = useState<'all' | 'compareceu' | 'no_show'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de Detalhe da Comanda
  const [selectedActivity, setSelectedActivity] = useState<PartnerActivityRecord | null>(null);

  // Manipulação de datas rápidas
  const handleSetDateFilter = (mode: 'today' | 'yesterday' | 'week' | 'custom' | 'all') => {
    setDateMode(mode);
    if (mode === 'today') {
      setSelectedDate('2026-08-18');
    } else if (mode === 'yesterday') {
      setSelectedDate('2026-08-17');
    } else if (mode === 'all') {
      setSelectedDate('');
    }
  };

  // Filtragem dos registros
  const filteredActivities = partnerActivities.filter((act) => {
    // Filtro de Data
    if (dateMode === 'today' && act.data !== '2026-08-18') return false;
    if (dateMode === 'yesterday' && act.data !== '2026-08-17') return false;
    if (dateMode === 'custom' && selectedDate && act.data !== selectedDate) return false;

    // Filtro de Status de Presença
    if (statusFilter !== 'all' && act.statusPresenca !== statusFilter) return false;

    // Filtro de Tipo de Parceiro
    if (typeFilter !== 'all' && act.tipoParceiro !== typeFilter) return false;

    // Filtro de Busca por Texto
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = act.clienteNome.toLowerCase().includes(q);
      const matchPhone = act.clienteTelefone.includes(q);
      const matchCode = act.comanda?.comandaCode.toLowerCase().includes(q);
      const matchTable = act.comanda?.mesaOuReferencia?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCode && !matchTable) return false;
    }

    return true;
  });

  // Métricas do período filtrado
  const totalClientes = filteredActivities.reduce((acc, a) => acc + a.pessoasQtd, 0);
  const compareceramCount = filteredActivities.filter(a => a.statusPresenca === 'compareceu').length;
  const noShowCount = filteredActivities.filter(a => a.statusPresenca === 'no_show').length;
  const faturamentoTotal = filteredActivities.reduce((acc, a) => acc + a.totalGasto, 0);
  const loopsTotal = filteredActivities.reduce((acc, a) => acc + a.loopsGerados, 0);

  const getPartnerTypeIcon = (type: PartnerType) => {
    switch (type) {
      case 'restaurante': return <UtensilsCrossed size={14} className="text-brand-violet" />;
      case 'tour': return <Compass size={14} className="text-blue-500" />;
      case 'evento': return <Ticket size={14} className="text-emerald-500" />;
      case 'rental': return <FileText size={14} className="text-pink-500" />;
      default: return <UtensilsCrossed size={14} className="text-brand-violet" />;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-graphite dark:text-white">
            Registro de Atividades & Histórico de Comandas
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Consulte a lista de quem reservou, quem compareceu (check-in) vs no-show e o consumo detalhado das comandas por data.
          </p>
        </div>
      </div>

      {/* Barra de Filtros por Data & Busca */}
      <div className="glassmorphism p-5 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4 shadow-sm">
        {/* Seletor Rápido de Datas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleSetDateFilter('today')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dateMode === 'today'
                  ? 'bg-gradient-loopis text-white shadow-md'
                  : 'bg-white dark:bg-black/30 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              Hoje (18/08)
            </button>
            <button
              onClick={() => handleSetDateFilter('yesterday')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dateMode === 'yesterday'
                  ? 'bg-gradient-loopis text-white shadow-md'
                  : 'bg-white dark:bg-black/30 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              Ontem (17/08)
            </button>
            <button
              onClick={() => handleSetDateFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dateMode === 'all'
                  ? 'bg-gradient-loopis text-white shadow-md'
                  : 'bg-white dark:bg-black/30 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              Todo o Histórico
            </button>
          </div>

          {/* DatePicker Customizado */}
          <div className="flex items-center space-x-2 bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-xl shadow-sm">
            <Calendar size={16} className="text-brand-violet" />
            <span className="text-xs font-bold text-gray-500">Escolher data:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setDateMode('custom');
              }}
              className="text-xs font-bold text-brand-graphite dark:text-white bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Linha 2: Busca e Filtros de Presença e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
          {/* Busca por Texto */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, telefone ou comanda..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs text-brand-graphite dark:text-white focus:ring-2 focus:ring-brand-violet outline-none"
            />
          </div>

          {/* Filtro de Status de Presença */}
          <div>
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'compareceu' | 'no_show')}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs font-bold text-brand-graphite dark:text-white outline-none cursor-pointer"
            >
              <option value="all">Status: Todos (Presença e No-Show)</option>
              <option value="compareceu">Compareceram (Presença Confirmada)</option>
              <option value="no_show">No-Show (Não Compareceram)</option>
            </select>
          </div>

          {/* Filtro de Tipo de Parceiro */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs font-bold text-brand-graphite dark:text-white outline-none cursor-pointer"
            >
              <option value="all">Tipo: Todos os Serviços</option>
              <option value="restaurante">Restaurante / Gastronomia</option>
              <option value="tour">Tours & Roteiros</option>
              <option value="evento">Eventos & Shows</option>
              <option value="rental">Locações</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards do Período Filtrado */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="glassmorphism p-4 rounded-2xl border border-gray-100 dark:border-white/10">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Reservas / Atendimentos</span>
          <p className="text-xl font-black text-brand-graphite dark:text-white mt-1">{filteredActivities.length}</p>
          <span className="text-[10px] text-gray-400">{totalClientes} pessoas no total</span>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] font-bold text-emerald-600 uppercase flex items-center space-x-1">
            <CheckCircle2 size={13} />
            <span>Compareceram</span>
          </span>
          <p className="text-xl font-black text-emerald-600 mt-1">{compareceramCount}</p>
          <span className="text-[10px] text-emerald-600/80 font-semibold">
            {filteredActivities.length > 0 ? Math.round((compareceramCount / filteredActivities.length) * 100) : 0}% taxa de presença
          </span>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
          <span className="text-[11px] font-bold text-red-500 uppercase flex items-center space-x-1">
            <XCircle size={13} />
            <span>No-Show</span>
          </span>
          <p className="text-xl font-black text-red-500 mt-1">{noShowCount}</p>
          <span className="text-[10px] text-red-400">Ausentes na data</span>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border border-gray-100 dark:border-white/10">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Faturamento Comandas</span>
          <p className="text-xl font-black text-brand-violet mt-1">R$ {faturamentoTotal.toFixed(2)}</p>
          <span className="text-[10px] text-gray-400">Ticket Médio: R$ {compareceramCount > 0 ? (faturamentoTotal / compareceramCount).toFixed(2) : '0,00'}</span>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border border-gray-100 dark:border-white/10">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Loops Gerados</span>
          <p className="text-xl font-black text-amber-500 mt-1">{loopsTotal} Loops</p>
          <span className="text-[10px] text-gray-400">Fidelização de clientes</span>
        </div>
      </div>

      {/* Listagem de Registros Históricos */}
      <div className="glassmorphism rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="text-brand-violet" size={18} />
            <h3 className="font-bold text-sm text-brand-graphite dark:text-white">
              Histórico de Reservas e Consumo ({filteredActivities.length} registros)
            </h3>
          </div>
          {selectedDate && (
            <span className="text-xs text-brand-violet font-bold bg-brand-violet/10 px-2.5 py-1 rounded-lg">
              Data: {selectedDate.split('-').reverse().join('/')}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 font-bold border-b border-gray-100 dark:border-white/10">
              <tr>
                <th className="px-5 py-3.5">Data / Hora</th>
                <th className="px-5 py-3.5">Cliente</th>
                <th className="px-5 py-3.5">Serviço</th>
                <th className="px-5 py-3.5">Presença</th>
                <th className="px-5 py-3.5">Benefício Loopis</th>
                <th className="px-5 py-3.5">Consumo Total</th>
                <th className="px-5 py-3.5 text-right">Comanda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredActivities.map((act) => {
                const attended = act.statusPresenca === 'compareceu';
                return (
                  <tr key={act.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-brand-graphite dark:text-white">{act.data.split('-').reverse().join('/')}</div>
                      <div className="text-[11px] text-gray-400 flex items-center space-x-1">
                        <Clock size={11} />
                        <span>{act.horario}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-brand-graphite dark:text-white">{act.clienteNome}</div>
                      <div className="text-[11px] text-gray-400">{act.clienteTelefone} • {act.pessoasQtd} pax</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-1.5 font-semibold text-gray-700 dark:text-gray-300">
                        {getPartnerTypeIcon(act.tipoParceiro)}
                        <span className="capitalize">{act.tipoParceiro}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {attended ? (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          <span>Compareceu ({act.horarioCheckin || 'Check-in'})</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-500 border border-red-500/20">
                          <XCircle size={12} />
                          <span>No-Show (Não foi)</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-[11px] text-brand-violet dark:text-brand-lilac font-semibold bg-brand-violet/5 dark:bg-brand-violet/10 px-2 py-0.5 rounded-md">
                        {act.beneficioUtilizado || 'Padrão Loopis'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {attended ? (
                        <div>
                          <span className="font-black text-brand-graphite dark:text-white">R$ {act.totalGasto.toFixed(2)}</span>
                          <div className="text-[10px] text-emerald-600 font-bold">+{act.loopsGerados} Loops</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-mono">-</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {act.comanda ? (
                        <button
                          onClick={() => setSelectedActivity(act)}
                          className="px-3 py-1.5 bg-brand-violet/10 hover:bg-brand-violet text-brand-violet hover:text-white text-[11px] font-bold rounded-xl transition-all inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Ver Comanda</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Sem comanda</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    Nenhuma atividade encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE DETALHAMENTO DA COMANDA DO CLIENTE */}
      <AnimatePresence>
        {selectedActivity && selectedActivity.comanda && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-brand-graphite max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-white/10 relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Fechar */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Cabeçalho */}
              <div>
                <div className="flex items-center space-x-2">
                  <Receipt className="text-brand-violet" size={24} />
                  <h3 className="text-lg font-black text-brand-graphite dark:text-white">
                    Comanda {selectedActivity.comanda.comandaCode}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Atendimento de <strong>{selectedActivity.clienteNome}</strong> em {selectedActivity.data.split('-').reverse().join('/')} às {selectedActivity.horario} ({selectedActivity.comanda.mesaOuReferencia})
                </p>
              </div>

              {/* Informações da Presença */}
              <div className="bg-emerald-500/10 p-3 rounded-2xl flex items-center justify-between text-xs border border-emerald-500/20">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center space-x-1.5">
                  <CheckCircle2 size={16} />
                  <span>Presença confirmada ({selectedActivity.horarioCheckin})</span>
                </span>
                <span className="text-[11px] font-bold text-gray-500">{selectedActivity.pessoasQtd} pessoas</span>
              </div>

              {/* Lista de Itens Consumidos */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Itens Consumidos</h4>
                <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-56 overflow-y-auto pr-1">
                  {selectedActivity.comanda.itens.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5 min-w-0 pr-3">
                        <span className="font-extrabold text-brand-violet">{item.quantidade}x</span>
                        <span className="font-semibold text-brand-graphite dark:text-white truncate">{item.nome}</span>
                      </div>
                      <span className="font-bold text-brand-graphite dark:text-white shrink-0">
                        R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discriminação de Valores */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal dos Itens:</span>
                  <span>R$ {selectedActivity.comanda.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxa de Serviço:</span>
                  <span>R$ {selectedActivity.comanda.taxaServico.toFixed(2)}</span>
                </div>
                {selectedActivity.comanda.descontoLoops > 0 && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Desconto Loops / Cashback:</span>
                    <span>- R$ {selectedActivity.comanda.descontoLoops.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-base text-brand-graphite dark:text-white pt-2 border-t border-gray-200 dark:border-white/10">
                  <span>Total Pago:</span>
                  <span className="text-brand-violet">R$ {selectedActivity.comanda.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                  <span>Forma de Pagamento:</span>
                  <span className="font-bold uppercase text-brand-graphite dark:text-white">
                    {selectedActivity.comanda.formaPagamento || 'PIX'}
                  </span>
                </div>
              </div>

              {/* Foto do Cupom Fiscal / Auditoria se houver */}
              {selectedActivity.comanda.fotoCupomUrl && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <Receipt size={14} className="text-brand-violet" />
                    <span>Comprovante / Cupom Fiscal Anexado</span>
                  </h4>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 max-h-40">
                    <img src={selectedActivity.comanda.fotoCupomUrl} alt="Comprovante" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Botão de Fechar */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-brand-graphite dark:text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                Fechar Detalhes da Comanda
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
