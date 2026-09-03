import React, { useState } from 'react';
import { Phone, MapPin, Mail, ChevronRight, ShieldCheck, History, User as UserIcon, CreditCard, LogIn, Users, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FriendsModal } from '../components/profile/FriendsModal';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal, restaurants, logout, friends, friendInvites } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);

  const pendingInvitesCount = friendInvites.filter((inv) => inv.status === 'pending').length;

  const [userData, setUserData] = useState({
    nome: 'João da Silva',
    email: 'joao.silva@email.com',
    telefone: '(48) 99999-8888',
    cidade: 'Florianópolis - SC',
    cpf: '123.456.789-00',
    statusCadastro: 'completo',
  });

  const history = restaurants.slice(0, 3); // Exibe os últimos restaurantes visitados

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center">
          <UserIcon size={32} />
        </div>
        <h2 className="text-xl font-bold text-brand-graphite dark:text-white">Você não está conectado</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
          Faça login ou cadastre-se para gerenciar seus dados, histórico e benefícios Loopis.
        </p>
        <button
          type="button"
          onClick={openLoginModal}
          className="bg-gradient-loopis text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer"
        >
          <LogIn size={18} />
          <span>Entrar / Cadastrar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-graphite dark:text-brand-off-white">
          Meu Perfil
        </h1>
        <button onClick={() => navigate('/regulamento')} className="text-sm font-bold text-brand-violet hover:underline">
          Ver Regulamento
        </button>
      </div>

      <div className="glassmorphism p-6 rounded-3xl mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-loopis rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(userData.nome?.charAt(0) || 'U').toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-graphite dark:text-white">{userData.nome}</h2>
              <div className="flex items-center mt-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  <ShieldCheck size={12} />
                  <span>Perfil Completo</span>
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-sm font-bold text-brand-violet hover:bg-brand-violet/10 px-4 py-2 rounded-xl transition-colors bg-white/50 dark:bg-white/5 border border-brand-violet/20"
          >
            {isEditing ? 'Salvar' : 'Editar Dados'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <UserIcon size={18} className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              name="nome"
              value={userData.nome}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full bg-transparent border-b border-transparent focus:border-brand-violet outline-none disabled:opacity-80 transition-colors font-medium dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <Mail size={18} className="text-gray-400 shrink-0" />
            <input 
              type="email" 
              name="email"
              value={userData.email}
              onChange={handleInputChange} 
              disabled={!isEditing}
              className="w-full bg-transparent border-b border-transparent focus:border-brand-violet outline-none disabled:opacity-80 transition-colors dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <Phone size={18} className="text-gray-400 shrink-0" />
            <input 
              type="tel" 
              name="telefone"
              value={userData.telefone}
              onChange={handleInputChange} 
              disabled={!isEditing}
              className="w-full bg-transparent border-b border-transparent focus:border-brand-violet outline-none disabled:opacity-80 transition-colors dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <CreditCard size={18} className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              name="cpf"
              value={userData.cpf}
              onChange={handleInputChange} 
              disabled={!isEditing}
              className="w-full bg-transparent border-b border-transparent focus:border-brand-violet outline-none disabled:opacity-80 transition-colors dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <MapPin size={18} className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              name="cidade"
              value={userData.cidade}
              onChange={handleInputChange} 
              disabled={!isEditing}
              className="w-full bg-transparent border-b border-transparent focus:border-brand-violet outline-none disabled:opacity-80 transition-colors dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* SEÇÃO DE AMIGOS E DIVISÃO DE CONTA */}
      <div className="glassmorphism p-6 rounded-3xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-loopis text-white flex items-center justify-center shadow-md">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-graphite dark:text-white flex items-center gap-2">
                <span>Amigos & Divisão de Conta</span>
                {pendingInvitesCount > 0 && (
                  <span className="bg-brand-coral text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                    {pendingInvitesCount} pendente{pendingInvitesCount > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500">
                {friends.length} amigo{friends.length !== 1 ? 's' : ''} conectado{friends.length !== 1 ? 's' : ''} para dividir mesas e comandas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFriendsModalOpen(true)}
            className="bg-brand-violet/10 text-brand-violet hover:bg-brand-violet hover:text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-brand-violet/20"
          >
            <UserPlus size={14} />
            <span>Gerenciar</span>
          </button>
        </div>

        {/* Lista resumida de amigos */}
        {friends.length === 0 ? (
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 text-center">
            <p className="text-xs text-gray-500">Nenhum amigo conectado ainda.</p>
            <button
              type="button"
              onClick={() => setIsFriendsModalOpen(true)}
              className="mt-2 text-xs font-bold text-brand-violet hover:underline cursor-pointer"
            >
              Adicionar amigos para dividir conta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {friends.slice(0, 4).map((friend) => (
              <div
                key={friend.id}
                onClick={() => setIsFriendsModalOpen(true)}
                className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex items-center space-x-3 cursor-pointer hover:border-brand-violet/40 transition-colors"
              >
                <img
                  src={friend.avatarUrl}
                  alt={friend.name}
                  className="w-9 h-9 rounded-full object-cover border border-brand-violet/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-brand-graphite dark:text-white truncate">
                    {friend.name}
                  </p>
                  <p className="text-[10px] text-brand-violet font-semibold truncate">
                    {friend.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-brand-graphite dark:text-white mb-4 flex items-center space-x-2">
          <History size={20} className="text-brand-violet" />
          <span>Histórico de Parceiros Acessados</span>
        </h3>
        
        <div className="space-y-3">
          {history.map((rest: any) => (
            <div 
              key={rest.id} 
              onClick={() => navigate(`/restaurante/${rest.id}`)} 
              className="bg-white dark:bg-[#1a1a1c] p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center space-x-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              <img src={rest.imageUrl} alt={rest.nome} className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-brand-graphite dark:text-white truncate">{rest.nome}</h4>
                <p className="text-xs text-gray-500 truncate">{rest.location} • {rest.categoria}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <button 
        type="button"
        onClick={handleLogout}
        className="w-full py-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors border border-red-200 dark:border-red-500/20 cursor-pointer"
      >
        Sair da Conta
      </button>

      {/* Modal de Amigos */}
      <FriendsModal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
      />
    </div>
  );
};
