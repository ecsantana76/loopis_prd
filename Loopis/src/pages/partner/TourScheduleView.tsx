import React, { useState } from 'react';
import { Check, Edit2, ImagePlus, Plus, ShipWheel, Trash2, Users, X } from 'lucide-react';
import { initialTourResources } from './TourGuidesFleetView';

interface TourItem {
  id: string;
  name: string;
  description: string;
  meetingPoint: string;
  departureTimes: string;
  maxGuests: number;
  price: number;
  status: 'ativo' | 'pausado';
  imageUrl: string;
  resourceIds: string[];
}

const initialTours: TourItem[] = [
  {
    id: 'tour-1',
    name: 'Lancha Costa da Lagoa + Almoço',
    description: 'Passeio de lancha pela Lagoa da Conceição com paradas para banho e almoço em restaurante parceiro.',
    meetingPoint: 'Trapiche da Lagoa',
    departureTimes: '09:00, 14:00',
    maxGuests: 8,
    price: 240,
    status: 'ativo',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
    resourceIds: ['res-1', 'res-2', 'res-3'],
  },
  {
    id: 'tour-2',
    name: 'Sunset Baía Norte',
    description: 'Saída ao fim da tarde com rota panorâmica, música ambiente e vista do pôr do sol em Floripa.',
    meetingPoint: 'Santo Antônio de Lisboa',
    departureTimes: '17:30',
    maxGuests: 10,
    price: 180,
    status: 'pausado',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    resourceIds: ['res-2'],
  },
];

const emptyTour: Omit<TourItem, 'id'> = {
  name: '',
  description: '',
  meetingPoint: '',
  departureTimes: '09:00, 14:00',
  maxGuests: 8,
  price: 150,
  status: 'ativo',
  imageUrl: '',
  resourceIds: [],
};

