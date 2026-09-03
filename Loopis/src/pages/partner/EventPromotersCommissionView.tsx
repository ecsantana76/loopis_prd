import React, { useMemo, useState } from 'react';
import { BadgePercent, Copy, Edit2, Plus, Search, Ticket, Trash2, Users, X } from 'lucide-react';

interface Promoter {
  id: string;
  name: string;
  description: string;
  phone: string;
  instagram: string;
  couponCode: string;
  couponDiscountPercent: number;
  commissionPercent: number;
  status: 'ativo' | 'pausado';
}

interface PromoterSale {
  id: string;
  promoterId: string;
  buyerName: string;
  eventName: string;
  ticketQty: number;
  grossAmount: number;
  soldAt: string;
}

const initialPromoters: Promoter[] = [
  { id: 'pro-1', name: 'Duda Floripa', description: 'Promoter focada em público universitário e listas de festas sunset no norte da ilha.', phone: '(48) 98888-4411', instagram: '@dudafloripa', couponCode: 'DUDA10', couponDiscountPercent: 10, commissionPercent: 12, status: 'ativo' },
  { id: 'pro-2', name: 'Leo Sunset', description: 'Divulgação para grupos premium, camarotes e aniversários em eventos de música eletrônica.', phone: '(48) 97777-3399', instagram: '@leosunset', couponCode: 'LEOSUN15', couponDiscountPercent: 15, commissionPercent: 15, status: 'ativo' },
  { id: 'pro-3', name: 'Nina Club', description: 'Parcerias com influenciadores locais e grupos de turistas hospedados em Jurerê.', phone: '(48) 96666-8822', instagram: '@ninaclub', couponCode: 'NINAVIP', couponDiscountPercent: 8, commissionPercent: 10, status: 'pausado' },
];

const initialSales: PromoterSale[] = [
  { id: 'sale-1', promoterId: 'pro-1', buyerName: 'Julia Martins', eventName: 'Floripa Sunset Sessions', ticketQty: 2, grossAmount: 160, soldAt: '2026-08-20 14:20' },
  { id: 'sale-2', promoterId: 'pro-1', buyerName: 'Pedro Lima', eventName: 'Floripa Sunset Sessions', ticketQty: 4, grossAmount: 320, soldAt: '2026-08-20 16:05' },
  { id: 'sale-3', promoterId: 'pro-2', buyerName: 'Rafael Nunes', eventName: 'Jazz & Wine Experience', ticketQty: 2, grossAmount: 520, soldAt: '2026-08-19 21:12' },
];

const emptyPromoter: Omit<Promoter, 'id'> = {
  name: '',
  description: '',
  phone: '',
  instagram: '',
  couponCode: '',
  couponDiscountPercent: 10,
  commissionPercent: 10,
  status: 'ativo',
};

const generateCoupon = (name: string) => {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 7)
    .toUpperCase();
  return `${base || 'PROMO'}${Math.floor(10 + Math.random() * 90)}`;
};

