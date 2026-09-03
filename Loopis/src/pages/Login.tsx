import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarClock, Compass, LockKeyhole, Mail, Phone, ShieldCheck, Ticket, Utensils, Waves } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Logo } from '../components/Logo';
import { PartnerType, type PartnerType as PartnerTypeValue } from '../types';

const partnerProfiles: Array<{
  type: PartnerTypeValue;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ReactNode;
  imageUrl: string;
}> = [
  {
    type: PartnerType.RESTAURANT,
    title: 'Restaurante / Bar',
    shortTitle: 'Restaurante',
    subtitle: 'Mesas, reservas e comandas.',
    icon: <Utensils size={17} />,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=900',
  },
  {
    type: PartnerType.TOUR,
    title: 'Tour / Aventura',
    shortTitle: 'Tour',
    subtitle: 'Saídas, passageiros e guias.',
    icon: <Waves size={17} />,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=900',
  },
  {
    type: PartnerType.EVENT,
    title: 'Evento / Festa',
    shortTitle: 'Evento',
    subtitle: 'Ingressos, portaria e promoters.',
    icon: <Ticket size={17} />,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=900',
  },
  {
    type: PartnerType.RENTAL,
    title: 'Locação / Quadras',
    shortTitle: 'Locação',
    subtitle: 'Ativos, horários e bloqueios.',
    icon: <CalendarClock size={17} />,
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=900',
  },
];

export const Login: React.FC = () => {
  const { login, setRole, setPartnerType } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerTypeValue>(PartnerType.RESTAURANT);
  const navigate = useNavigate();
  const selectedProfile = partnerProfiles.find((profile) => profile.type === selectedPartnerType) || partnerProfiles[0];

  const enterPartner = () => {
    setRole('restaurant');
    setPartnerType(selectedPartnerType);
    localStorage.setItem('loopis-mock-partner-type', selectedPartnerType);
    login();
    navigate('/admin/dashboard');
  };

  const handleSignup = () => {
    setRole('restaurant');
    setPartnerType(selectedPartnerType);
    localStorage.setItem('loopis-mock-partner-type', selectedPartnerType);
    login();
    navigate('/restaurante/onboarding');
  };

  const handleAdminLogin = () => {
    setRole('admin');
    login();
    navigate('/admin/dashboard-admin');
  };

  return (
    <div className="min-h-screen bg-[#111114] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img src={selectedProfile.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
          <div className="relative flex h-full flex-col justify-end p-12">
            <span className="mb-4 inline-flex w-max items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider backdrop-blur">
              <Compass size={15} />
              Hub de experiências em Florianópolis
            </span>
            <h1 className="max-w-xl text-6xl font-black leading-[0.96]">Entre ou cadastre seu negócio no Loopis.</h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75">
              Cada parceiro acessa um painel próprio para sua operação: restaurante, tour, evento ou locação.
            </p>
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-lg">
            <div className="mb-7 flex items-center justify-between">
              <Logo />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-lilac">Parceiros</span>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-6">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1.5">
                <button type="button" onClick={() => setMode('login')} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${mode === 'login' ? 'bg-brand-violet text-white' : 'text-gray-400 hover:text-white'}`}>Entrar</button>
                <button type="button" onClick={() => setMode('signup')} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${mode === 'signup' ? 'bg-brand-violet text-white' : 'text-gray-400 hover:text-white'}`}>Cadastrar</button>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-lilac">{mode === 'login' ? 'Acesso ao painel' : 'Novo parceiro'}</p>
                <h2 className="mt-2 text-3xl font-black">{mode === 'login' ? 'Bem-vindo de volta' : 'Cadastre sua operação'}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {mode === 'login' ? 'Selecione o tipo de parceiro e informe seus dados de acesso.' : 'Escolha sua vertical e preencha os dados iniciais para começar o onboarding.'}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {partnerProfiles.map((profile) => {
                  const isSelected = selectedPartnerType === profile.type;
                  return (
                    <button
                      key={profile.type}
                      type="button"
                      onClick={() => setSelectedPartnerType(profile.type)}
                      className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center transition ${
                        isSelected ? 'border-brand-violet bg-brand-violet/15 text-white' : 'border-white/10 bg-black/20 text-gray-400 hover:border-brand-violet/50 hover:text-white'
                      }`}
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${isSelected ? 'bg-brand-violet text-white' : 'bg-white/10'}`}>{profile.icon}</span>
                      <span className="text-[11px] font-black">{profile.shortTitle}</span>
                    </button>
                  );
                })}
              </div>

              {mode === 'login' ? (
                <div className="mt-6 space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-gray-400">E-mail</span>
                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-brand-violet">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <input defaultValue="parceiro@loopis.com" className="w-full bg-transparent text-sm text-white outline-none" />
                    </div>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-gray-400">Senha</span>
                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-brand-violet">
                      <LockKeyhole size={16} className="mr-2 text-gray-500" />
                      <input type="password" defaultValue="loopis" className="w-full bg-transparent text-sm text-white outline-none" />
                    </div>
                  </label>
                  <button type="button" onClick={enterPartner} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-brand-violet px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-violet/25 transition hover:bg-brand-violet/90">
                    Entrar como {selectedProfile.title}
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-gray-400">Nome do negócio</span>
                    <input placeholder="Ex: Sunset Sessions Floripa" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-brand-violet" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-gray-400">Responsável</span>
                    <input placeholder="Nome completo" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-brand-violet" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-gray-400">E-mail comercial</span>
                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-brand-violet">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <input placeholder="contato@empresa.com" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600" />
                    </div>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-gray-400">WhatsApp</span>
                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-brand-violet">
                      <Phone size={16} className="mr-2 text-gray-500" />
                      <input placeholder="(48) 99999-9999" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600" />
                    </div>
                  </label>
                  <button type="button" onClick={handleSignup} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-brand-violet px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-violet/25 transition hover:bg-brand-violet/90">
                    Começar cadastro como {selectedProfile.title}
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              <button type="button" onClick={handleAdminLogin} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black text-gray-300 transition hover:bg-white/10">
                <ShieldCheck size={16} />
                Entrar como Administrador Loopis
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
