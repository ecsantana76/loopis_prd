import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  ProfileRole, 
  PartnerType,
  Restaurante, 
  Transaction, 
  Reward, 
  Reservation, 
  ReservationStatus, 
  Campanha, 
  PartnerRequest, 
  SystemConfig, 
  TabelaPontuacao, 
  CupomFiscal,
  MenuItem,
  ComandaRecord,
  PartnerActivityRecord
} from '../types';

interface AppState {
  currentRole: ProfileRole;
  setRole: (role: ProfileRole) => void;
  restaurants: Restaurante[];
  
  // Client Module State
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: () => void;
  logout: () => void;
  
  loopsBalance: number;
  transactions: Transaction[];
  rewards: Reward[];
  activeReservation: Reservation | null;
  
  createReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => void;
  updateReservationStatus: (status: ReservationStatus) => void;
  redeemReward: (rewardId: string) => boolean;

  // B2B Restaurant / Partner Module State
  currentPartnerType: PartnerType;
  setPartnerType: (type: PartnerType) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: string) => void;
  
  b2bReservations: Reservation[];
  updateB2bReservationStatus: (id: string, status: ReservationStatus) => void;
  processBilling: (reservationId: string, amount: number) => void;
  customPromotions: Campanha[];
  addCustomPromotion: (promo: Omit<Campanha, 'id'>) => void;

  // Comandas & Partner Activity Logs
  comandas: ComandaRecord[];
  addComanda: (comanda: ComandaRecord) => void;
  updateComandaStatus: (id: string, status: ComandaRecord['status'], paymentMethod?: ComandaRecord['formaPagamento']) => void;
  
  partnerActivities: PartnerActivityRecord[];
  addPartnerActivity: (activity: PartnerActivityRecord) => void;

  // Admin Module State
  partnerRequests: PartnerRequest[];
  systemConfig: SystemConfig;
  tabelaPontuacao: TabelaPontuacao[];
  auditCuponsFiscais: CupomFiscal[];
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  approvePartnerRequest: (id: string) => void;
  rejectPartnerRequest: (id: string) => void;
}

const mockDefaultMenuItems: MenuItem[] = [
  {
    id: 'm1',
    nome: 'Sequência de Camarão Especial da Ilha',
    descricao: 'Camarão ao bafo, à milanesa, ao alho e óleo, camarão ao molho e iscas de peixe.',
    preco: 148.00,
    imagemUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
    categoria: 'Prato Principal'
  },
  {
    id: 'm2',
    nome: 'Dúzia de Ostras Gratinadas ao Queijo da Canastra',
    descricao: 'Ostras frescas de Santo Antônio de Lisboa gratinadas com blend de queijos e ervas finas.',
    preco: 62.00,
    imagemUrl: 'https://images.unsplash.com/photo-1599813953495-2d6ec3105ff7?auto=format&fit=crop&q=80&w=400',
    categoria: 'Entradas'
  },
  {
    id: 'm3',
    nome: 'Risoto de Frutos do Mar ao Vinho Branco',
    descricao: 'Arroz arbóreo com camarões médios, lulas frescas, mexilhões e toque de azeite trufado.',
    preco: 89.00,
    imagemUrl: 'https://images.unsplash.com/photo-1544025162-8315ea076595?auto=format&fit=crop&q=80&w=400',
    categoria: 'Prato Principal'
  },
  {
    id: 'm4',
    nome: 'Polvo Grelhado com Batatas ao Murro',
    descricao: 'Tentáculos de polvo grelhados no carvão com azeite de páprica e mini legumes.',
    preco: 119.00,
    imagemUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400',
    categoria: 'Prato Principal'
  },
  {
    id: 'm5',
    nome: 'Caipirinha Especial de Frutas Vermelhas',
    descricao: 'Cachaça artesanal de Luiz Alves, morango, amora e xarope de hibisco.',
    preco: 32.00,
    imagemUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
    categoria: 'Bebidas'
  },
  {
    id: 'm6',
    nome: 'Cheesecake com Calda de Butiá',
    descricao: 'Receita autoral com queijo cremoso e redução de fruta nativa da Ilha.',
    preco: 28.00,
    imagemUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400',
    categoria: 'Sobremesas'
  }
];