export const TourScheduleView: React.FC = () => {
  const [tours, setTours] = useState<TourItem[]>(initialTours);
  const [form, setForm] = useState<Omit<TourItem, 'id'>>(emptyTour);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleResource = (resourceId: string) => {
    setForm((current) => ({
      ...current,
      resourceIds: current.resourceIds.includes(resourceId)
        ? current.resourceIds.filter((id) => id !== resourceId)
        : [...current.resourceIds, resourceId],
    }));
  };

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
      setTours((current) => current.map((tour) => (tour.id === editingId ? { ...tour, ...form } : tour)));
      setEditingId(null);
    } else {
      setTours((current) => [{ ...form, id: `tour-${Date.now()}` }, ...current]);
    }

    setForm(emptyTour);
    setIsModalOpen(false);
  };

  const handleEdit = (tour: TourItem) => {
    setEditingId(tour.id);
    setForm({
      name: tour.name,
      description: tour.description,
      meetingPoint: tour.meetingPoint,
      departureTimes: tour.departureTimes,
      maxGuests: tour.maxGuests,
      price: tour.price,
      status: tour.status,
      imageUrl: tour.imageUrl,
      resourceIds: tour.resourceIds,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black">Meus Tours & Aventuras</h2>
          <p className="mt-1 text-sm text-gray-400">Crie, edite e publique passeios, saídas, trilhas e experiências guiadas.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-black text-brand-lilac">{tours.length} experiências</span>
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyTour); setIsModalOpen(true); }} className="inline-flex items-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-xs font-black text-white">
            <Plus size={15} /> Criar tour
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Cadastro de tour e aventura</p>
                <h3 className="mt-1 text-xl font-black">{editingId ? 'Editar experiência guiada' : 'Criar nova experiência guiada'}</h3>
                <p className="mt-1 text-sm text-gray-400">Configure foto, ponto de encontro, horários, preço e capacidade da saída.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300"><X size={16} /></button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="group relative flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/25 text-center sm:h-60">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Preview do tour" className="h-full w-full object-cover" />
                ) : (
                  <div className="p-6">
                    <ImagePlus size={34} className="mx-auto text-brand-lilac" />
                    <p className="mt-3 text-sm font-black">Foto principal</p>
                    <p className="mt-1 text-xs text-gray-500">Imagem que aparecerá no app do turista</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Nome do tour
                  <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ex: Lancha Costa da Lagoa + Almoço" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Descrição da experiência
                  <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Conte o que está incluso, roteiro, diferenciais e cuidados da experiência." className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Ponto de encontro
                  <input value={form.meetingPoint} onChange={(event) => setForm((current) => ({ ...current, meetingPoint: event.target.value }))} placeholder="Trapiche da Lagoa" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Horários de saída
                  <input value={form.departureTimes} onChange={(event) => setForm((current) => ({ ...current, departureTimes: event.target.value }))} placeholder="09:00, 14:00" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Lotação máxima
                  <input type="number" value={form.maxGuests} onChange={(event) => setForm((current) => ({ ...current, maxGuests: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Preço por pessoa
                  <input type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Status de publicação
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TourItem['status'] }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                    <option value="ativo">Ativo</option>
                    <option value="pausado">Pausado</option>
                  </select>
                </label>
                <div className="space-y-2 sm:col-span-2">
                  <div>
                    <p className="text-xs font-bold text-gray-400">Guias, embarcações e equipamentos vinculados</p>
                    <p className="mt-1 text-xs text-gray-500">Selecione um ou mais recursos que serão usados nessa experiência.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {initialTourResources.map((resource) => {
                      const isSelected = form.resourceIds.includes(resource.id);
                      return (
                        <button
                          key={resource.id}
                          type="button"
                          onClick={() => toggleResource(resource.id)}
                          className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${isSelected ? 'border-brand-violet bg-brand-violet/15' : 'border-white/10 bg-black/25 hover:border-brand-violet/40'}`}
                        >
                          <img src={resource.imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black">{resource.name}</p>
                            <p className="text-xs text-gray-500">{resource.kind} • capacidade {resource.capacity}</p>
                          </div>
                          {isSelected && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-violet text-white"><Check size={14} /></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <button type="button" onClick={handleSubmit} className="mt-4 w-full rounded-2xl bg-brand-violet px-4 py-3 text-sm font-black text-white">{editingId ? 'Salvar alterações' : 'Criar tour'}</button>
          </section>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tours.map((tour) => (
          <article key={tour.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            {(() => {
              const selectedResources = initialTourResources.filter((resource) => tour.resourceIds.includes(resource.id));
              return (
                <>
            {tour.imageUrl && <img src={tour.imageUrl} alt={tour.name} className="mb-4 h-40 w-full rounded-2xl object-cover" />}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${tour.status === 'ativo' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300'}`}>{tour.status}</span>
                <h3 className="mt-3 text-lg font-black">{tour.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{tour.description}</p>
                <p className="mt-1 text-sm text-gray-400">{tour.meetingPoint}</p>
              </div>
              <ShipWheel size={24} className="text-brand-lilac" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Saídas</p>
                <p className="mt-1 text-xs font-black">{tour.departureTimes}</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Vagas</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-black"><Users size={13} /> {tour.maxGuests}</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Preço</p>
                <p className="mt-1 text-xs font-black">R$ {tour.price}</p>
              </div>
            </div>
            {selectedResources.length > 0 && (
              <div className="mt-4 rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Recursos vinculados</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedResources.map((resource) => (
                    <span key={resource.id} className="rounded-full bg-brand-violet/15 px-3 py-1 text-[10px] font-black text-brand-lilac">{resource.name}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => handleEdit(tour)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 py-2 text-xs font-black text-gray-200"><Edit2 size={14} /> Editar</button>
              <button type="button" onClick={() => setTours((current) => current.filter((item) => item.id !== tour.id))} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/20 py-2 text-xs font-black text-red-300"><Trash2 size={14} /> Excluir</button>
            </div>
                </>
              );
            })()}
          </article>
        ))}
      </div>
    </div>
  );
};
