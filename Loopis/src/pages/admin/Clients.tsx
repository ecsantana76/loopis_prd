import React, { useState } from 'react';
import { Search, User, Filter, Edit2, Ban, ShieldAlert } from 'lucide-react';
import type { User as UserType } from '../../types';

export const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data for clients
  const mockClients: UserType[] = [
    { id: '1', nome: 'João Silva', email: 'joao@example.com', telefone: '48999999999', loopsSaldo: 450, statusCadastro: 'completo', cidade: 'Florianópolis', origemLogin: 'email', historicoAcessos: [] },
    { id: '2', nome: 'Maria Oliveira', email: 'maria@example.com', telefone: '48988888888', loopsSaldo: 120, statusCadastro: 'simplificado', cidade: 'São José', origemLogin: 'google', historicoAcessos: [] },
    { id: '3', nome: 'Carlos Souza', email: 'carlos@example.com', telefone: '48977777777', loopsSaldo: 0, statusCadastro: 'simplificado', cidade: 'Palhoça', origemLogin: 'apple', historicoAcessos: [] },
  ];

  const filteredClients = mockClients.filter(c => 
    (filterType === 'all' || c.statusCadastro === filterType) &&
    (c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Base de Clientes</h1>
          <p className="text-sm text-gray-400">Gestão de usuários da plataforma Loopis.</p>
        </div>
      </div>

      <div className="bg-brand-graphite rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 bg-white/5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 text-sm text-white px-9 py-2.5 rounded-xl border border-white/5 focus:border-brand-violet outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-black/20 text-sm text-white px-4 py-2.5 rounded-xl border border-white/5 focus:border-brand-violet outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="completo">Cadastro Completo</option>
              <option value="simplificado">Cadastro Simplificado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Contato</th>
                <th className="px-6 py-4 font-semibold">Saldo (Loops)</th>
                <th className="px-6 py-4 font-semibold">Status Cadastro</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map(c => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{c.nome}</p>
                        <p className="text-xs text-gray-500">{c.cidade || 'Não informada'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-300">{c.email}</p>
                    <p className="text-xs text-gray-500">{c.telefone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-brand-lilac">{c.loopsSaldo} L</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      c.statusCadastro === 'completo' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {c.statusCadastro}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors" title="Zerar Saldo">
                        <ShieldAlert size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Bloquear">
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhum cliente encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
