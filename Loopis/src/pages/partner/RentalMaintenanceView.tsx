import React, { useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, CheckCircle, CloudRain, CloudSun, Edit2, Plus, Trash2, Wrench, X } from 'lucide-react';

type BlockReason = 'manutencao' | 'clima' | 'evento_privado' | 'outro';
type BlockStatus = 'agendado' | 'ativo' | 'resolvido';

interface MaintenanceBlock {
  id: string;
  assetName: string;
  reason: BlockReason;
  date: string;
  startTime: string;
  endTime: string;
  status: BlockStatus;
  note: string;
}

const initialBlocks: MaintenanceBlock[] = [
  {
    id: 'block-1',
    assetName: 'Quadra Beach Tennis 01',
    reason: 'manutencao',
    date: '2026-08-20',
    startTime: '08:00',
    endTime: '11:00',
    status: 'ativo',
    note: 'Troca da rede e nivelamento rápido da areia.',
  },
  {
    id: 'block-2',
    assetName: 'Jet-ski Jurerê 300HP',
    reason: 'clima',
    date: '2026-08-21',
    startTime: '13:00',
    endTime: '17:00',
    status: 'agendado',
    note: 'Previsão de vento sul forte. Reavaliar às 10h.',
  },
];

const emptyBlock: Omit<MaintenanceBlock, 'id'> = {
  assetName: 'Quadra Beach Tennis 01',
  reason: 'manutencao',
  date: '',
  startTime: '08:00',
  endTime: '10:00',
  status: 'agendado',
  note: '',
};

const reasonLabel: Record<BlockReason, string> = {
  manutencao: 'Manutenção',
  clima: 'Clima',
  evento_privado: 'Evento privado',
  outro: 'Outro',
};

const statusClass: Record<BlockStatus, string> = {
  agendado: 'bg-yellow-500/15 text-yellow-300',
  ativo: 'bg-red-500/15 text-red-300',
  resolvido: 'bg-emerald-500/15 text-emerald-300',
};

