import React, { useState } from 'react';
import { CalendarClock, Edit2, ImagePlus, Plus, Trash2, X } from 'lucide-react';

interface RentalAsset {
  id: string;
  name: string;
  description: string;
  type: string;
  hourlyPrice: number;
  minimumHours: number;
  schedule: string;
  status: 'disponivel' | 'manutencao' | 'bloqueado';
  imageUrl: string;
}

const initialAssets: RentalAsset[] = [
  { id: 'asset-1', name: 'Quadra Beach Tennis 01', description: 'Quadra iluminada com areia nivelada, rede oficial e estrutura para aulas ou jogos avulsos.', type: 'Quadra', hourlyPrice: 90, minimumHours: 1, schedule: '08:00-22:00', status: 'disponivel', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80' },
  { id: 'asset-2', name: 'Jet-ski Jurerê 300HP', description: 'Jet-ski para locação acompanhada, com colete incluso, instrução inicial e caução obrigatória.', type: 'Jet-ski', hourlyPrice: 220, minimumHours: 1, schedule: '09:00-17:00', status: 'manutencao', imageUrl: 'https://images.unsplash.com/photo-1564149504298-00c351fd7f16?auto=format&fit=crop&w=900&q=80' },
];

const emptyAsset: Omit<RentalAsset, 'id'> = {
  name: '',
  description: '',
  type: 'Quadra',
  hourlyPrice: 90,
  minimumHours: 1,
  schedule: '08:00-22:00',
  status: 'disponivel',
  imageUrl: '',
};

export const RentalAssetsView: React.FC = () => {
  const [assets, setAssets] = useState<RentalAsset[]>(initialAssets);
  const [form, setForm] = useState<Omit<RentalAsset, 'id'>>(emptyAsset);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((current) => ({ ...current, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      setAssets((current) => current.map((asset) => (asset.id === editingId ? { ...asset, ...form } : asset)));
      setEditingId(null);
    } else {
      setAssets((current) => [{ ...form, id: `asset-${Date.now()}` }, ...current]);
    }

    setForm(emptyAsset);
    setIsModalOpen(false);
  };

  const handleEdit = (asset: RentalAsset) => {
    setEditingId(asset.id);
    setForm({
      name: asset.name,
      description: asset.description,
      type: asset.type,
      hourlyPrice: asset.hourlyPrice,
      minimumHours: asset.minimumHours,
      schedule: asset.schedule,
      status: asset.status,
      imageUrl: asset.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyAsset);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black">Minhas Locações & Quadras</h2>
          <p className="mt-1 text-sm text-gray-400">Cadastre quadras, jet-skis, equipamentos e janelas de aluguel por hora.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-black text-brand-lilac">{assets.length} ativos</span>
          <button type="button" onClick={handleCreate} className="flex items-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-sm font-black text-white">
            <Plus size={16} />
            Criar ativo
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Cadastro de locação e quadra</p>
                <h3 className="mt-1 text-xl font-black">{editingId ? 'Editar ativo locável' : 'Criar novo ativo locável'}</h3>
                <p className="mt-1 text-sm text-gray-400">Configure foto, tipo, disponibilidade, preço por hora e tempo mínimo de aluguel.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300">
                <X size={16} />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="group relative flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/25 text-center sm:h-60">
                {form.imageUrl ? <img src={form.imageUrl} alt="Preview do ativo" className="h-full w-full object-cover" /> : (
                  <div className="p-6"><ImagePlus size={34} className="mx-auto text-brand-lilac" /><p className="mt-3 text-sm font-black">Foto do ativo</p><p className="mt-1 text-xs text-gray-500">Quadra, jet-ski ou equipamento</p></div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Nome do ativo/quadra
                  <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ex: Quadra Beach Tennis 01" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Descrição da locação
                  <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Descreva regras de uso, itens inclusos, caução e diferenciais do ativo." className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Tipo
                  <input value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} placeholder="Quadra, jet-ski, equipamento" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Grade de funcionamento
                  <input value={form.schedule} onChange={(event) => setForm((current) => ({ ...current, schedule: event.target.value }))} placeholder="08:00-22:00" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Valor por hora
                  <input type="number" value={form.hourlyPrice} onChange={(event) => setForm((current) => ({ ...current, hourlyPrice: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Tempo mínimo (horas)
                  <input type="number" value={form.minimumHours} onChange={(event) => setForm((current) => ({ ...current, minimumHours: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Status operacional
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as RentalAsset['status'] }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                    <option value="disponivel">Disponível</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="bloqueado">Bloqueado</option>
                  </select>
                </label>
              </div>
            </div>
            <button type="button" onClick={handleSubmit} className="mt-4 w-full rounded-2xl bg-brand-violet px-4 py-3 text-sm font-black text-white">{editingId ? 'Salvar alterações' : 'Criar ativo'}</button>
          </section>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {assets.map((asset) => (
          <article key={asset.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            {asset.imageUrl && <img src={asset.imageUrl} alt={asset.name} className="mb-4 h-40 w-full rounded-2xl object-cover" />}
            <div className="flex items-start justify-between">
              <div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${asset.status === 'disponivel' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300'}`}>{asset.status}</span>
                <h3 className="mt-3 text-lg font-black">{asset.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{asset.description}</p>
                <p className="text-sm text-gray-400">{asset.type}</p>
              </div>
              <CalendarClock size={24} className="text-brand-lilac" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Grade</p>
                <p className="mt-1 text-xs font-black">{asset.schedule}</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">R$/h</p>
                <p className="mt-1 text-xs font-black">R$ {asset.hourlyPrice}</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Mín.</p>
                <p className="mt-1 text-xs font-black">{asset.minimumHours}h</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => handleEdit(asset)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 py-2 text-xs font-black text-gray-200"><Edit2 size={14} /> Editar</button>
              <button type="button" onClick={() => setAssets((current) => current.filter((item) => item.id !== asset.id))} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/20 py-2 text-xs font-black text-red-300"><Trash2 size={14} /> Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
