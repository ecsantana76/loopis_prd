import React, { useState } from 'react';
import { Building2, CalendarClock, CheckCircle, Clock, Compass, CreditCard, ImagePlus, Plus, Save, ShieldCheck, Ticket, Trash2, UtensilsCrossed, Wrench, X } from 'lucide-react';
import { PartnerType } from '../../types';
import type { MenuItem } from '../../types';
import { usePartnerContext } from '../../hooks/usePartnerContext';
import { useStore } from '../../store/useStore';

const defaultHours = [
  { day: 'Segunda', hours: 'Fechado' },
  { day: 'Terça', hours: '18:00 - 23:30' },
  { day: 'Quarta', hours: '18:00 - 23:30' },
  { day: 'Quinta', hours: '18:00 - 00:00' },
  { day: 'Sexta', hours: '18:00 - 01:00' },
  { day: 'Sábado', hours: '12:00 - 01:00' },
  { day: 'Domingo', hours: '12:00 - 22:00' },
];

export const PartnerAccountSettings: React.FC = () => {
  const partner = usePartnerContext();
  const { menuItems, addMenuItem, removeMenuItem } = useStore();
  const [saved, setSaved] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [tradeName, setTradeName] = useState(partner.partnerName);
  const [partnerDescription, setPartnerDescription] = useState(
    partner.partnerType === PartnerType.RESTAURANT
      ? 'Gastronomia local, atendimento acolhedor e experiências especiais para viver Florianópolis à mesa.'
      : partner.partnerType === PartnerType.TOUR
        ? 'Passeios e aventuras guiadas para descobrir Florianópolis com segurança, natureza e experiências memoráveis.'
        : partner.partnerType === PartnerType.EVENT
          ? 'Eventos, festas e encontros que conectam música, cultura e entretenimento em Florianópolis.'
          : 'Locação de espaços e equipamentos com reserva simples, horários flexíveis e estrutura completa.',
  );
  const [phone, setPhone] = useState('(48) 99999-0000');
  const [address, setAddress] = useState(`Rua das Experiências, 120 - ${partner.neighborhood}`);
  const [pixKey, setPixKey] = useState('financeiro@loopis.demo');
  const [serviceFee, setServiceFee] = useState(partner.partnerType === PartnerType.RESTAURANT ? '10' : '0');
  const [defaultCapacity, setDefaultCapacity] = useState(partner.partnerType === PartnerType.EVENT ? '450' : partner.partnerType === PartnerType.TOUR ? '12' : partner.partnerType === PartnerType.RENTAL ? '4' : '18');
  const [cancellationPolicy, setCancellationPolicy] = useState('Cancelamento gratuito até 24h antes da experiência.');
  const [commercialRule, setCommercialRule] = useState(partner.partnerType === PartnerType.EVENT ? 'Ingressos nominais com validação na portaria.' : partner.partnerType === PartnerType.TOUR ? 'Termo de responsabilidade obrigatório para todos os passageiros.' : partner.partnerType === PartnerType.RENTAL ? 'Caução obrigatória para equipamentos motorizados.' : 'Reserva garantida por tolerância de 15 minutos.');
  const [hours, setHours] = useState(defaultHours);
  const [newItem, setNewItem] = useState({ nome: '', descricao: '', preco: '', imagemUrl: '' });
  const [logoUrl, setLogoUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=700&q=80',
  ]);

  const isRestaurant = partner.partnerType === PartnerType.RESTAURANT;

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setNewItem((current) => ({ ...current, imagemUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryImages((current) => [reader.result as string, ...current]);
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  const handleAddMenuItem = () => {
    if (!newItem.nome.trim() || !newItem.preco || !newItem.imagemUrl) return;

    const item: MenuItem = {
      id: `menu-${Date.now()}`,
      nome: newItem.nome,
      descricao: newItem.descricao,
      preco: Number(newItem.preco),
      imagemUrl: newItem.imagemUrl,
    };

    addMenuItem(item);
    setNewItem({ nome: '', descricao: '', preco: '', imagemUrl: '' });
    setIsMenuModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black">Configurações da Conta</h2>
        <p className="mt-1 text-sm text-gray-400">Atualize dados comerciais, operação, repasse Pix e informações exibidas no app.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-sm font-black"><Building2 size={17} className="text-brand-lilac" /> Dados comerciais</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Nome fantasia
                <input value={tradeName} onChange={(event) => setTradeName(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Telefone / WhatsApp
                <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">
                Endereço
                <input value={address} onChange={(event) => setAddress(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">
                Descrição do parceiro
                <textarea
                  value={partnerDescription}
                  onChange={(event) => setPartnerDescription(event.target.value)}
                  rows={5}
                  placeholder="Conte a história do parceiro, seus diferenciais, ambiente, serviços e o tipo de experiência oferecida ao cliente."
                  className="w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm leading-relaxed text-white outline-none focus:border-brand-violet"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-sm font-black"><ImagePlus size={17} className="text-brand-lilac" /> Logo e galeria do parceiro</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div>
                <p className="mb-2 text-xs font-bold text-gray-400">Logo do parceiro</p>
                <label className="group flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/25 text-center">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo do parceiro" className="h-full w-full object-cover" />
                  ) : (
                    <div className="p-5">
                      <ImagePlus size={30} className="mx-auto text-brand-lilac" />
                      <p className="mt-3 text-sm font-black">Enviar logo</p>
                      <p className="mt-1 text-xs text-gray-500">PNG ou JPG</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {logoUrl && (
                  <button type="button" onClick={() => setLogoUrl('')} className="mt-2 w-full rounded-2xl border border-red-500/20 py-2 text-xs font-black text-red-300">
                    Remover logo
                  </button>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-gray-400">Galeria de imagens</p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-violet px-3 py-2 text-xs font-black text-white">
                    <Plus size={14} />
                    Adicionar imagens
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {galleryImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                      <img src={image} alt={`Imagem da galeria ${index + 1}`} className="h-28 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white opacity-100 transition hover:bg-red-600 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {galleryImages.length === 0 && (
                    <label className="flex h-28 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/25 text-xs font-black text-gray-400 md:col-span-3">
                      Enviar primeiras imagens da galeria
                      <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-sm font-black"><Clock size={17} className="text-brand-lilac" /> Horários de funcionamento</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hours.map((item, index) => (
                <label key={item.day} className="space-y-1 text-xs font-bold text-gray-400">
                  {item.day}
                  <input
                    value={item.hours}
                    onChange={(event) => setHours((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, hours: event.target.value } : row))}
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet"
                  />
                </label>
              ))}
            </div>
          </div>

          {isRestaurant && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-sm font-black"><UtensilsCrossed size={17} className="text-brand-lilac" /> Cardápio digital</h3>
                <button type="button" onClick={() => setIsMenuModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-violet px-4 py-2.5 text-xs font-black text-white">
                  <Plus size={15} /> Adicionar item
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {menuItems.map((item) => (
                  <article key={item.id} className="relative flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                    <img src={item.imagemUrl} alt={item.nome} className="h-20 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1 pr-8">
                      <h4 className="truncate text-sm font-black">{item.nome}</h4>
                      <p className="mt-1 text-xs font-black text-brand-lilac">R$ {item.preco.toFixed(2).replace('.', ',')}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.descricao}</p>
                    </div>
                    <button type="button" onClick={() => removeMenuItem(item.id)} className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-300">
                      <Trash2 size={15} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-sm font-black">
              {partner.partnerType === PartnerType.RESTAURANT && <UtensilsCrossed size={17} className="text-brand-lilac" />}
              {partner.partnerType === PartnerType.TOUR && <Compass size={17} className="text-brand-lilac" />}
              {partner.partnerType === PartnerType.EVENT && <Ticket size={17} className="text-brand-lilac" />}
              {partner.partnerType === PartnerType.RENTAL && <Wrench size={17} className="text-brand-lilac" />}
              Configurações da vertical
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-bold text-gray-400">
                {partner.partnerType === PartnerType.RESTAURANT && 'Quantidade padrão de mesas'}
                {partner.partnerType === PartnerType.TOUR && 'Lotação padrão por saída'}
                {partner.partnerType === PartnerType.EVENT && 'Capacidade total do espaço'}
                {partner.partnerType === PartnerType.RENTAL && 'Unidades/quadras disponíveis'}
                <input type="number" value={defaultCapacity} onChange={(event) => setDefaultCapacity(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">
                {partner.partnerType === PartnerType.RESTAURANT && 'Modelo de atendimento'}
                {partner.partnerType === PartnerType.TOUR && 'Ponto de embarque padrão'}
                {partner.partnerType === PartnerType.EVENT && 'Horário de abertura da portaria'}
                {partner.partnerType === PartnerType.RENTAL && 'Intervalo mínimo de aluguel'}
                <input value={commercialRule} onChange={(event) => setCommercialRule(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400 sm:col-span-2">
                Política de cancelamento e regras para o turista
                <textarea value={cancellationPolicy} onChange={(event) => setCancellationPolicy(event.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { icon: CalendarClock, title: partner.partnerType === PartnerType.EVENT ? 'Agenda de lotes' : 'Agenda pública', text: 'Disponibilidade sincronizada com o app.' },
                { icon: ShieldCheck, title: 'Regras comerciais', text: commercialRule },
                { icon: CreditCard, title: 'Repasse', text: `Pix ${pixKey || 'não informado'}` },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl bg-black/25 p-4">
                    <Icon size={18} className="text-brand-lilac" />
                    <p className="mt-3 text-sm font-black">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-sm font-black"><CreditCard size={17} className="text-brand-lilac" /> Repasses</h3>
            <div className="mt-4 space-y-3">
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Chave Pix de repasse
                <input value={pixKey} onChange={(event) => setPixKey(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
              <label className="space-y-1 text-xs font-bold text-gray-400">
                Taxa de serviço padrão (%)
                <input type="number" value={serviceFee} onChange={(event) => setServiceFee(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-violet/25 bg-brand-violet/10 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-brand-lilac">Preview no app</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/30 text-lg font-black">
                {logoUrl ? <img src={logoUrl} alt="Logo no preview" className="h-full w-full object-cover" /> : tradeName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-xl font-black">{tradeName}</h3>
                <p className="mt-1 text-sm text-gray-300">{partner.neighborhood}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-gray-300">
              {partnerDescription || 'Adicione uma descrição para apresentar o parceiro aos clientes no app.'}
            </p>
            {galleryImages[0] && <img src={galleryImages[0]} alt="Capa no preview" className="mt-4 h-32 w-full rounded-2xl object-cover" />}
            {galleryImages.length > 1 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {galleryImages.slice(1, 4).map((image, index) => (
                  <img key={`${image}-preview-${index}`} src={image} alt="" className="h-16 rounded-xl object-cover" />
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-gray-400">{phone}</p>
            <span className="mt-4 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">Perfil ativo</span>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">
            {saved ? <CheckCircle size={17} /> : <Save size={17} />}
            {saved ? 'Configurações salvas' : 'Salvar configurações'}
          </button>
        </aside>
      </form>

      {isMenuModalOpen && (
        <div className="partner-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <section className="partner-modal-panel w-full overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/10 bg-brand-graphite p-4 shadow-2xl sm:max-w-xl sm:rounded-3xl sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black">Adicionar item ao cardápio</h3>
              <button type="button" onClick={() => setIsMenuModalOpen(false)} className="rounded-xl bg-white/10 p-2 text-gray-300"><X size={16} /></button>
            </div>
            <div className="mt-4 space-y-3">
              <input value={newItem.nome} onChange={(event) => setNewItem((current) => ({ ...current, nome: event.target.value }))} placeholder="Nome do prato/item" className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              <input type="number" value={newItem.preco} onChange={(event) => setNewItem((current) => ({ ...current, preco: event.target.value }))} placeholder="Preço" className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              <textarea value={newItem.descricao} onChange={(event) => setNewItem((current) => ({ ...current, descricao: event.target.value }))} placeholder="Descrição" rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand-violet" />
              {newItem.imagemUrl ? (
                <img src={newItem.imagemUrl} alt="Preview" className="h-36 w-full rounded-2xl object-cover" />
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-black/25 px-4 py-8 text-sm font-black text-gray-300">
                  <ImagePlus size={18} />
                  Enviar foto
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
              <button type="button" onClick={handleAddMenuItem} className="w-full rounded-2xl bg-brand-violet py-3 text-sm font-black text-white">
                Adicionar ao cardápio
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