export const RentalMaintenanceView: React.FC = () => {
  const [blocks, setBlocks] = useState<MaintenanceBlock[]>(initialBlocks);
  const [form, setForm] = useState<Omit<MaintenanceBlock, 'id'>>(emptyBlock);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const filteredBlocks = useMemo(
    () => blocks.filter((block) => !dateFilter || block.date === dateFilter),
    [blocks, dateFilter],
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyBlock);
    setIsModalOpen(true);
  };

  const openEdit = (block: MaintenanceBlock) => {
    setEditingId(block.id);
    setForm({
      assetName: block.assetName,
      reason: block.reason,
      date: block.date,
      startTime: block.startTime,
      endTime: block.endTime,
      status: block.status,
      note: block.note,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.date || !form.assetName.trim()) return;

    if (editingId) {
      setBlocks((current) => current.map((block) => (block.id === editingId ? { ...block, ...form } : block)));
    } else {
      setBlocks((current) => [{ ...form, id: `block-${Date.now()}` }, ...current]);
    }

    setEditingId(null);
    setForm(emptyBlock);
    setIsModalOpen(false);
  };

  const activeBlocks = blocks.filter((block) => block.status === 'ativo').length;
  const weatherBlocks = blocks.filter((block) => block.reason === 'clima' && block.status !== 'resolvido').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black">Manutenção / Clima</h2>
          <p className="mt-1 text-sm text-gray-400">Bloqueie horários por manutenção, chuva, vento, eventos privados ou indisponibilidade operacional.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-gray-300">
            <CalendarClock size={16} className="text-brand-lilac" />
            <span>Data</span>
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="bg-transparent text-white outline-none [color-scheme:dark]" />
          </label>
          {dateFilter && <button type="button" onClick={() => setDateFilter('')} className="rounded-2xl border border-white/10 px-3 py-2 text-xs font-black text-gray-300">Limpar</button>}
          <button type="button" onClick={openCreate} className="flex items-center justify-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-sm font-black text-white">
            <Plus size={16} />
            Novo bloqueio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <Wrench size={22} className="text-brand-lilac" />
          <p className="mt-4 text-2xl font-black">{activeBlocks}</p>
          <p className="text-xs text-gray-500">Bloqueios ativos agora</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <CloudRain size={22} className="text-sky-300" />
          <p className="mt-4 text-2xl font-black">{weatherBlocks}</p>
          <p className="text-xs text-gray-500">Alertas de clima em aberto</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <CloudSun size={22} className="text-yellow-300" />
          <p className="mt-4 text-2xl font-black">Vento 28 km/h</p>
          <p className="text-xs text-gray-500">Condição monitorada para hoje</p>
        </article>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-lg font-black">Bloqueios operacionais</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredBlocks.map((block) => (
            <article key={block.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusClass[block.status]}`}>{block.status}</span>
                  <h4 className="mt-3 text-lg font-black">{block.assetName}</h4>
                  <p className="mt-1 text-sm text-gray-400">{reasonLabel[block.reason]} • {block.date} • {block.startTime}-{block.endTime}</p>
                </div>
                <AlertTriangle size={24} className={block.status === 'ativo' ? 'text-red-300' : 'text-brand-lilac'} />
              </div>
              <p className="mt-4 rounded-2xl bg-white/[0.04] p-3 text-sm text-gray-300">{block.note || 'Sem observações adicionais.'}</p>
              <div className="mt-4 flex gap-2">
                {block.status !== 'resolvido' && (
                  <button type="button" onClick={() => setBlocks((current) => current.map((item) => item.id === block.id ? { ...item, status: 'resolvido' } : item))} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2 text-xs font-black text-white">
                    <CheckCircle size={14} />
                    Resolver
                  </button>
                )}
                <button type="button" onClick={() => openEdit(block)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 py-2 text-xs font-black text-gray-200">
                  <Edit2 size={14} />
                  Editar
                </button>
                <button type="button" onClick={() => setBlocks((current) => current.filter((item) => item.id !== block.id))} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/20 py-2 text-xs font-black text-red-300">
                  <Trash2 size={14} />
                  Excluir
                </button>
              </div>
            </article>
          ))}
          {filteredBlocks.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500 lg:col-span-2">
              Nenhum bloqueio encontrado para o filtro selecionado.
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Bloqueio operacional</p>
                <h3 className="mt-1 text-xl font-black">{editingId ? 'Editar manutenção ou clima' : 'Criar bloqueio de agenda'}</h3>
                <p className="mt-1 text-sm text-gray-400">Defina ativo, motivo, data, janela de horário e impacto na disponibilidade.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">
                Ativo afetado
                <select value={form.assetName} onChange={(event) => setForm((current) => ({ ...current, assetName: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                  <option>Quadra Beach Tennis 01</option>
                  <option>Quadra Beach Tennis 02</option>
                  <option>Jet-ski Jurerê 300HP</option>
                  <option>Kit Stand Up Paddle</option>
                </select>
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Motivo
                <select value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value as BlockReason }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                  <option value="manutencao">Manutenção</option>
                  <option value="clima">Clima</option>
                  <option value="evento_privado">Evento privado</option>
                  <option value="outro">Outro</option>
                </select>
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Data do bloqueio
                <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet [color-scheme:dark]" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Início
                <input type="time" value={form.startTime} onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet [color-scheme:dark]" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Fim
                <input type="time" value={form.endTime} onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet [color-scheme:dark]" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">
                Status
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as BlockStatus }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                  <option value="agendado">Agendado</option>
                  <option value="ativo">Ativo</option>
                  <option value="resolvido">Resolvido</option>
                </select>
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">
                Observação para equipe
                <textarea value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} rows={3} placeholder="Ex: chuva forte, manutenção de rede, limpeza da areia..." className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
            </div>

            <button type="button" onClick={handleSubmit} className="mt-4 w-full rounded-2xl bg-brand-violet px-4 py-3 text-sm font-black text-white">
              {editingId ? 'Salvar alterações' : 'Criar bloqueio'}
            </button>
          </section>
        </div>
      )}
    </div>
  );
};
