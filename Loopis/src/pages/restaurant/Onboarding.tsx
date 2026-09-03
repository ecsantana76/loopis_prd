import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Compass, 
  Ticket, 
  Music, 
  Store, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  Info, 
  Plus, 
  Trash2, 
  Upload, 
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { PartnerType, MenuItem } from '../../types';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [partnerType, setPartnerType] = useState<PartnerType>('restaurante');
  const navigate = useNavigate();
  const { setPartnerType: setStorePartnerType, addMenuItem } = useStore();

  // Dados Gerais
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Gastronomia');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [businessHours, setBusinessHours] = useState('11:30 às 23:30');

  // Cardápio (para Restaurante)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 'item-1',
      nome: 'Sequência de Camarão Especial',
      descricao: 'Servida ao alho e óleo, à milanesa, ao bafo com acompanhamentos especiais.',
      preco: 148.00,
      imagemUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400'
    }
  ]);

  // Form de novo item de cardápio
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  // Campos específicos de Experiência
  const [expIncluded, setExpIncluded] = useState('Menu degustação 5 tempos + Harmonização de vinhos artesanais');
  const [expDuration, setExpDuration] = useState('2h30');
  const [expPricePerPerson, setExpPricePerPerson] = useState('180.00');
  const [expCapacity, setExpCapacity] = useState('12');

  // Campos específicos de Tour
  const [tourMeetingPoint, setTourMeetingPoint] = useState('Trapiche Central de Santo Antônio de Lisboa');
  const [tourItinerary, setTourItinerary] = useState('Fazendas Marinhas -> Ilha de Ratones -> Almoço Histórico');
  const [tourDuration, setTourDuration] = useState('4 horas');
  const [tourPrice, setTourPrice] = useState('220.00');

  // Campos específicos de Evento
  const [eventDate, setEventDate] = useState('2026-08-28');
  const [eventTime, setEventTime] = useState('18:00 às 02:00');
  const [eventVenue, setEventVenue] = useState('Espaço Lounge Beira-Mar');
  const [eventTicketPrice, setEventTicketPrice] = useState('90.00');
  const [eventAttractions, setEventAttractions] = useState('Chef Convidado, DJ Sunset, Feira de Produtores Locais');

  // Campos específicos de Show
  const [showArtist, setShowArtist] = useState('Quinteto de Jazz & Bossa Nova');
  const [showDate, setShowDate] = useState('2026-08-29');
  const [showTime, setShowTime] = useState('20:30');
  const [showCouvertPrice, setShowCouvertPrice] = useState('35.00');

  const partnerTypesConfig = [
    {
      id: 'restaurante' as PartnerType,
      title: 'Restaurante / Gastronomia',
      desc: 'Restaurantes, bares, bistrôs, cafeterias com cardápio e fotos dos pratos.',
      icon: <UtensilsCrossed size={28} className="text-brand-violet" />,
      badge: 'Cardápio & Fotos'
    },
    {
      id: 'tour' as PartnerType,
      title: 'Tour & Roteiro',
      desc: 'Passeios náuticos, rotas cervejeiras, tours históricos e gastronômicos.',
      icon: <Compass size={28} className="text-blue-500" />,
      badge: 'Itinerário & Guia'
    },
    {
      id: 'evento' as PartnerType,
      title: 'Evento & Festival',
      desc: 'Festivais gastronômicos, feiras de vinhos, encontros temáticos.',
      icon: <Ticket size={28} className="text-emerald-500" />,
      badge: 'Ingressos & Lotes'
    },
    {
      id: 'rental' as PartnerType,
      title: 'Locação',
      desc: 'Quadras, jet-skis, equipamentos e estruturas reserváveis por horário.',
      icon: <Store size={28} className="text-pink-500" />,
      badge: 'Agenda & Caução'
    }
  ];

  const handleNext = () => {
    if (step === 1) {
      setStorePartnerType(partnerType);
    }
    setStep(s => Math.min(s + 1, 3));
  };
  
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleFinish = () => {
    // Salvar itens no cardápio global se for restaurante
    if (partnerType === 'restaurante') {
      menuItems.forEach(item => addMenuItem(item));
    }
    navigate('/restaurante/dashboard');
  };

  const copyAutocadastroLink = () => {
    navigator.clipboard.writeText('https://loopis.com.br/autocadastro/parceiro-indica');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemImage) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      nome: newItemName,
      descricao: newItemDesc,
      preco: parseFloat(newItemPrice),
      imagemUrl: newItemImage
    };

    setMenuItems([...menuItems, newItem]);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemImage('');
  };

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-4">
      {/* Banner de Isenção Comercial */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-4 sm:p-5 mb-8 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2.5 rounded-2xl">
            <Info size={24} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">Regra Comercial</span>
            <h3 className="font-bold text-sm sm:text-base">Sem taxa de setup para os 100 primeiros parceiros!</h3>
            <p className="text-xs opacity-90">Cadastre seu estabelecimento hoje sem nenhum custo de adesão inicial.</p>
          </div>
        </div>
        <button 
          onClick={copyAutocadastroLink}
          className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          {copiedLink ? <Check size={16} /> : <Copy size={16} />}
          <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link de Autocadastro'}</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-graphite dark:text-white mb-2">
          Bem-vindo ao Portal de Parceiros Loopis
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Configure seu perfil, cardápio, fotos e horários para ativar sua presença no app para milhares de clientes.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {[
            { num: 1, label: 'Tipo de Parceiro' },
            { num: 2, label: 'Dados & Conteúdo' },
            { num: 3, label: 'Ativação' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center space-x-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step >= s.num ? 'bg-gradient-loopis text-white shadow-md' : 'bg-gray-200 dark:bg-white/10 text-gray-400'
                }`}>
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${step >= s.num ? 'text-brand-graphite dark:text-white' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`h-1 w-8 sm:w-12 rounded-full ${step > s.num ? 'bg-brand-violet' : 'bg-gray-200 dark:bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="glassmorphism p-6 sm:p-10 rounded-3xl shadow-xl max-w-3xl mx-auto overflow-hidden relative border border-gray-100 dark:border-white/10">
        <AnimatePresence mode="wait">
          {/* ETAPA 1: SELEÇÃO DO TIPO DE PARCEIRO */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left mb-6">
                <h2 className="text-xl font-bold text-brand-graphite dark:text-white">
                  Qual é o tipo do seu estabelecimento ou serviço?
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Selecione a categoria principal para personalizarmos os campos de cadastro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {partnerTypesConfig.map((item) => {
                  const isSelected = partnerType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPartnerType(item.id)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-brand-violet bg-brand-violet/5 dark:bg-brand-violet/10 shadow-lg scale-[1.01]' 
                          : 'border-gray-200 dark:border-white/10 hover:border-brand-violet/40 bg-white/40 dark:bg-black/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 rounded-2xl bg-white dark:bg-black/40 shadow-sm border border-gray-100 dark:border-white/5">
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-violet/10 text-brand-violet">
                          {item.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-graphite dark:text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-brand-violet rounded-full flex items-center justify-center text-white">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ETAPA 2: FORMULÁRIO DINÂMICO ESPECÍFICO */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-8"
            >
              {/* Cabeçalho do Tipo Selecionado */}
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-brand-violet/10 border border-brand-violet/20">
                <Store className="text-brand-violet shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-sm text-brand-deep-purple dark:text-brand-lilac">
                    Cadastro: {partnerTypesConfig.find(p => p.id === partnerType)?.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Preencha as informações básicas e os detalhes de produtos/serviços.
                  </p>
                </div>
              </div>

              {/* Informações Gerais */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">1. Dados Principais</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome do Estabelecimento / Experiência</label>
                    <input 
                      type="text" 
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ex: Ostraria do Córrego" 
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-violet dark:text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Especialidade / Categoria</label>
                    <input 
                      type="text" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ex: Frutos do Mar & Ostras" 
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-violet dark:text-white text-xs font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Endereço Completo / Localização</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rod. Gilson da Costa Xavier, 1000 - Santo Antônio de Lisboa, Florianópolis/SC" 
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-violet dark:text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">WhatsApp / Telefone de Atendimento</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(48) 99999-9999" 
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-violet dark:text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Horário de Funcionamento</label>
                    <input 
                      type="text" 
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      placeholder="Ter a Dom - 18h às 23h" 
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-brand-violet dark:text-white text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SE FOR RESTAURANTE: CADASTRO DE CARDÁPIO (FOTO + NOME + DESCRIÇÃO + PREÇO) */}
              {partnerType === 'restaurante' && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                        <UtensilsCrossed size={16} className="text-brand-violet" />
                        <span>2. Cadastro de Cardápio (Pratos e Bebidas)</span>
                      </h4>
                      <p className="text-xs text-gray-500">Envie foto, nome, descrição e preço de cada item.</p>
                    </div>
                  </div>

                  {/* Form de adicionar item */}
                  <div className="bg-white/60 dark:bg-black/30 p-5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-4">
                    <h5 className="text-xs font-bold text-brand-graphite dark:text-white flex items-center space-x-1.5">
                      <Plus size={14} className="text-brand-violet" />
                      <span>Adicionar Prato / Item ao Cardápio</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome do Prato</label>
                        <input 
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Ex: Ostras Gratinadas com Queijo da Canastra"
                          className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs focus:ring-2 focus:ring-brand-violet outline-none dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preço (R$)</label>
                        <input 
                          type="number"
                          step="0.01"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          placeholder="62.00"
                          className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs focus:ring-2 focus:ring-brand-violet outline-none dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                      <input 
                        type="text"
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="Ex: Dúzia de ostras frescas gratinadas no forno a lenha com blend de queijos e ervas."
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs focus:ring-2 focus:ring-brand-violet outline-none dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Foto do Prato</label>
                      {newItemImage ? (
                        <div className="relative rounded-xl overflow-hidden h-28 border border-gray-200 dark:border-white/10 w-full max-w-xs">
                          <img src={newItemImage} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setNewItemImage('')}
                            className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-brand-violet rounded-xl cursor-pointer bg-white/50 dark:bg-white/5 transition-all">
                          <Upload size={18} className="text-gray-400 mr-2" />
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Upload da foto do prato</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMenuItem}
                      disabled={!newItemName || !newItemPrice || !newItemImage}
                      className="px-4 py-2 bg-brand-violet hover:bg-brand-violet/90 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} />
                      <span>Inserir Prato no Cardápio</span>
                    </button>
                  </div>

                  {/* Listagem dos itens adicionados */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500">Pratos Adicionados ({menuItems.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {menuItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 rounded-xl bg-white dark:bg-black/30 border border-gray-200/80 dark:border-white/10 shadow-sm relative">
                          <img src={item.imagemUrl} alt={item.nome} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0 pr-6">
                            <h5 className="text-xs font-bold text-brand-graphite dark:text-white truncate">{item.nome}</h5>
                            <span className="text-xs font-bold text-brand-violet">R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                            {item.descricao && <p className="text-[10px] text-gray-500 line-clamp-1">{item.descricao}</p>}
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveMenuItem(item.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SE FOR TOUR: CAMPOS COMPLEMENTARES DE EXPERIÊNCIA */}
              {partnerType === 'tour' && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>2. Detalhes da Experiência</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">O que está incluso na experiência</label>
                      <textarea 
                        rows={2}
                        value={expIncluded}
                        onChange={(e) => setExpIncluded(e.target.value)}
                        placeholder="Ex: Degustação guiada de 6 ostras harmonizadas com 3 espumantes catarinenses."
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Duração Estimada</label>
                      <input 
                        type="text"
                        value={expDuration}
                        onChange={(e) => setExpDuration(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preço por Pessoa (R$)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={expPricePerPerson}
                        onChange={(e) => setExpPricePerPerson(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white font-bold text-brand-violet"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Capacidade Máxima de Vagas</label>
                      <input 
                        type="number"
                        value={expCapacity}
                        onChange={(e) => setExpCapacity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SE FOR TOUR: CAMPOS DE TOUR */}
              {partnerType === 'tour' && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <Compass size={16} className="text-blue-500" />
                    <span>2. Configuração do Tour & Roteiro</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ponto de Encontro</label>
                      <input 
                        type="text"
                        value={tourMeetingPoint}
                        onChange={(e) => setTourMeetingPoint(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Roteiro / Paradas Principais</label>
                      <input 
                        type="text"
                        value={tourItinerary}
                        onChange={(e) => setTourItinerary(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Duração Total</label>
                      <input 
                        type="text"
                        value={tourDuration}
                        onChange={(e) => setTourDuration(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preço por Passageiro (R$)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={tourPrice}
                        onChange={(e) => setTourPrice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white font-bold text-brand-violet"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SE FOR EVENTO: CAMPOS DE EVENTO */}
              {partnerType === 'evento' && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <Ticket size={16} className="text-emerald-500" />
                    <span>2. Programação do Evento / Festival</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Data do Evento</label>
                      <input 
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Horário de Início / Fim</label>
                      <input 
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Local / Espaço</label>
                      <input 
                        type="text"
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preço do Ingresso Inicial (R$)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={eventTicketPrice}
                        onChange={(e) => setEventTicketPrice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white font-bold text-brand-violet"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Atrações e Destaques</label>
                      <input 
                        type="text"
                        value={eventAttractions}
                        onChange={(e) => setEventAttractions(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SE FOR LOCAÇÃO: CAMPOS DE LOCAÇÃO */}
              {partnerType === 'rental' && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <Music size={16} className="text-pink-500" />
                    <span>2. Dados do Show & Apresentação</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Artista / Banda Principal</label>
                      <input 
                        type="text"
                        value={showArtist}
                        onChange={(e) => setShowArtist(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Data do Show</label>
                      <input 
                        type="date"
                        value={showDate}
                        onChange={(e) => setShowDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Horário de Abertura / Show</label>
                      <input 
                        type="text"
                        value={showTime}
                        onChange={(e) => setShowTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Valor do Couvert / Entrada (R$)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={showCouvertPrice}
                        onChange={(e) => setShowCouvertPrice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-xs dark:text-white font-bold text-brand-violet"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ETAPA 3: SUCESSO E RESUMO */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 text-center py-6"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle size={44} className="text-emerald-500" />
              </div>
              
              <h2 className="text-2xl font-black text-brand-graphite dark:text-white mb-2">
                Perfil de Parceiro Criado com Sucesso!
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Seu cadastro de <strong>{partnerTypesConfig.find(p => p.id === partnerType)?.title}</strong> foi concluído e sincronizado com o ecossistema Loopis.
              </p>

              {/* Card de Resumo */}
              <div className="glassmorphism p-5 rounded-2xl max-w-md mx-auto text-left space-y-2 border border-gray-100 dark:border-white/10">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500">Estabelecimento:</span>
                  <span className="text-xs font-bold text-brand-graphite dark:text-white">{businessName || 'Ostraria do Córrego'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500">Tipo de Parceiro:</span>
                  <span className="text-xs font-bold text-brand-violet uppercase">{partnerType}</span>
                </div>
                {partnerType === 'restaurante' && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500">Itens no Cardápio:</span>
                    <span className="text-xs font-bold text-emerald-500">{menuItems.length} pratos cadastrados</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-gray-500">Taxa de Setup Inicial:</span>
                  <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">R$ 0,00 (Isento)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200 dark:border-white/10">
          {step > 1 ? (
            <button 
              onClick={handleBack} 
              className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> <span>Voltar</span>
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button 
              onClick={handleNext} 
              className="bg-gradient-loopis text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Avançar para {step === 1 ? 'Dados & Conteúdo' : 'Finalização'}</span> 
              <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleFinish} 
              className="bg-gradient-loopis text-white px-8 py-3.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Acessar Painel Principal do Parceiro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
