import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, QrCode, Search, ScanLine, Ticket, UserCheck, XCircle } from 'lucide-react';
import { usePartnerContext } from '../../hooks/usePartnerContext';
import { PartnerType } from '../../types';

type TicketStatus = 'valido' | 'validado' | 'cancelado' | 'duplicado';

interface GateTicket {
  id: string;
  code: string;
  holderName: string;
  document: string;
  eventName: string;
  sector: string;
  tier: string;
  status: TicketStatus;
  validatedAt?: string;
}

const initialTickets: GateTicket[] = [
  { id: 't1', code: 'LOOP-EVT-8241', holderName: 'Julia Martins', document: '123.456.789-10', eventName: 'Floripa Sunset Sessions', sector: 'Camarote', tier: 'VIP', status: 'valido' },
  { id: 't2', code: 'LOOP-EVT-8242', holderName: 'Rafael Nunes', document: '234.567.891-01', eventName: 'Floripa Sunset Sessions', sector: 'Pista', tier: '2º Lote', status: 'validado', validatedAt: '20:14' },
  { id: 't3', code: 'LOOP-EVT-8243', holderName: 'Camila Rocha', document: '345.678.912-02', eventName: 'Jazz & Wine Experience', sector: 'Pista', tier: 'Promocional', status: 'cancelado' },
  { id: 't4', code: 'LOOP-EVT-8244', holderName: 'Pedro Lima', document: '456.789.123-03', eventName: 'Floripa Sunset Sessions', sector: 'Pista', tier: '2º Lote', status: 'valido' },
];

const statusClass: Record<TicketStatus, string> = {
  valido: 'bg-brand-violet/15 text-brand-lilac',
  validado: 'bg-emerald-500/15 text-emerald-300',
  cancelado: 'bg-red-500/15 text-red-300',
  duplicado: 'bg-yellow-500/15 text-yellow-300',
};

