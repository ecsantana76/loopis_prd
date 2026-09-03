import React, { useState } from 'react';
import { Anchor, BadgeCheck, Edit2, ImagePlus, Plus, ShipWheel, Trash2, UserCheck, X } from 'lucide-react';

export type ResourceKind = 'guia' | 'embarcacao' | 'equipamento';
type ResourceStatus = 'ativo' | 'manutencao' | 'indisponivel';

export interface TourResource {
  id: string;
  kind: ResourceKind;
  name: string;
  description: string;
  capacity: number;
  document: string;
  status: ResourceStatus;
  imageUrl: string;
}

export const initialTourResources: TourResource[] = [
  { id: 'res-1', kind: 'guia', name: 'Caio Menezes', description: 'Guia náutico credenciado, primeiros socorros e inglês intermediário.', capacity: 8, document: 'CADASTUR 482910', status: 'ativo', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80' },
  { id: 'res-2', kind: 'embarcacao', name: 'Lancha Loopis 28', description: 'Lancha 28 pés com banheiro, som e coletes homologados.', capacity: 8, document: 'Inscrição 8821-SC', status: 'ativo', imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=700&q=80' },
  { id: 'res-3', kind: 'equipamento', name: 'Kit Snorkel Premium', description: 'Máscaras, nadadeiras e coletes extras para saída Costa da Lagoa.', capacity: 12, document: 'Lote EQP-2026-08', status: 'manutencao', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80' },
];

const emptyResource: Omit<TourResource, 'id'> = {
  kind: 'guia',
  name: '',
  description: '',
  capacity: 1,
  document: '',
  status: 'ativo',
  imageUrl: '',
};

const kindLabel: Record<ResourceKind, string> = {
  guia: 'Guia',
  embarcacao: 'Embarcação',
  equipamento: 'Equipamento',
};

const statusClass: Record<ResourceStatus, string> = {
  ativo: 'bg-emerald-500/15 text-emerald-300',
  manutencao: 'bg-yellow-500/15 text-yellow-300',
  indisponivel: 'bg-red-500/15 text-red-300',
};

export const TourGuidesFleetView: React.FC = () => {
  const [resources, setResources] = useState<TourResource[]>(initialTourResources);
  const [form, setForm] = useState<Omit<TourResource, 'id'>>(emptyResource);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kindFilter, setKindFilter] = useState<'todos' | ResourceKind>('todos');

  const filteredResources = resources.filter((resource) => kindFilter === 'todos' || resource.kind === kindFilter);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setForm((current) => ({ ...current, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyResource);
    setIsModalOpen(true);
  };

  const openEdit = (resource: TourResource) => {
    setEditingId(resource.id);
    setForm({
      kind: resource.kind,
      name: resource.name,
      description: resource.description,
      capacity: resource.capacity,
      document: resource.document,
      status: resource.status,
      imageUrl: resource.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      setResources((current) => current.map((resource) => (resource.id === editingId ? { ...resource, ...form } : resource)));
    } else {
      setResources((current) => [{ ...form, id: `res-${Date.now()}` }, ...current]);
    }

    setEditingId(null);
    setForm(emptyResource);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black">Guias e Embarcações</h2>
          <p className="mt-1 text-sm text-gray-400">Cadastre guias, embarcações e equipamentos que podem ser vinculados às suas saídas.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value as typeof kindFilter)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm font-bold text-white outline-none">
            <option value="todos">Todos os recursos</option>
            <option value="guia">Guias</option>
            <option value="embarcacao">Embarcações</option>
            <option value="equipamento">Equipamentos</option>
          </select>
          <button type="button" onClick={openCreate} className="flex items-center justify-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-sm font-black text-white">
            <Plus size={16} />
            Novo recurso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: UserCheck, label: 'Guias ativos', value: resources.filter((item) => item.kind === 'guia' && item.status === 'ativo').length },
          { icon: ShipWheel, label: 'Embarcações', value: resources.filter((item) => item.kind === 'embarcacao').length },
          { icon: Anchor, label: 'Equipamentos', value: resources.filter((item) => item.kind === 'equipamento').length },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <Icon size={21} className="text-brand-lilac" />
              <p className="mt-4 text-2xl font-black">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.label}</p>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <article key={resource.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            {resource.imageUrl && <img src={resource.imageUrl} alt={resource.name} className="h-44 w-full object-cover" />}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusClass[resource.status]}`}>{resource.status}</span>
                  <h3 className="mt-3 text-lg font-black">{resource.name}</h3>
                  <p className="mt-1 text-sm text-brand-lilac">{kindLabel[resource.kind]} • capacidade {resource.capacity}</p>
                </div>
                <BadgeCheck size={22} className="text-brand-lilac" />
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-gray-400">{resource.description}</p>
              <p className="mt-3 rounded-2xl bg-black/25 p-3 text-xs font-bold text-gray-300">{resource.document}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => openEdit(resource)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 py-2 text-xs font-black text-gray-200"><Edit2 size={14} /> Editar</button>
                <button type="button" onClick={() => setResources((current) => current.filter((item) => item.id !== resource.id))} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/20 py-2 text-xs font-black text-red-300"><Trash2 size={14} /> Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {isModalOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Cadastro operacional</p>
                <h3 className="mt-1 text-xl font-black">{editingId ? 'Editar guia, embarcação ou equipamento' : 'Novo guia, embarcação ou equipamento'}</h3>
                <p className="mt-1 text-sm text-gray-400">Adicione imagem, documentação, capacidade e status para vincular às saídas.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300"><X size={16} /></button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="relative flex h-52 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/25 text-center sm:h-60">
                {form.imageUrl ? <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" /> : (
                  <div className="p-6"><ImagePlus size={34} className="mx-auto text-brand-lilac" /><p className="mt-3 text-sm font-black">Foto do recurso</p><p className="mt-1 text-xs text-gray-500">Guia, barco ou equipamento</p></div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-bold text-gray-400">Tipo
                  <select value={form.kind} onChange={(event) => setForm((current) => ({ ...current, kind: event.target.value as ResourceKind }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                    <option value="guia">Guia</option>
                    <option value="embarcacao">Embarcação</option>
                    <option value="equipamento">Equipamento</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Status
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ResourceStatus }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                    <option value="ativo">Ativo</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="indisponivel">Indisponível</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Nome
                  <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Capacidade
                  <input type="number" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Documento / licença
                  <input value={form.document} onChange={(event) => setForm((current) => ({ ...current, document: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Descrição operacional
                  <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
              </div>
            </div>
            <button type="button" onClick={handleSubmit} className="mt-4 w-full rounded-2xl bg-brand-violet px-4 py-3 text-sm font-black text-white">{editingId ? 'Salvar alterações' : 'Cadastrar recurso'}</button>
          </section>
        </div>
      )}
    </div>
  );
};