const mockHistoricalActivities: PartnerActivityRecord[] = [
  {
    id: 'act-001',
    partnerId: '1',
    partnerNome: 'Ostraria do Córrego',
    tipoParceiro: 'restaurante',
    data: '2026-08-18',
    horario: '19:30',
    clienteNome: 'Carlos Souza',
    clienteTelefone: '(48) 97777-7777',
    clienteCpf: '***.456.789-**',
    reservaId: 'res3',
    statusPresenca: 'compareceu',
    horarioCheckin: '19:25',
    pessoasQtd: 2,
    beneficioUtilizado: '20% Cashback Loopis Especial',
    totalGasto: 272.00,
    loopsGerados: 272,
    comanda: {
      id: 'cmd-001',
      comandaCode: 'COM-8921',
      clienteNome: 'Carlos Souza',
      clienteTelefone: '(48) 97777-7777',
      clienteCpf: '***.456.789-**',
      mesaOuReferencia: 'Mesa 04 (Varanda Mar)',
      data: '2026-08-18',
      horario: '20:45',
      itens: [
        { id: 'm1', nome: 'Sequência de Camarão Especial da Ilha', precoUnitario: 148.00, quantidade: 1 },
        { id: 'm2', nome: 'Dúzia de Ostras Gratinadas', precoUnitario: 62.00, quantidade: 1 },
        { id: 'm5', nome: 'Caipirinha de Frutas Vermelhas', precoUnitario: 32.00, quantidade: 2 }
      ],
      subtotal: 274.00,
      taxaServico: 27.40,
      descontoLoops: 29.40,
      total: 272.00,
      status: 'paga',
      formaPagamento: 'pix',
      origemEmissao: 'restaurante',
      fotoCupomUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'act-002',
    partnerId: '1',
    partnerNome: 'Ostraria do Córrego',
    tipoParceiro: 'restaurante',
    data: '2026-08-18',
    horario: '20:00',
    clienteNome: 'Maria Oliveira',
    clienteTelefone: '(48) 98888-8888',
    clienteCpf: '***.123.987-**',
    reservaId: 'res2',
    statusPresenca: 'compareceu',
    horarioCheckin: '19:55',
    pessoasQtd: 4,
    beneficioUtilizado: 'Cashback em Dobro',
    totalGasto: 418.00,
    loopsGerados: 836,
    comanda: {
      id: 'cmd-002',
      comandaCode: 'COM-8924',
      clienteNome: 'Maria Oliveira',
      clienteTelefone: '(48) 98888-8888',
      mesaOuReferencia: 'Mesa 12 (Salão Principal)',
      data: '2026-08-18',
      horario: '21:15',
      itens: [
        { id: 'm4', nome: 'Polvo Grelhado com Batatas ao Murro', precoUnitario: 119.00, quantidade: 2 },
        { id: 'm3', nome: 'Risoto de Frutos do Mar', precoUnitario: 89.00, quantidade: 1 },
        { id: 'm6', nome: 'Cheesecake com Calda de Butiá', precoUnitario: 28.00, quantidade: 2 },
        { id: 'm5', nome: 'Caipirinha Especial', precoUnitario: 32.00, quantidade: 1 }
      ],
      subtotal: 415.00,
      taxaServico: 41.50,
      descontoLoops: 38.50,
      total: 418.00,
      status: 'paga',
      formaPagamento: 'split',
      origemEmissao: 'cliente',
      fotoCupomUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'act-003',
    partnerId: '1',
    partnerNome: 'Ostraria do Córrego',
    tipoParceiro: 'restaurante',
    data: '2026-08-17',
    horario: '20:30',
    clienteNome: 'Fernando Albuquerque',
    clienteTelefone: '(48) 99123-4567',
    clienteCpf: '***.789.012-**',
    reservaId: 'res-old-1',
    statusPresenca: 'compareceu',
    horarioCheckin: '20:28',
    pessoasQtd: 2,
    beneficioUtilizado: '10% OFF Loopis',
    totalGasto: 198.50,
    loopsGerados: 198,
    comanda: {
      id: 'cmd-003',
      comandaCode: 'COM-8890',
      clienteNome: 'Fernando Albuquerque',
      mesaOuReferencia: 'Mesa 02',
      data: '2026-08-17',
      horario: '22:00',
      itens: [
        { id: 'm1', nome: 'Sequência de Camarão Especial', precoUnitario: 148.00, quantidade: 1 },
        { id: 'm5', nome: 'Caipirinha de Frutas Vermelhas', precoUnitario: 32.00, quantidade: 1 },
        { id: 'm6', nome: 'Cheesecake com Calda de Butiá', precoUnitario: 28.00, quantidade: 1 }
      ],
      subtotal: 208.00,
      taxaServico: 20.80,
      descontoLoops: 30.30,
      total: 198.50,
      status: 'paga',
      formaPagamento: 'cartao',
      origemEmissao: 'restaurante',
      fotoCupomUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'act-004',
    partnerId: '1',
    partnerNome: 'Ostraria do Córrego',
    tipoParceiro: 'restaurante',
    data: '2026-08-17',
    horario: '19:00',
    clienteNome: 'Juliana Paes Martins',
    clienteTelefone: '(48) 98111-2233',
    reservaId: 'res-old-2',
    statusPresenca: 'no_show',
    pessoasQtd: 3,
    totalGasto: 0,
    loopsGerados: 0,
    beneficioUtilizado: 'Reserva não comparecida'
  },
  {
    id: 'act-005',
    partnerId: '1',
    partnerNome: 'Ostraria do Córrego',
    tipoParceiro: 'tour',
    data: '2026-08-16',
    horario: '17:00',
    clienteNome: 'Rodrigo Fontana & Amigos',
    clienteTelefone: '(48) 99654-3210',
    reservaId: 'res-old-3',
    statusPresenca: 'compareceu',
    horarioCheckin: '16:50',
    pessoasQtd: 4,
    beneficioUtilizado: 'Sunset Ostras & Espumante',
    totalGasto: 680.00,
    loopsGerados: 680,
    comanda: {
      id: 'cmd-005',
      comandaCode: 'EXP-4412',
      clienteNome: 'Rodrigo Fontana',
      mesaOuReferencia: 'Deck Pôr do Sol',
      data: '2026-08-16',
      horario: '19:30',
      itens: [
        { id: 'exp1', nome: 'Passeio com Degustação de Ostras e Espumante (4 pessoas)', precoUnitario: 170.00, quantidade: 4 }
      ],
      subtotal: 680.00,
      taxaServico: 0,
      descontoLoops: 0,
      total: 680.00,
      status: 'paga',
      formaPagamento: 'pix',
      origemEmissao: 'cliente'
    }
  },
  {
    id: 'act-006',
    partnerId: '1',
    partnerNome: 'Ostraria do Córrego',
    tipoParceiro: 'evento',
    data: '2026-08-15',
    horario: '21:00',
    clienteNome: 'Camila Silveira',
    clienteTelefone: '(48) 97412-5896',
    reservaId: 'res-old-4',
    statusPresenca: 'compareceu',
    horarioCheckin: '20:45',
    pessoasQtd: 2,
    beneficioUtilizado: 'Noite de Jazz & Frutos do Mar',
    totalGasto: 310.00,
    loopsGerados: 310,
    comanda: {
      id: 'cmd-006',
      comandaCode: 'SHW-1092',
      clienteNome: 'Camila Silveira',
      mesaOuReferencia: 'Mesa 08 (Frente Palco)',
      data: '2026-08-15',
      horario: '23:10',
      itens: [
        { id: 'c1', nome: 'Couvert Artístico Especial Jazz', precoUnitario: 25.00, quantidade: 2 },
        { id: 'm3', nome: 'Risoto de Frutos do Mar ao Vinho Branco', precoUnitario: 89.00, quantidade: 2 },
        { id: 'm5', nome: 'Caipirinha Especial de Frutas Vermelhas', precoUnitario: 32.00, quantidade: 2 },
        { id: 'm6', nome: 'Cheesecake com Calda de Butiá', precoUnitario: 28.00, quantidade: 1 }
      ],
      subtotal: 320.00,
      taxaServico: 32.00,
      descontoLoops: 42.00,
      total: 310.00,
      status: 'paga',
      formaPagamento: 'split',
      origemEmissao: 'restaurante',
      fotoCupomUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'act-007',
    partnerId: '1',
    partnerNome: 'Ostraria do Córrego',
    tipoParceiro: 'tour',
    data: '2026-08-14',
    horario: '10:00',
    clienteNome: 'Bruno Mendonça',
    clienteTelefone: '(48) 98765-1122',
    reservaId: 'res-old-5',
    statusPresenca: 'no_show',
    pessoasQtd: 2,
    totalGasto: 0,
    loopsGerados: 0,
    beneficioUtilizado: 'Tour Fazenda Marinha das Ostras'
  }
];

const mockRestaurants: Restaurante[] = [
  {
    id: '1',
    nome: 'Ostraria do Córrego',
    tipoParceiro: 'restaurante',
    location: 'Santo Antônio de Lisboa',
    endereco: 'Rodovia Gilson da Costa Xavier, 1000 - Santo Antônio de Lisboa, Florianópolis - SC',
    promotion: '20% cashback às terças e quartas',
    imageUrl: 'https://images.unsplash.com/photo-1599813953495-2d6ec3105ff7?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    categoria: 'Frutos do Mar',
    distance: '3.2 km',
    horarioFuncionamento: 'Ter a Dom - 18h às 23h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1599813953495-2d6ec3105ff7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'
    ],
    fotosMenu: [],
    cardapio: mockDefaultMenuItems,
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '2',
    nome: 'Bistro da Lagoa',
    tipoParceiro: 'restaurante',
    location: 'Lagoa da Conceição',
    endereco: 'Avenida das Rendeiras, 500 - Lagoa da Conceição',
    promotion: 'Cashback em dobro no happy hour (18h-20h)',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    categoria: 'Bares',
    distance: '5.1 km',
    horarioFuncionamento: 'Seg a Sáb - 17h às 00h',
    fotosGaleria: [],
    fotosMenu: [],
    cardapio: mockDefaultMenuItems,
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '3',
    nome: 'Sunset Catamarã Ilha das Anhatomirim',
    tipoParceiro: 'tour',
    location: 'Norte da Ilha',
    endereco: 'Trapiche de Canasvieiras, Trapiche Central - Florianópolis/SC',
    promotion: 'Ganhe 100 Loops na Reserva Antecipada',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    categoria: 'Passeio de Barco & Roteiro',
    distance: '12.0 km',
    horarioFuncionamento: 'Diariamente das 09h às 18h',
    fotosGaleria: [],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '4',
    nome: 'Festival Gastronômico da Ostra & Vinho 2026',
    tipoParceiro: 'evento',
    location: 'Santo Antônio de Lisboa',
    endereco: 'Praça Roldão da Rocha Pires - Centro Histórico',
    promotion: 'Entrada com 20% OFF em Loops',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    categoria: 'Festival Gastronômico',
    distance: '4.0 km',
    horarioFuncionamento: '22 a 24 de Agosto - 12h às 22h',
    fotosGaleria: [],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '5',
    nome: 'Jazz & Wine Experience na Fortaleza',
    tipoParceiro: 'evento',
    location: 'Jurerê Internacional',
    endereco: 'Avenida dos Búzios, 200 - Jurerê',
    promotion: 'Couvert com 100% de Cashback',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    categoria: 'Show & Música ao Vivo',
    distance: '15.0 km',
    horarioFuncionamento: 'Sextas e Sábados - 20h às 02h',
    fotosGaleria: [],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  }
];

const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-08-18T19:30:00Z', amount: 272, type: 'earn', description: 'Consumo na Ostraria do Córrego (COM-8921)' },
  { id: 't2', date: '2026-08-17T20:00:00Z', amount: 300, type: 'bonus', description: 'Cashback em dobro - Bistro da Lagoa' },
];

const mockRewards: Reward[] = [
  { id: 'r1', title: 'Sobremesa Grátis', description: 'Troque por qualquer sobremesa no menu.', cost: 150, restaurantId: '1', restaurantName: 'Ostraria do Córrego' },
  { id: 'r2', title: 'R$ 50 de Desconto', description: 'Cupom de R$ 50 off em toda a rede Loopis.', cost: 500 },
];

const mockB2bReservations: Reservation[] = [
  { id: 'res1', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '18:30', guests: 2, promotionSelected: true, status: 'pending', clientName: 'João da Silva', clientPhone: '(48) 99999-9999' },
  { id: 'res2', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '19:00', guests: 4, promotionSelected: false, status: 'confirmed', clientName: 'Maria Oliveira', clientPhone: '(48) 98888-8888' },
  { id: 'res3', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '19:30', guests: 2, promotionSelected: true, status: 'checked_in', clientName: 'Carlos Souza', clientPhone: '(48) 97777-7777' },
  { id: 'res4', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '20:00', guests: 6, promotionSelected: true, status: 'pending', clientName: 'Fernanda Albuquerque', clientPhone: '(48) 99123-4567' },
  { id: 'res5', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '20:30', guests: 3, promotionSelected: false, status: 'confirmed', clientName: 'Juliana Paes Martins', clientPhone: '(48) 98111-2233' },
  { id: 'res6', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '21:00', guests: 5, promotionSelected: true, status: 'checked_in', clientName: 'Rodrigo Fontana', clientPhone: '(48) 99654-3210' },
  { id: 'res7', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '17:45', guests: 2, promotionSelected: false, status: 'completed', clientName: 'Camila Silveira', clientPhone: '(48) 97412-5896' },
  { id: 'res8', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-20', time: '18:00', guests: 4, promotionSelected: true, status: 'completed', clientName: 'Bruno Mendonça', clientPhone: '(48) 98765-1122' },
  { id: 'res9', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-21', time: '19:15', guests: 2, promotionSelected: true, status: 'confirmed', clientName: 'Laura Menezes', clientPhone: '(48) 98444-2901' },
  { id: 'res10', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-22', time: '20:45', guests: 8, promotionSelected: false, status: 'pending', clientName: 'Paulo Henrique', clientPhone: '(48) 99911-4500' },
  { id: 'res11', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-24', time: '12:30', guests: 3, promotionSelected: true, status: 'confirmed', clientName: 'Renata Koerich', clientPhone: '(48) 99222-7744' },
  { id: 'res12', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: '2026-08-26', time: '21:30', guests: 2, promotionSelected: true, status: 'pending', clientName: 'Gustavo Lemos', clientPhone: '(48) 98611-3009' },
];

const mockPartnerRequests: PartnerRequest[] = [
  { 
    id: 'pr1', 
    name: 'Sushi Floripa Experience', 
    partnerType: 'restaurante', 
    category: 'Japonês', 
    address: 'Rua Bocaiúva, 150 - Centro', 
    phone: '(48) 98765-4321', 
    status: 'pending', 
    requestDate: new Date().toISOString(),
    detailsSummary: 'Restaurante Japonês Premium com cardápio de 12 itens e fotos do salão.'
  },
  { 
    id: 'pr2', 
    name: 'Rota das Cervejarias Artesanais', 
    partnerType: 'tour', 
    category: 'Tour & Roteiro', 
    address: 'Av. Madre Benvenuta, 1000 - Santa Mônica', 
    phone: '(48) 91234-5678', 
    status: 'pending', 
    requestDate: new Date().toISOString(),
    detailsSummary: 'Passeio guiado pelas 4 principais microcervejarias da Ilha com degustação.'
  },
  { 
    id: 'pr3', 
    name: 'Floripa Sunset Sessions 2026', 
    partnerType: 'evento', 
    category: 'Show & Evento', 
    address: 'Praia Brava - Florianópolis', 
    phone: '(48) 99887-7665', 
    status: 'pending', 
    requestDate: new Date().toISOString(),
    detailsSummary: 'Show acústico ao vivo no fim de tarde com ingressos antecipados.'
  },
];

const defaultSystemConfig: SystemConfig = {
  defaultCashbackPercent: 1,
  maxDiscountAllowed: 30,
  loopisCommissionPercent: 10,
  activeCity: 'Florianópolis - SC',
  isCityActive: true,
};

const mockTabelaPontuacao: TabelaPontuacao[] = [
  { id: 'tp1', acao: 'cadastro_completo', valorEmLoops: 100 },
  { id: 'tp2', acao: 'reserva', valorEmLoops: 50 },
  { id: 'tp3', acao: 'checkin', valorEmLoops: 20 },
  { id: 'tp4', acao: 'indicacao', valorEmLoops: 200 },
];

const mockAuditCuponsFiscais: CupomFiscal[] = [
  { id: 'cf1', consumoId: 'c1', fotoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300', valorLidoIa: 150.50, lidoPor: 'cliente', statusValidacao: 'pendente', clienteNome: 'João da Silva', dataEmissao: '18/08/2026' },
  { id: 'cf2', consumoId: 'c2', fotoUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=300', valorLidoIa: 340.00, lidoPor: 'restaurante', statusValidacao: 'aprovado', clienteNome: 'Carlos Souza', dataEmissao: '18/08/2026' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: 'client',
      setRole: (role) => set({ currentRole: role }),
      restaurants: mockRestaurants,
      
      // Client Auth & Data
      isLoggedIn: false,
      isLoginModalOpen: false,
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
      login: () => set({ isLoggedIn: true, isLoginModalOpen: false }),
      logout: () => set({ 
        isLoggedIn: false, 
        currentRole: 'client', 
        activeReservation: null, 
        isLoginModalOpen: false 
      }),
      
      loopsBalance: 850,
      transactions: mockTransactions,
      rewards: mockRewards,
      activeReservation: null,
      
      createReservation: (reservationData) => {
        const newReservation: Reservation = {
          ...reservationData,
          id: Math.random().toString(36).substring(2, 9),
          status: 'pending'
        };
        set({ activeReservation: newReservation });
        
        setTimeout(() => {
          const currentRes = get().activeReservation;
          if (currentRes && currentRes.id === newReservation.id && currentRes.status === 'pending') {
            get().updateReservationStatus('confirmed');
          }
        }, 2000);
      },
      
      updateReservationStatus: (status) => set((state) => ({
        activeReservation: state.activeReservation ? { ...state.activeReservation, status } : null
      })),
      
      redeemReward: (rewardId) => {
        const reward = get().rewards.find(r => r.id === rewardId);
        if (!reward || get().loopsBalance < reward.cost) return false;
        
        set((state) => ({
          loopsBalance: state.loopsBalance - reward.cost,
          transactions: [
            {
              id: Math.random().toString(36).substring(2, 9),
              date: new Date().toISOString(),
              amount: -reward.cost,
              type: 'redeem',
              description: `Resgate: ${reward.title}`
            },
            ...state.transactions
          ]
        }));
        return true;
      },

      // B2B Partner State
      currentPartnerType: 'restaurante',
      setPartnerType: (type) => set({ currentPartnerType: type }),
      menuItems: mockDefaultMenuItems,
      addMenuItem: (item) => set((state) => ({
        menuItems: [item, ...state.menuItems]
      })),
      removeMenuItem: (id) => set((state) => ({
        menuItems: state.menuItems.filter(item => item.id !== id)
      })),
      
      b2bReservations: mockB2bReservations,
      updateB2bReservationStatus: (id, status) => set((state) => ({
        b2bReservations: state.b2bReservations.map(res => 
          res.id === id ? { ...res, status } : res
        )
      })),
      
      processBilling: (reservationId, amount) => {
        const loopsEarned = Math.floor(amount);
        
        set((state) => ({
          b2bReservations: state.b2bReservations.map(res => 
            res.id === reservationId ? { ...res, status: 'completed' } : res
          ),
          loopsBalance: state.loopsBalance + loopsEarned,
          transactions: [
            {
              id: Math.random().toString(36).substring(2, 9),
              date: new Date().toISOString(),
              amount: loopsEarned,
              type: 'earn',
              description: `Consumo (${reservationId})`
            },
            ...state.transactions
          ]
        }));
      },
      
      customPromotions: [],
      addCustomPromotion: (promo) => set((state) => ({
        customPromotions: [...state.customPromotions, { ...promo, id: Math.random().toString(36).substring(2, 9) }]
      })),

      // Comandas & Partner Activities
      comandas: [
        mockHistoricalActivities[0].comanda!,
        mockHistoricalActivities[1].comanda!,
        mockHistoricalActivities[2].comanda!,
      ],
      addComanda: (comanda) => set((state) => ({
        comandas: [comanda, ...state.comandas]
      })),
      updateComandaStatus: (id, status, paymentMethod) => set((state) => ({
        comandas: state.comandas.map(c => 
          c.id === id ? { ...c, status, ...(paymentMethod ? { formaPagamento: paymentMethod } : {}) } : c
        )
      })),
      
      partnerActivities: mockHistoricalActivities,
      addPartnerActivity: (activity) => set((state) => ({
        partnerActivities: [activity, ...state.partnerActivities]
      })),

      // Admin Actions
      partnerRequests: mockPartnerRequests,
      systemConfig: defaultSystemConfig,
      tabelaPontuacao: mockTabelaPontuacao,
      auditCuponsFiscais: mockAuditCuponsFiscais,
      
      updateSystemConfig: (config) => set((state) => ({
        systemConfig: { ...state.systemConfig, ...config }
      })),

      approvePartnerRequest: (id) => set((state) => {
        const request = state.partnerRequests.find(r => r.id === id);
        if (!request) return state;

        const newRestaurant: Restaurante = {
          id: `rest_${id}`,
          nome: request.name,
          tipoParceiro: request.partnerType || 'restaurante',
          location: 'Florianópolis',
          endereco: request.address,
          promotion: 'Novo Parceiro! Ganhe Loops',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
          rating: 5.0,
          categoria: request.category,
          distance: '0 km',
          horarioFuncionamento: 'A definir',
          fotosGaleria: request.fotosGaleria || ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'],
          fotosMenu: [],
          cardapio: request.cardapio || mockDefaultMenuItems,
          status: 'aprovado',
          avaliacoesGoogle: []
        };

        return {
          partnerRequests: state.partnerRequests.map(r => r.id === id ? { ...r, status: 'approved' } : r),
          restaurants: [newRestaurant, ...state.restaurants]
        };
      }),

      rejectPartnerRequest: (id) => set((state) => ({
        partnerRequests: state.partnerRequests.map(r => r.id === id ? { ...r, status: 'rejected' } : r)
      })),
    }),
    {
      name: 'loopis-storage',
    }
  )
);
