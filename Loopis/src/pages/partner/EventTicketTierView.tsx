import React, { useState } from 'react';
import { CheckCircle2, Edit2, ImagePlus, Plus, ShieldCheck, Ticket, Trash2, X } from 'lucide-react';

interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  sector: string;
  tierName: string;
  tierPrice: number;
  quantity: number;
  sold: number;
  imageUrl: string;
  includedItems: string[];
  cancellationPolicy: string;
}

const initialEvents: EventItem[] = [
  { id: 'event-1', name: 'Floripa Sunset Sessions', description: 'Festa sunset com DJs locais, bar premium, área VIP e entrada integrada ao app Loopis.', date: '2026-08-29', sector: 'Pista', tierName: '2º Lote', tierPrice: 80, quantity: 300, sold: 184, imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=80', includedItems: ['Acesso à pista', 'Copo exclusivo do evento', 'Guarda-volumes'], cancellationPolicy: 'Cancelamento gratuito até 7 dias antes do evento. Após esse prazo, o ingresso pode ser transferido para outra pessoa até 24 horas antes da abertura da portaria.' },
  { id: 'event-2', name: 'Jazz & Wine Experience', description: 'Noite de jazz ao vivo com curadoria de vinhos, setores limitados e experiência premium.', date: '2026-09-05', sector: 'Camarote', tierName: 'VIP', tierPrice: 260, quantity: 60, sold: 32, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80', includedItems: ['Mesa reservada no camarote', 'Taça de boas-vindas', 'Degustação de três rótulos'], cancellationPolicy: 'Reembolso integral para solicitações feitas em até 7 dias após a compra, desde que restem ao menos 48 horas para o evento.' },
];

const emptyEvent: Omit<EventItem, 'id' | 'sold'> = {
  name: '',
  description: '',
  date: '',
  sector: 'Pista',
  tierName: 'Lote 1',
  tierPrice: 80,
  quantity: 100,
  imageUrl: '',
  includedItems: [],
  cancellationPolicy: '',
};

export const EventTicketTierView: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [form, setForm] = useState<Omit<EventItem, 'id' | 'sold'>>(emptyEvent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includedItemDraft, setIncludedItemDraft] = useState('');

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
      setEvents((current) => current.map((event) => (event.id === editingId ? { ...event, ...form } : event)));
      setEditingId(null);
    } else {
      setEvents((current) => [{ ...form, sold: 0, id: `event-${Date.now()}` }, ...current]);
    }

    setForm(emptyEvent);
    setIncludedItemDraft('');
    setIsModalOpen(false);
  };

  const addIncludedItem = () => {
    const item = includedItemDraft.trim();
    if (!item || form.includedItems.some((includedItem) => includedItem.toLowerCase() === item.toLowerCase())) return;
    setForm((current) => ({ ...current, includedItems: [...current.includedItems, item] }));
    setIncludedItemDraft('');
  };

  const handleEdit = (event: EventItem) => {
    setEditingId(event.id);
    setForm({
      name: event.name,
      description: event.description,
      date: event.date,
      sector: event.sector,
      tierName: event.tierName,
      tierPrice: event.tierPrice,
      quantity: event.quantity,
      imageUrl: event.imageUrl,
      includedItems: event.includedItems,
      cancellationPolicy: event.cancellationPolicy,
    });
    setIncludedItemDraft('');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black">Meus Eventos & Festas</h2>
          <p className="mt-1 text-sm text-gray-400">Crie eventos, setores, lotes de ingressos e controle disponibilidade.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-black text-brand-lilac">{events.length} eventos</span>
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyEvent); setIncludedItemDraft(''); setIsModalOpen(true); }} className="inline-flex items-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-xs font-black text-white"><Plus size={15} /> Criar evento</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Cadastro de evento e festa</p>
                <h3 className="mt-1 text-xl font-black">{editingId ? 'Editar evento, setor e lote' : 'Criar novo evento ou festa'}</h3>
                <p className="mt-1 text-sm text-gray-400">Adicione capa, informações da experiência, itens inclusos, regras, lote e estoque.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300"><X size={16} /></button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="group relative flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/25 text-center sm:h-60">
                {form.imageUrl ? <img src={form.imageUrl} alt="Preview do evento" className="h-full w-full object-cover" /> : (
                  <div className="p-6"><ImagePlus size={34} className="mx-auto text-brand-lilac" /><p className="mt-3 text-sm font-black">Capa do evento</p><p className="mt-1 text-xs text-gray-500">Imagem da festa no app</p></div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Nome do evento
                  <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ex: Floripa Sunset Sessions" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Descrição do evento/festa
                  <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Descreva atrações, ambiente, regras de entrada e diferenciais do evento." className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Data do evento
                  <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet [color-scheme:dark]" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Setor
                  <input value={form.sector} onChange={(event) => setForm((current) => ({ ...current, sector: event.target.value }))} placeholder="Pista, VIP, Camarote" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Nome do lote
                  <input value={form.tierName} onChange={(event) => setForm((current) => ({ ...current, tierName: event.target.value }))} placeholder="1º lote, VIP, promocional" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400">Preço do ingresso
                  <input type="number" value={form.tierPrice} onChange={(event) => setForm((current) => ({ ...current, tierPrice: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Quantidade disponível
                  <input type="number" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
                </label>
                <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-emerald-300" />
                    <div>
                      <h4 className="text-sm font-black text-white">Itens inclusos</h4>
                      <p className="mt-0.5 text-xs font-normal text-gray-500">Informe tudo o que o ingresso oferece ao cliente.</p>
                    </div>
                  </div>
                  <label htmlFor="included-item" className="mt-4 block text-xs font-bold text-gray-400">Novo item incluso</label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="included-item"
                      title="Novo item incluso"
                      value={includedItemDraft}
                      onChange={(event) => setIncludedItemDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addIncludedItem();
                        }
                      }}
                      placeholder="Ex: Open bar de água e refrigerante"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-violet"
                    />
                    <button type="button" onClick={addIncludedItem} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-violet text-white" aria-label="Adicionar item incluso">
                      <Plus size={17} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.includedItems.map((item) => (
                      <span key={item} className="inline-flex max-w-full items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200">
                        <span className="truncate">{item}</span>
                        <button type="button" onClick={() => setForm((current) => ({ ...current, includedItems: current.includedItems.filter((includedItem) => includedItem !== item) }))} className="shrink-0 text-emerald-300 hover:text-white" aria-label={`Remover ${item}`}>
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                    {form.includedItems.length === 0 && <p className="text-xs text-gray-500">Nenhum item incluso adicionado.</p>}
                  </div>
                </section>
                <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">
                  <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-brand-lilac" /> Regras de cancelamento</span>
                  <textarea
                    title="Regras de cancelamento"
                    value={form.cancellationPolicy}
                    onChange={(event) => setForm((current) => ({ ...current, cancellationPolicy: event.target.value }))}
                    rows={4}
                    placeholder="Ex: Cancelamento gratuito até 7 dias antes. Depois desse prazo, permita apenas transferência de titularidade até 24h antes do evento."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet"
                  />
                </label>
              </div>
            </div>
            <button type="button" onClick={handleSubmit} className="mt-4 w-full rounded-2xl bg-brand-violet px-4 py-3 text-sm font-black text-white">{editingId ? 'Salvar alterações' : 'Criar evento'}</button>
          </section>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-xs text-gray-400">
            <tr>
              <th className="px-5 py-4">Evento</th>
              <th className="px-5 py-4">Data</th>
              <th className="px-5 py-4">Setor/Lote</th>
              <th className="px-5 py-4">Vendas</th>
              <th className="px-5 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-brand-violet/15 p-2 text-brand-lilac"><Ticket size={17} /></div>
                    {event.imageUrl && <img src={event.imageUrl} alt="" className="h-12 w-16 rounded-xl object-cover" />}
                    <div>
                      <span className="font-black">{event.name}</span>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">{event.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-300">{event.date}</td>
                <td className="px-5 py-4">
                  <p className="font-bold">{event.sector} • {event.tierName}</p>
                  <p className="text-xs text-brand-lilac">R$ {event.tierPrice}</p>
                </td>
                <td className="px-5 py-4">{event.sold}/{event.quantity}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => handleEdit(event)} className="rounded-xl border border-white/10 p-2 text-gray-300"><Edit2 size={15} /></button>
                    <button type="button" onClick={() => setEvents((current) => current.filter((item) => item.id !== event.id))} className="rounded-xl border border-red-500/20 p-2 text-red-300"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