export const EventGateValidatorView: React.FC = () => {
  const partner = usePartnerContext();
  const [tickets, setTickets] = useState<GateTicket[]>(initialTickets);
  const [manualCode, setManualCode] = useState('');
  const [query, setQuery] = useState('');
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'warning' | 'error'; title: string; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const filteredTickets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tickets.filter((ticket) => !normalized || ticket.holderName.toLowerCase().includes(normalized) || ticket.code.toLowerCase().includes(normalized) || ticket.document.includes(normalized));
  }, [query, tickets]);

  const validateTicket = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;

    const ticket = tickets.find((item) => item.code.toUpperCase() === normalizedCode);
    if (!ticket) {
      setScanResult({ type: 'error', title: 'Ingresso não encontrado', message: 'Confira o QR Code ou o código digitado e tente novamente.' });
      return;
    }

    if (ticket.status === 'cancelado') {
      setScanResult({ type: 'error', title: 'Ingresso cancelado', message: `${ticket.holderName} não possui entrada liberada para este ingresso.` });
      return;
    }

    if (ticket.status === 'validado') {
      setScanResult({ type: 'warning', title: 'Entrada já validada', message: `${ticket.holderName} já entrou às ${ticket.validatedAt || 'horário anterior'}.` });
      setTickets((current) => current.map((item) => item.id === ticket.id ? { ...item, status: 'duplicado' } : item));
      return;
    }

    const validatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTickets((current) => current.map((item) => item.id === ticket.id ? { ...item, status: 'validado', validatedAt } : item));
    setScanResult({ type: 'success', title: 'Entrada liberada', message: `${ticket.holderName} • ${ticket.sector} • ${ticket.tier}` });
    setManualCode('');
  };

  const simulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      const nextValidTicket = tickets.find((ticket) => ticket.status === 'valido') || tickets[0];
      validateTicket(nextValidTicket.code);
    }, 1100);
  };

  const validatedCount = tickets.filter((ticket) => ticket.status === 'validado' || ticket.status === 'duplicado').length;
  const validCount = tickets.filter((ticket) => ticket.status === 'valido').length;
  const blockedCount = tickets.filter((ticket) => ticket.status === 'cancelado' || ticket.status === 'duplicado').length;
  const copy = partner.partnerType === PartnerType.TOUR
    ? {
        title: 'Validador de Embarque',
        description: 'Valide vouchers de tours, confirme passageiros no manifesto e bloqueie duplicidades em tempo real.',
        listTitle: 'Lista de vouchers',
        codeLabel: 'Código manual do voucher',
        placeholder: 'LOOP-TOUR-8241',
        validLabel: 'Vouchers válidos',
      }
    : partner.partnerType === PartnerType.RENTAL
      ? {
          title: 'Validador de Retirada',
          description: 'Valide vouchers de locação, libere quadras/ativos e registre retirada ou uso no horário reservado.',
          listTitle: 'Lista de vouchers',
          codeLabel: 'Código manual do voucher',
          placeholder: 'LOOP-LOC-8241',
          validLabel: 'Vouchers válidos',
        }
      : {
          title: 'Validador de Portaria',
          description: 'Valide ingressos por QR Code ou código manual, bloqueie duplicados e acompanhe entradas em tempo real.',
          listTitle: 'Lista de ingressos',
          codeLabel: 'Código manual do ingresso',
          placeholder: 'LOOP-EVT-8241',
          validLabel: 'Ingressos válidos',
        };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black">{copy.title}</h2>
          <p className="mt-1 text-sm text-gray-400">{copy.description}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-black text-emerald-300">Portaria ativa</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: UserCheck, label: 'Entradas validadas', value: validatedCount },
          { icon: Ticket, label: copy.validLabel, value: validCount },
          { icon: AlertTriangle, label: 'Bloqueios/alertas', value: blockedCount },
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

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-lg font-black">Scanner Web</h3>
          <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-black/25 p-6 text-center">
            <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-3xl border border-brand-violet/40 bg-black/30">
              <QrCode size={92} className="text-brand-lilac" />
              {isScanning ? <ScanLine size={42} className="absolute animate-pulse text-white" /> : <ScanLine size={42} className="absolute text-white/70" />}
            </div>
            <button type="button" onClick={simulateScan} className="mt-5 w-full rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">
              {isScanning ? 'Lendo QR Code...' : 'Simular leitura do QR'}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-xs font-bold text-gray-400">{copy.codeLabel}</label>
            <div className="flex gap-2">
              <input value={manualCode} onChange={(event) => setManualCode(event.target.value)} placeholder={copy.placeholder} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              <button type="button" onClick={() => validateTicket(manualCode)} className="rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white">Validar</button>
            </div>
          </div>

          {scanResult && (
            <div className={`mt-4 rounded-3xl border p-4 ${scanResult.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : scanResult.type === 'warning' ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-200' : 'border-red-500/20 bg-red-500/10 text-red-200'}`}>
              <div className="flex items-center gap-2">
                {scanResult.type === 'success' && <CheckCircle size={18} />}
                {scanResult.type === 'warning' && <AlertTriangle size={18} />}
                {scanResult.type === 'error' && <XCircle size={18} />}
                <h4 className="text-sm font-black">{scanResult.title}</h4>
              </div>
              <p className="mt-2 text-sm opacity-90">{scanResult.message}</p>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-black">{copy.listTitle}</h3>
            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-gray-300">
              <Search size={16} className="text-brand-lilac" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nome, CPF ou código" className="bg-transparent text-white outline-none placeholder:text-gray-500" />
            </label>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="py-3">Voucher</th>
                  <th className="py-3">Titular</th>
                  <th className="py-3">Evento</th>
                  <th className="py-3">Setor/Lote</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Entrada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="py-4 font-mono text-xs text-brand-lilac">{ticket.code}</td>
                    <td className="py-4">
                      <p className="font-black">{ticket.holderName}</p>
                      <p className="text-xs text-gray-500">{ticket.document}</p>
                    </td>
                    <td className="py-4 text-gray-300">{ticket.eventName}</td>
                    <td className="py-4 text-gray-300">{ticket.sector} • {ticket.tier}</td>
                    <td className="py-4"><span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusClass[ticket.status]}`}>{ticket.status}</span></td>
                    <td className="py-4 text-gray-400">{ticket.validatedAt ? <span className="flex items-center gap-1"><Clock size={13} /> {ticket.validatedAt}</span> : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && <div className="py-10 text-center text-sm text-gray-500">Nenhum ingresso encontrado.</div>}
          </div>
        </section>
      </div>
    </div>
  );
};
