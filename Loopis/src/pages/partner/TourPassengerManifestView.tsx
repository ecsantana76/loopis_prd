import React, { useMemo, useState } from 'react';
import { CheckCircle, Download, Search, ShipWheel, UserCheck, Users, XCircle } from 'lucide-react';

type PassengerStatus = 'confirmado' | 'presente' | 'pendente' | 'cancelado';

interface Passenger {
  id: string;
  name: string;
  phone: string;
  document: string;
  seats: number;
  status: PassengerStatus;
  emergencyContact: string;
}

interface Departure {
  id: string;
  tourName: string;
  date: string;
  time: string;
  guide: string;
  vessel: string;
  capacity: number;
  passengers: Passenger[];
}

const departures: Departure[] = [
  {
    id: 'dep-1',
    tourName: 'Lancha Costa da Lagoa + Almoço',
    date: '2026-08-20',
    time: '09:00',
    guide: 'Caio Menezes',
    vessel: 'Lancha Loopis 28',
    capacity: 8,
    passengers: [
      { id: 'p1', name: 'Marina Costa', phone: '(48) 98888-1001', document: '123.456.789-10', seats: 2, status: 'confirmado', emergencyContact: '(48) 98888-0000' },
      { id: 'p2', name: 'Lucas Andrade', phone: '(48) 98888-1002', document: '234.567.891-01', seats: 1, status: 'presente', emergencyContact: '(48) 97777-0000' },
      { id: 'p3', name: 'Beatriz Ramos', phone: '(48) 98888-1003', document: '345.678.912-02', seats: 3, status: 'pendente', emergencyContact: '(48) 96666-0000' },
    ],
  },
  {
    id: 'dep-2',
    tourName: 'Sunset Baía Norte',
    date: '2026-08-20',
    time: '17:30',
    guide: 'Nina Duarte',
    vessel: 'Catamarã Sunset',
    capacity: 10,
    passengers: [
      { id: 'p4', name: 'Rafael Nunes', phone: '(48) 97777-2002', document: '456.789.123-03', seats: 2, status: 'confirmado', emergencyContact: '(48) 95555-0000' },
      { id: 'p5', name: 'Camila Rocha', phone: '(48) 97777-2003', document: '567.891.234-04', seats: 1, status: 'cancelado', emergencyContact: '(48) 94444-0000' },
    ],
  },
];

const statusClass: Record<PassengerStatus, string> = {
  confirmado: 'bg-brand-violet/15 text-brand-lilac',
  presente: 'bg-emerald-500/15 text-emerald-300',
  pendente: 'bg-yellow-500/15 text-yellow-300',
  cancelado: 'bg-red-500/15 text-red-300',
};

export const TourPassengerManifestView: React.FC = () => {
  const [selectedDepartureId, setSelectedDepartureId] = useState(departures[0].id);
  const [query, setQuery] = useState('');
  const [localStatuses, setLocalStatuses] = useState<Record<string, PassengerStatus>>({});

  const departure = departures.find((item) => item.id === selectedDepartureId) || departures[0];
  const passengers = useMemo(
    () => departure.passengers
      .map((passenger) => ({ ...passenger, status: localStatuses[passenger.id] || passenger.status }))
      .filter((passenger) => {
        const normalized = query.trim().toLowerCase();
        return !normalized || passenger.name.toLowerCase().includes(normalized) || passenger.phone.includes(normalized) || passenger.document.includes(normalized);
      }),
    [departure, localStatuses, query],
  );

  const occupiedSeats = passengers.reduce((total, passenger) => passenger.status !== 'cancelado' ? total + passenger.seats : total, 0);
  const presentSeats = passengers.reduce((total, passenger) => passenger.status === 'presente' ? total + passenger.seats : total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black">Manifesto de Passageiros</h2>
          <p className="mt-1 text-sm text-gray-400">Controle presença, documentos, contatos de emergência e ocupação de cada saída.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select value={selectedDepartureId} onChange={(event) => setSelectedDepartureId(event.target.value)} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm font-bold text-white outline-none">
            {departures.map((item) => <option key={item.id} value={item.id}>{item.tourName} • {item.time}</option>)}
          </select>
          <button type="button" className="flex items-center justify-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-sm font-black text-white">
            <Download size={16} />
            Exportar lista
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: ShipWheel, label: 'Embarcação', value: departure.vessel },
          { icon: UserCheck, label: 'Guia responsável', value: departure.guide },
          { icon: Users, label: 'Ocupação', value: `${occupiedSeats}/${departure.capacity}` },
          { icon: CheckCircle, label: 'Presentes', value: `${presentSeats} lugares` },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <Icon size={21} className="text-brand-lilac" />
              <p className="mt-4 text-lg font-black">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.label}</p>
            </article>
          );
        })}
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black">{departure.tourName}</h3>
            <p className="mt-1 text-sm text-gray-500">{departure.date} às {departure.time}</p>
          </div>
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-gray-300">
            <Search size={16} className="text-brand-lilac" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar passageiro" className="bg-transparent text-white outline-none placeholder:text-gray-500" />
          </label>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th className="py-3">Passageiro</th>
                <th className="py-3">Documento</th>
                <th className="py-3">Contato emergência</th>
                <th className="py-3">Vagas</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {passengers.map((passenger) => (
                <tr key={passenger.id}>
                  <td className="py-4">
                    <p className="font-black">{passenger.name}</p>
                    <p className="text-xs text-gray-500">{passenger.phone}</p>
                  </td>
                  <td className="py-4 text-gray-300">{passenger.document}</td>
                  <td className="py-4 text-gray-300">{passenger.emergencyContact}</td>
                  <td className="py-4">{passenger.seats}</td>
                  <td className="py-4"><span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusClass[passenger.status]}`}>{passenger.status}</span></td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setLocalStatuses((current) => ({ ...current, [passenger.id]: 'presente' }))} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white">Presente</button>
                      <button type="button" onClick={() => setLocalStatuses((current) => ({ ...current, [passenger.id]: 'cancelado' }))} className="rounded-xl border border-red-500/20 px-3 py-2 text-xs font-black text-red-300"><XCircle size={13} className="inline" /> Cancelar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {passengers.length === 0 && <div className="py-10 text-center text-sm text-gray-500">Nenhum passageiro encontrado.</div>}
        </div>
      </section>
    </div>
  );
};