export const EventPromotersCommissionView: React.FC = () => {
  const [promoters, setPromoters] = useState<Promoter[]>(initialPromoters);
  const [sales] = useState<PromoterSale[]>(initialSales);
  const [form, setForm] = useState<Omit<Promoter, 'id'>>(emptyPromoter);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');

  const promoterStats = useMemo(() => promoters.map((promoter) => {
    const promoterSales = sales.filter((sale) => sale.promoterId === promoter.id);
    const gross = promoterSales.reduce((total, sale) => total + sale.grossAmount, 0);
    const commission = gross * (promoter.commissionPercent / 100);
    return { promoter, sales: promoterSales, gross, commission, tickets: promoterSales.reduce((total, sale) => total + sale.ticketQty, 0) };
  }), [promoters, sales]);

  const filteredStats = promoterStats.filter(({ promoter }) => {
    const normalized = query.trim().toLowerCase();
    return !normalized || promoter.name.toLowerCase().includes(normalized) || promoter.couponCode.toLowerCase().includes(normalized) || promoter.instagram.toLowerCase().includes(normalized);
  });

  const totals = promoterStats.reduce(
    (acc, item) => ({ gross: acc.gross + item.gross, commission: acc.commission + item.commission, tickets: acc.tickets + item.tickets }),
    { gross: 0, commission: 0, tickets: 0 },
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyPromoter);
    setIsModalOpen(true);
  };

  const openEdit = (promoter: Promoter) => {
    setEditingId(promoter.id);
    setForm({
      name: promoter.name,
      description: promoter.description,
      phone: promoter.phone,
      instagram: promoter.instagram,
      couponCode: promoter.couponCode,
      couponDiscountPercent: promoter.couponDiscountPercent,
      commissionPercent: promoter.commissionPercent,
      status: promoter.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const nextPromoter = {
      ...form,
      couponCode: form.couponCode.trim().toUpperCase() || generateCoupon(form.name),
      couponDiscountPercent: Math.max(0, Math.min(100, form.couponDiscountPercent)),
      commissionPercent: Math.max(0, Math.min(100, form.commissionPercent)),
    };

    if (editingId) {
      setPromoters((current) => current.map((promoter) => promoter.id === editingId ? { ...promoter, ...nextPromoter } : promoter));
    } else {
      setPromoters((current) => [{ ...nextPromoter, id: `pro-${Date.now()}` }, ...current]);
    }

    setEditingId(null);
    setForm(emptyPromoter);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black">Promoters & Comissões</h2>
          <p className="mt-1 text-sm text-gray-400">Crie promoters, gere cupons individuais e acompanhe vendas e comissões vinculadas a cada código.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-gray-300">
            <Search size={16} className="text-brand-lilac" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar promoter ou cupom" className="bg-transparent text-white outline-none placeholder:text-gray-500" />
          </label>
          <button type="button" onClick={openCreate} className="flex items-center justify-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-sm font-black text-white">
            <Plus size={16} />
            Novo promoter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: Users, label: 'Promoters ativos', value: promoters.filter((promoter) => promoter.status === 'ativo').length },
          { icon: Ticket, label: 'Ingressos vendidos', value: totals.tickets },
          { icon: BadgePercent, label: 'Comissões a pagar', value: `R$ ${totals.commission.toFixed(2).replace('.', ',')}` },
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {filteredStats.map(({ promoter, gross, commission, tickets }) => (
          <article key={promoter.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${promoter.status === 'ativo' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300'}`}>{promoter.status}</span>
                <h3 className="mt-3 text-lg font-black">{promoter.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{promoter.instagram} • {promoter.phone}</p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{promoter.description}</p>
              </div>
              <button type="button" onClick={() => openEdit(promoter)} className="rounded-xl border border-white/10 p-2 text-gray-300"><Edit2 size={15} /></button>
            </div>

            <div className="mt-4 rounded-2xl border border-brand-violet/25 bg-brand-violet/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-brand-lilac">Cupom individual</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <strong className="font-mono text-xl">{promoter.couponCode}</strong>
                <button type="button" className="rounded-xl bg-white/10 p-2 text-gray-200" title="Copiar cupom"><Copy size={15} /></button>
              </div>
              <p className="mt-2 text-xs text-gray-400">O cliente recebe {promoter.couponDiscountPercent}% de desconto e a venda fica vinculada ao promoter.</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Desconto cliente</p>
                <p className="mt-1 text-sm font-black">{promoter.couponDiscountPercent}%</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Comissão promoter</p>
                <p className="mt-1 text-sm font-black">{promoter.commissionPercent}%</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">Vendas</p>
                <p className="mt-1 text-sm font-black">R$ {gross.toFixed(0)}</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] text-gray-500">A pagar</p>
                <p className="mt-1 text-sm font-black text-emerald-300">R$ {commission.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">{tickets} ingressos vinculados</p>
            <button type="button" onClick={() => setPromoters((current) => current.filter((item) => item.id !== promoter.id))} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 py-2 text-xs font-black text-red-300">
              <Trash2 size={14} />
              Excluir promoter
            </button>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-lg font-black">Vendas vinculadas por cupom</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th className="py-3">Comprador</th>
                <th className="py-3">Evento</th>
                <th className="py-3">Promoter / Cupom</th>
                <th className="py-3">Ingressos</th>
                <th className="py-3">Valor</th>
                <th className="py-3">Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sales.map((sale) => {
                const promoter = promoters.find((item) => item.id === sale.promoterId);
                const commissionPercent = promoter?.commissionPercent || 0;
                return (
                  <tr key={sale.id}>
                    <td className="py-4 font-black">{sale.buyerName}<p className="text-xs font-normal text-gray-500">{sale.soldAt}</p></td>
                    <td className="py-4 text-gray-300">{sale.eventName}</td>
                    <td className="py-4"><p className="font-bold">{promoter?.name || 'Promoter removido'}</p><p className="font-mono text-xs text-brand-lilac">{promoter?.couponCode || '-'}</p><p className="mt-1 text-xs text-gray-500">{promoter?.couponDiscountPercent || 0}% de desconto ao cliente</p></td>
                    <td className="py-4">{sale.ticketQty}</td>
                    <td className="py-4">R$ {sale.grossAmount.toFixed(2).replace('.', ',')}</td>
                    <td className="py-4 text-emerald-300">R$ {(sale.grossAmount * commissionPercent / 100).toFixed(2).replace('.', ',')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Cadastro de promoter</p>
                <h3 className="mt-1 text-xl font-black">{editingId ? 'Editar promoter e comissão' : 'Criar promoter com cupom'}</h3>
                <p className="mt-1 text-sm text-gray-400">Defina o desconto do cliente, a comissão do promoter e o cupom usado para vincular cada venda.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300"><X size={16} /></button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Nome do promoter
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, couponCode: current.couponCode || generateCoupon(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Descrição do promoter/grupo
                <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Descreva público, canal de divulgação, grupo atendido e regras comerciais combinadas." className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">Telefone / WhatsApp
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">Instagram
                <input value={form.instagram} onChange={(event) => setForm((current) => ({ ...current, instagram: event.target.value }))} placeholder="@usuario" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Código de cupom
                <input value={form.couponCode} onChange={(event) => setForm((current) => ({ ...current, couponCode: event.target.value.toUpperCase() }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">Desconto que o cliente recebe
                <div className="relative">
                  <input type="number" min={0} max={100} value={form.couponDiscountPercent} onChange={(event) => setForm((current) => ({ ...current, couponDiscountPercent: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 pr-10 text-sm text-white outline-none focus:border-brand-violet" />
                  <span className="absolute right-4 top-3 text-sm font-black text-brand-lilac">%</span>
                </div>
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">Percentual de comissão que recebe
                <div className="relative">
                  <input type="number" min={0} max={100} value={form.commissionPercent} onChange={(event) => setForm((current) => ({ ...current, commissionPercent: Number(event.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 pr-10 text-sm text-white outline-none focus:border-brand-violet" />
                  <span className="absolute right-4 top-3 text-sm font-black text-brand-lilac">%</span>
                </div>
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">Status
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as Promoter['status'] }))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet">
                  <option value="ativo">Ativo</option>
                  <option value="pausado">Pausado</option>
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-3xl border border-brand-violet/25 bg-brand-violet/10 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Prévia da regra</p>
              <p className="mt-2 text-sm text-gray-200">
                Cupom <strong className="font-mono text-white">{form.couponCode || 'GERADO-AO-SALVAR'}</strong> concede <strong>{form.couponDiscountPercent}% de desconto ao cliente</strong> e vincula a venda a <strong>{form.name || 'este promoter'}</strong>, que recebe <strong>{form.commissionPercent}% de comissão</strong>.
              </p>
            </div>

            <button type="button" onClick={handleSubmit} className="mt-4 w-full rounded-2xl bg-brand-violet px-4 py-3 text-sm font-black text-white">
              {editingId ? 'Salvar promoter' : 'Criar promoter'}
            </button>
          </section>
        </div>
      )}
    </div>
  );
};
