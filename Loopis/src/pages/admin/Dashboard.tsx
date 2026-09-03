import React from 'react';
import {
  Bell,
  CalendarClock,
  ChevronDown,
  CircleDollarSign,
  Compass,
  MapPin,
  Menu,
  MoreVertical,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Ticket,
  WalletCards,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const kpis = [
  {
    label: 'Parceiros Ativos',
    value: '186',
    trend: '+18% vs. mês passado',
    icon: Store,
    color: 'text-red-400',
    bg: 'bg-red-500/12',
  },
  {
    label: 'GMV da Rede',
    value: 'R$ 485K',
    trend: '+22% em Florianópolis',
    icon: CircleDollarSign,
    color: 'text-yellow-300',
    bg: 'bg-yellow-400/12',
  },
  {
    label: 'Pedidos e Reservas',
    value: '12.450',
    trend: '+31% no app turista',
    icon: WalletCards,
    color: 'text-lime-300',
    bg: 'bg-lime-400/12',
  },
];

const verticalMix = [
  { label: 'Restaurantes', value: 42, icon: Store, color: 'bg-red-500' },
  { label: 'Tours', value: 23, icon: Compass, color: 'bg-yellow-400' },
  { label: 'Eventos', value: 19, icon: Ticket, color: 'bg-lime-300' },
  { label: 'Locações', value: 16, icon: CalendarClock, color: 'bg-sky-400' },
];

const monthlyVolume = [
  { label: 'Jan', current: 58, target: 80 },
  { label: 'Fev', current: 74, target: 88 },
  { label: 'Mar', current: 66, target: 82 },
  { label: 'Abr', current: 92, target: 92 },
  { label: 'Mai', current: 112, target: 98 },
  { label: 'Jun', current: 144, target: 105 },
  { label: 'Jul', current: 128, target: 108 },
  { label: 'Ago', current: 168, target: 118 },
  { label: 'Set', current: 136, target: 122 },
  { label: 'Out', current: 154, target: 130 },
  { label: 'Nov', current: 181, target: 138 },
  { label: 'Dez', current: 196, target: 148 },
];

const linePoints = [
  '5,86 78',
  '16,72 62',
  '27,58 68',
  '38,48 42',
  '49,56 52',
  '60,30 31',
  '71,40 45',
  '82,24 28',
  '93,18 22',
];

const operationRows = [
  { id: '#1245', customer: 'Marina Costa', date: '2026-08-20', status: 'Reserva confirmada', value: 'R$ 320' },
  { id: '#1246', customer: 'João Pereira', date: '2026-08-20', status: 'Aguardando pagamento', value: 'R$ 680' },
  { id: '#1247', customer: 'Ana Schmidt', date: '2026-08-21', status: 'Check-in realizado', value: 'R$ 146' },
  { id: '#1248', customer: 'Pedro Lima', date: '2026-08-21', status: 'Ingresso emitido', value: 'R$ 240' },
];

const verticalStatus = [
  {
    title: 'Restaurantes',
    detail: 'Reservas e comandas',
    metric: '4.820 reservas/mês',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=240&q=80',
    status: 'Ativo',
  },
  {
    title: 'Tours e Aventuras',
    detail: 'Saídas em agenda',
    metric: '380 vagas disponíveis',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=240&q=80',
    status: 'Crescendo',
  },
  {
    title: 'Eventos',
    detail: 'Lotes e portaria',
    metric: '1.230 ingressos vendidos',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=240&q=80',
    status: 'Alta',
  },
];

const neighborhoods = [
  { name: 'Centro', share: 35 },
  { name: 'Lagoa', share: 26 },
  { name: 'Jurerê', share: 22 },
  { name: 'Campeche', share: 17 },
];

const approvalSegments = [
  { label: 'Aprovados', value: 68, color: 'bg-red-500' },
  { label: 'Pendentes', value: 22, color: 'bg-yellow-300' },
  { label: 'Revisão', value: 10, color: 'bg-lime-300' },
];

export const Dashboard: React.FC = () => {
  const { restaurants } = useStore();
  const partnerCount = Math.max(restaurants.length, 186);
  const maxVolume = Math.max(...monthlyVolume.map((item) => item.current));

  return (
    <div className="mx-auto max-w-[1480px] pb-24 text-white md:pb-0">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400">Welcome!</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Admin Loopis</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} />
            Praça operacional: Florianópolis - SC
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.06] px-4 text-gray-400 lg:w-[420px] lg:flex-none">
            <Search size={17} />
            <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500" placeholder="Buscar parceiro, pedido ou cliente" />
          </label>
          <button type="button" className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.06] text-gray-300 sm:flex">
            <Bell size={18} />
          </button>
          <button type="button" className="flex h-12 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.06] px-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-violet to-red-500" />
            <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
            <Menu size={16} className="text-gray-400 sm:hidden" />
          </button>
        </div>
      </header>

      <section className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_72px]">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-[28px] border border-white/8 bg-[#202023] p-5 shadow-2xl shadow-black/20">
              <div className="flex items-start gap-4">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                  <Icon size={21} />
                </span>
                <div>
                  <p className="text-xs font-black text-gray-300">{item.label}</p>
                  <h2 className="mt-3 text-2xl font-black">{item.value}</h2>
                  <span className="mt-2 inline-flex rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">{item.trend}</span>
                </div>
              </div>
            </article>
          );
        })}
        <button type="button" className="hidden rounded-[28px] border border-white/10 bg-black/20 text-3xl text-gray-300 transition hover:border-brand-violet hover:text-white xl:block">
          +
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.68fr_0.68fr]">
        <section className="rounded-[28px] border border-white/8 bg-[#202023] p-4 shadow-2xl shadow-black/20 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">Volume Atual</h2>
              <div className="mt-2 flex gap-4 text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-red-500" /> GMV</span>
                <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-gray-500" /> Meta</span>
              </div>
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-gray-300">
              Mensal
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {verticalMix.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color} text-black`}>
                    <Icon size={18} />
                  </span>
                  <p className="mt-3 text-[11px] text-gray-500">{item.label}</p>
                  <p className="mt-1 text-lg font-black">{item.value}%</p>
                </div>
              );
            })}
          </div>

          <div className="flex h-60 items-end gap-2 overflow-hidden border-t border-white/8 pt-6">
            {monthlyVolume.map((item) => (
              <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <div className="flex h-full w-full max-w-8 items-end justify-center gap-1">
                  <span className="w-3 rounded-t-lg bg-gray-500/70" style={{ height: `${(item.target / maxVolume) * 100}%` }} />
                  <span className="w-3 rounded-t-lg bg-red-500" style={{ height: `${(item.current / maxVolume) * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/8 bg-[#202023] p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black">Aprovações</h2>
            <MoreVertical size={18} className="text-gray-500" />
          </div>
          <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-[conic-gradient(#ef4444_0_68%,#fde047_68%_90%,#bef264_90%_100%)]">
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#202023] text-center">
              <p className="text-xs text-gray-500">Total em análise</p>
              <strong className="mt-2 text-3xl">2.000</strong>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {approvalSegments.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs font-bold text-gray-400">
                <span className="flex items-center gap-2"><i className={`h-2 w-2 rounded-full ${item.color}`} />{item.label}</span>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[28px] border border-white/8 bg-[#202023] p-4 shadow-2xl shadow-black/20">
            <h2 className="mb-4 text-lg font-black">Status por Vertical</h2>
            <div className="space-y-3">
              {verticalStatus.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                  <div className="flex gap-3">
                    <img src={item.image} alt="" className="h-16 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-black">{item.title}</p>
                        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-black text-emerald-300">{item.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                      <p className="mt-2 text-xs font-bold text-gray-300">{item.metric}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#202023] p-4 shadow-2xl shadow-black/20">
            <h2 className="mb-4 text-lg font-black">Top Parceiro</h2>
            <div className="flex gap-3">
              <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=220&q=80" alt="" className="h-24 w-28 rounded-2xl object-cover" />
              <div>
                <p className="font-black">Ostraria do Córrego</p>
                <p className="mt-1 text-xs text-gray-500">5.200 Loops gerados</p>
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-300">
                  <Sparkles size={12} />
                  Destaque
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.15fr]">
        <section className="rounded-[28px] border border-white/8 bg-[#202023] p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black">Custo de Aquisição</h2>
            <button type="button" className="rounded-2xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-gray-300">Mensal</button>
          </div>
          <div className="relative h-56 overflow-hidden rounded-2xl bg-black/20 p-4">
            <div className="absolute inset-4 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <svg viewBox="0 0 100 90" className="relative h-full w-full overflow-visible">
              <defs>
                <linearGradient id="adminLineFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={linePoints.join(' ')} fill="none" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <polygon points={`${linePoints.join(' ')} 93,88 5,88`} fill="url(#adminLineFill)" />
            </svg>
            <div className="absolute right-8 top-16 rounded-2xl bg-red-500 px-3 py-2 text-xs font-black text-white shadow-xl">CAC R$ 42,30</div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/8 bg-[#202023] p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black">Operações Recentes</h2>
            <div className="flex gap-2">
              <button type="button" className="rounded-2xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-gray-300">Filtrar</button>
              <button type="button" className="rounded-2xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-gray-300">Mensal</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border border-red-500/50 text-xs text-gray-400">
                  <th className="rounded-l-xl px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="rounded-r-xl px-4 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {operationRows.map((row) => (
                  <tr key={row.id} className="border-b border-white/6">
                    <td className="px-4 py-4 font-bold">{row.id}</td>
                    <td className="px-4 py-4 text-gray-300">{row.customer}</td>
                    <td className="px-4 py-4 text-gray-500">{row.date}</td>
                    <td className="px-4 py-4 text-emerald-300">{row.status}</td>
                    <td className="px-4 py-4 text-right font-black">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-[28px] border border-white/8 bg-[#202023] p-5 shadow-2xl shadow-black/20">
        <div className="mb-5 flex items-center gap-2">
          <ShieldCheck className="text-lime-300" size={20} />
          <h2 className="text-lg font-black">Penetração por Bairro</h2>
          <span className="ml-auto rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-gray-400">{partnerCount} parceiros mapeados</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {neighborhoods.map((item) => (
            <div key={item.name} className="rounded-2xl bg-black/20 p-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>{item.name}</span>
                <span>{item.share}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/8">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${item.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
