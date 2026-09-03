import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppNotification, ClientBooking, ClientBookingStatus, InternalReview, ProfileRole, Restaurante, Transaction, Reward, Reservation, ReservationStatus, Campanha, PartnerRequest, SystemConfig, TabelaPontuacao, CupomFiscal, Friend, FriendInvite, UserSearchResult } from '../types';
import { PartnerType } from '../types';

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
  notifications: AppNotification[];
  internalReviews: InternalReview[];
  clientBookings: ClientBooking[];
  
  // Friends & Network Module
  friends: Friend[];
  friendInvites: FriendInvite[];
  sendFriendInvite: (user: UserSearchResult) => boolean;
  acceptFriendInvite: (inviteId: string) => void;
  rejectFriendInvite: (inviteId: string) => void;
  removeFriend: (friendId: string) => void;
  
  createReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => void;
  updateReservationStatus: (status: ReservationStatus) => void;
  redeemReward: (rewardId: string) => boolean;
  completeClientPayment: (description: string, loopsUsed: number, loopsEarned: number) => boolean;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  submitReview: (notificationId: string, rating: number, comment: string) => string | null;
  updateClientBookingStatus: (bookingId: string, status: ClientBookingStatus) => void;

  // B2B Restaurant Module State
  b2bReservations: Reservation[];
  updateB2bReservationStatus: (id: string, status: ReservationStatus) => void;
  processBilling: (reservationId: string, amount: number) => void;
  customPromotions: Campanha[];
  addCustomPromotion: (promo: Omit<Campanha, 'id'>) => void;

  // Admin Module State
  partnerRequests: PartnerRequest[];
  systemConfig: SystemConfig;
  tabelaPontuacao: TabelaPontuacao[];
  auditCuponsFiscais: CupomFiscal[];
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  approvePartnerRequest: (id: string) => void;
  rejectPartnerRequest: (id: string) => void;
}

const mockRestaurants: Restaurante[] = [
  {
    id: 'marisqueira-sintra',
    nome: 'Marisqueira Sintra',
    location: 'Santo Antônio de Lisboa',
    endereco: 'R. XV de Novembro, 147 - Santo Antônio de Lisboa, Florianópolis - SC',
    promotion: '20% cashback + Sobremesa Portuguesa Cortesia',
    imageUrl: '/images/restaurants/marisqueira-sintra.png',
    rating: 4.9,
    categoria: 'Frutos do Mar',
    distance: '2.5 km',
    horarioFuncionamento: 'Qua a Seg - 12h às 23h',
    fotosGaleria: [
      '/images/restaurants/marisqueira-sintra.png',
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'boteco-ori',
    nome: 'Boteco ORI',
    location: 'Córrego Grande',
    endereco: 'R. Lauro Linhares, 1250 - Córrego Grande, Florianópolis - SC',
    promotion: 'Chopp em dobro + 15% cashback no Happy Hour (17h-20h)',
    imageUrl: '/images/restaurants/boteco-ori.png',
    rating: 4.8,
    categoria: 'Bares',
    distance: '1.8 km',
    horarioFuncionamento: 'Ter a Dom - 17h às 01h',
    fotosGaleria: [
      '/images/restaurants/boteco-ori.png',
      '/images/restaurants/boteco-ori-logo.png',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'o-timoneiro',
    nome: 'O Timoneiro',
    location: 'Barra da Lagoa',
    endereco: 'R. Amaro Coelho, 120 - Barra da Lagoa, Florianópolis - SC',
    promotion: 'Sequência de Camarão Completa com 25% de Cashback',
    imageUrl: '/images/restaurants/o-timoneiro.jpg',
    rating: 4.9,
    categoria: 'Frutos do Mar',
    distance: '6.2 km',
    horarioFuncionamento: 'Seg a Dom - 11:30h às 23:30h',
    fotosGaleria: [
      '/images/restaurants/o-timoneiro.jpg',
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'trattoria-carbone',
    nome: 'Trattoria Carbone',
    location: 'Centro',
    endereco: 'Av. Osvaldo Rodrigues Cabral, 1570 - Centro, Florianópolis - SC',
    promotion: '20% off em Vinhos Selecionados + 15% Cashback em Loops',
    imageUrl: '/images/restaurants/trattoria-carbone.png',
    rating: 4.9,
    categoria: 'Italiano',
    distance: '0.9 km',
    horarioFuncionamento: 'Ter a Dom - 19h às 00h',
    fotosGaleria: [
      '/images/restaurants/trattoria-carbone.png',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'soul-burger-gourmet',
    nome: 'Soul Burger Artesanal',
    location: 'Centro',
    endereco: 'Av. Rio Branco, 480 - Centro, Florianópolis - SC',
    promotion: 'Combo Especial com 15% Cashback em Loops',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    categoria: 'Hambúrguer',
    distance: '1.5 km',
    horarioFuncionamento: 'Ter a Dom - 18h às 23:30h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'forneria-luce',
    nome: 'Forneria Luce Napoletana',
    location: 'Lagoa da Conceição',
    endereco: 'Av. das Rendeiras, 890 - Lagoa da Conceição, Florianópolis - SC',
    promotion: 'Vinho da Casa Cortesia na Reserva + 20% Cashback',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    categoria: 'Italiano',
    distance: '4.8 km',
    horarioFuncionamento: 'Ter a Dom - 19h às 00h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'sushi-prime-floripa',
    nome: 'Nikkei Fusion & Sushi Prime',
    location: 'Beira Mar Norte',
    endereco: 'Av. Beira Mar Norte, 2200 - Centro, Florianópolis - SC',
    promotion: 'Rodízio Premium com 20% em Loops',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    categoria: 'Japonês',
    distance: '2.1 km',
    horarioFuncionamento: 'Seg a Dom - 19h às 23:30h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'cafe-cultura-lagoa',
    nome: 'Café Cultura & Bistrô',
    location: 'Lagoa da Conceição',
    endereco: 'R. Henrique Veras do Nascimento, 110 - Lagoa da Conceição, Florianópolis - SC',
    promotion: 'Café Especial + Croissant com 10% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    categoria: 'Cafés',
    distance: '5.0 km',
    horarioFuncionamento: 'Seg a Sáb - 08h às 20h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: 'rancho-acoriano',
    nome: 'Rancho Açoriano Gastronomia',
    location: 'Ribeirão da Ilha',
    endereco: 'Rod. Baldicero Filomeno, 5600 - Ribeirão da Ilha, Florianópolis - SC',
    promotion: 'Ostras Vivas Gratinadas Cortesia + 20% Cashback',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    categoria: 'Frutos do Mar',
    distance: '14.2 km',
    horarioFuncionamento: 'Qua a Seg - 11:30h às 23h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '1',
    nome: 'Ostraria do Córrego',
    location: 'Santo Antônio de Lisboa',
    endereco: 'Rodovia Gilson da Costa Xavier, 1000 - Santo Antônio de Lisboa, Florianópolis - SC',
    promotion: '20% cashback às terças e quartas',
    imageUrl: 'https://images.unsplash.com/photo-1599813953495-2d6ec3105ff7?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    categoria: 'Frutos do Mar',
    distance: '3.2 km',
    horarioFuncionamento: 'Ter a Dom - 18h às 23h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '2',
    nome: 'Bistro da Lagoa',
    location: 'Lagoa da Conceição',
    endereco: 'Avenida das Rendeiras, 500 - Lagoa da Conceição',
    promotion: 'Cashback em dobro no happy hour (18h-20h)',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    categoria: 'Bares',
    distance: '5.1 km',
    horarioFuncionamento: 'Seg a Sáb - 17h às 00h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '3',
    nome: 'Campeche Surf Burger',
    location: 'Campeche',
    endereco: 'Avenida Pequeno Príncipe, 1200 - Campeche',
    promotion: 'R$ 25 off acima de R$ 100',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    categoria: 'Hambúrguer',
    distance: '8.4 km',
    horarioFuncionamento: 'Ter a Dom - 18h às 23:30h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '4',
    nome: 'Mercado Beira-Mar Grill',
    location: 'Centro',
    endereco: 'Avenida Beira Mar Norte, 100 - Centro',
    promotion: '15% de cashback nos fins de semana',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    categoria: 'Italiano',
    distance: '1.2 km',
    horarioFuncionamento: 'Seg a Dom - 11h às 15h e 19h às 23h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1544025162-8315ea076595?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '5',
    nome: 'Forneria Jurerê',
    location: 'Jurerê Internacional',
    endereco: 'Avenida dos Búzios, 200 - Jurerê',
    promotion: '20% off de domingo a quinta',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    categoria: 'Italiano',
    distance: '15.0 km',
    horarioFuncionamento: 'Ter a Dom - 19h às 00h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
  {
    id: '6',
    nome: 'Café da Ilha',
    location: 'Coqueiros',
    endereco: 'Via Gastronômica, 50 - Coqueiros',
    promotion: 'Ganhe 50 Loops no primeiro check-in',
    imageUrl: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    categoria: 'Cafés',
    distance: '4.5 km',
    horarioFuncionamento: 'Seg a Sáb - 08h às 20h',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    ],
    fotosMenu: [],
    status: 'aprovado',
    avaliacoesGoogle: []
  },
];

const mockTransactions: Transaction[] = [
  { id: 't1', date: '2023-10-15T19:30:00Z', amount: 150, type: 'earn', description: 'Consumo na Ostraria do Córrego' },
  { id: 't2', date: '2023-10-20T20:00:00Z', amount: 300, type: 'bonus', description: 'Cashback em dobro - Bistro da Lagoa' },
];

const mockRewards: Reward[] = [
  { id: 'r1', title: 'Sobremesa Grátis', description: 'Troque por qualquer sobremesa no menu.', cost: 150, restaurantId: '1', restaurantName: 'Ostraria do Córrego' },
  { id: 'r2', title: 'R$ 50 de Desconto', description: 'Cupom de R$ 50 off em toda a rede Loopis.', cost: 500 },
];

const mockB2bReservations: Reservation[] = [
  { id: 'res1', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: 'Hoje', time: '19:30', guests: 2, promotionSelected: true, status: 'pending', clientName: 'João da Silva', clientPhone: '(48) 99999-9999' },
  { id: 'res2', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: 'Hoje', time: '20:00', guests: 4, promotionSelected: false, status: 'confirmed', clientName: 'Maria Oliveira', clientPhone: '(48) 98888-8888' },
  { id: 'res3', restaurantId: '1', restaurantName: 'Ostraria do Córrego', date: 'Hoje', time: '19:00', guests: 2, promotionSelected: true, status: 'checked_in', clientName: 'Carlos Souza', clientPhone: '(48) 97777-7777' },
];

const mockNotifications: AppNotification[] = [
  {
    id: 'notification-review-tour',
    type: 'review_request',
    title: 'Conte como foi sua experiência',
    message: 'O que achou da sua visita a Costa & Lagoa Experiências Náuticas?',
    partnerId: 'forneria-luce',
    partnerName: 'Costa & Lagoa Experiências Náuticas',
    experienceId: 'exp-2',
    experienceName: 'Passeio de Lancha na Costa da Lagoa + Almoço Típico',
    partnerRoute: '/parceiro/forneria-luce',
    createdAt: '2026-08-20T15:30:00.000Z',
    read: false,
  },
  {
    id: 'notification-review-restaurant',
    type: 'review_request',
    title: 'Como foi sua visita?',
    message: 'O que achou da sua visita a Marisqueira Sintra?',
    partnerId: 'marisqueira-sintra',
    partnerName: 'Marisqueira Sintra',
    experienceName: 'Reserva para jantar',
    partnerRoute: '/restaurante/marisqueira-sintra',
    createdAt: '2026-08-19T23:10:00.000Z',
    read: true,
  },
];

const mockInternalReviews: InternalReview[] = [
  {
    id: 'review-approved-1',
    partnerId: 'marisqueira-sintra',
    partnerName: 'Marisqueira Sintra',
    experienceName: 'Reserva para jantar',
    userName: 'Marina Costa',
    rating: 5,
    comment: 'Atendimento muito cuidadoso e a sequência de frutos do mar estava excelente. A reserva pelo Loopis funcionou sem espera.',
    status: 'approved',
    createdAt: '2026-08-17T22:40:00.000Z',
  },
  {
    id: 'review-approved-2',
    partnerId: 'marisqueira-sintra',
    partnerName: 'Marisqueira Sintra',
    experienceName: 'Sunset VIP no deck',
    userName: 'Felipe Andrade',
    rating: 4,
    comment: 'Vista linda e experiência bem organizada. Usamos os Loops no pagamento e o processo foi bem simples.',
    status: 'approved',
    createdAt: '2026-08-14T20:15:00.000Z',
  },
  {
    id: 'review-approved-3',
    partnerId: 'forneria-luce',
    partnerName: 'Costa & Lagoa Experiências Náuticas',
    experienceId: 'exp-2',
    experienceName: 'Passeio de Lancha na Costa da Lagoa + Almoço Típico',
    userName: 'Bianca Souza',
    rating: 5,
    comment: 'Passeio pontual, equipe muito atenciosa e paradas ótimas para banho. O almoço na Costa da Lagoa fechou o dia perfeitamente.',
    status: 'approved',
    createdAt: '2026-08-12T18:25:00.000Z',
  },
];

const mockClientBookings: ClientBooking[] = [
  {
    id: 'booking-rest-current',
    partnerType: PartnerType.RESTAURANT,
    partnerId: 'marisqueira-sintra',
    partnerName: 'Marisqueira Sintra',
    productName: 'Reserva para jantar no deck',
    neighborhood: 'Santo Antônio de Lisboa',
    imageUrl: '/images/restaurants/marisqueira-sintra.png',
    date: '2026-08-20',
    time: '20:30',
    quantity: 4,
    quantityLabel: 'pessoas',
    status: 'checked_in',
    paymentStatus: 'pay_at_venue',
    total: 0,
    loopsUsed: 0,
    loopsEarned: 0,
  },
  {
    id: 'booking-rental-upcoming',
    partnerType: PartnerType.RENTAL,
    partnerId: 'arena-lagoa',
    partnerName: 'Arena Lagoa Beach Tennis',
    productName: 'Quadra premium com equipamentos',
    neighborhood: 'Lagoa da Conceição',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=900',
    date: '2026-08-21',
    time: '18:00',
    quantity: 2,
    quantityLabel: 'horas',
    status: 'confirmed',
    paymentStatus: 'paid',
    total: 180,
    loopsUsed: 80,
    loopsEarned: 20,
    voucherCode: 'LOOP-LOC-4812',
  },
  {
    id: 'booking-tour-upcoming',
    partnerType: PartnerType.TOUR,
    partnerId: 'forneria-luce',
    partnerName: 'Costa & Lagoa Experiências Náuticas',
    productName: 'Passeio de Lancha na Costa da Lagoa + Almoço Típico',
    neighborhood: 'Lagoa da Conceição',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=900',
    date: '2026-08-23',
    time: '10:30',
    quantity: 3,
    quantityLabel: 'passageiros',
    status: 'confirmed',
    paymentStatus: 'paid',
    total: 720,
    loopsUsed: 300,
    loopsEarned: 105,
    voucherCode: 'LOOP-TOUR-8241',
  },
  {
    id: 'booking-event-upcoming',
    partnerType: PartnerType.EVENT,
    partnerId: 'trattoria-carbone',
    partnerName: 'Sunset Sessions Floripa',
    productName: 'Floripa Sunset Sessions - 2º Lote',
    neighborhood: 'Jurerê Internacional',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=900',
    date: '2026-08-29',
    time: '17:00',
    quantity: 2,
    quantityLabel: 'ingressos',
    status: 'confirmed',
    paymentStatus: 'paid',
    total: 160,
    loopsUsed: 0,
    loopsEarned: 32,
    voucherCode: 'LOOP-EVT-5208',
  },
  {
    id: 'booking-rest-upcoming',
    partnerType: PartnerType.RESTAURANT,
    partnerId: 'boteco-ori',
    partnerName: 'Boteco ORI',
    productName: 'Reserva Happy Hour com cashback',
    neighborhood: 'Córrego Grande',
    imageUrl: '/images/restaurants/boteco-ori.png',
    date: '2026-08-22',
    time: '19:00',
    quantity: 5,
    quantityLabel: 'pessoas',
    status: 'confirmed',
    paymentStatus: 'pay_at_venue',
    total: 0,
    loopsUsed: 0,
    loopsEarned: 0,
  },
  {
    id: 'booking-event-completed',
    partnerType: PartnerType.EVENT,
    partnerId: 'trattoria-carbone',
    partnerName: 'Trattoria Carbone',
    productName: 'Noite Italiana com Jazz ao Vivo',
    neighborhood: 'Centro',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=900',
    date: '2026-08-15',
    time: '20:00',
    quantity: 2,
    quantityLabel: 'ingressos',
    status: 'completed',
    paymentStatus: 'paid',
    total: 390,
    loopsUsed: 200,
    loopsEarned: 58,
    voucherCode: 'LOOP-EVT-1092',
  },
  {
    id: 'booking-tour-completed',
    partnerType: PartnerType.TOUR,
    partnerId: 'forneria-luce',
    partnerName: 'Costa & Lagoa Experiências Náuticas',
    productName: 'Passeio de Lancha na Costa da Lagoa + Almoço Típico',
    neighborhood: 'Lagoa da Conceição',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=900',
    date: '2026-08-12',
    time: '14:00',
    quantity: 2,
    quantityLabel: 'passageiros',
    status: 'completed',
    paymentStatus: 'paid',
    total: 480,
    loopsUsed: 120,
    loopsEarned: 78,
    voucherCode: 'LOOP-TOUR-4412',
    reviewNotificationId: 'notification-review-tour',
  },
  {
    id: 'booking-rest-completed',
    partnerType: PartnerType.RESTAURANT,
    partnerId: 'marisqueira-sintra',
    partnerName: 'Marisqueira Sintra',
    productName: 'Jantar com sequência de frutos do mar',
    neighborhood: 'Santo Antônio de Lisboa',
    imageUrl: '/images/restaurants/marisqueira-sintra.png',
    date: '2026-08-10',
    time: '20:00',
    quantity: 2,
    quantityLabel: 'pessoas',
    status: 'completed',
    paymentStatus: 'paid',
    total: 272,
    loopsUsed: 90,
    loopsEarned: 54,
    reviewNotificationId: 'notification-review-restaurant',
  },
];

const mockPartnerRequests: PartnerRequest[] = [
  { id: 'pr1', name: 'Sushi Floripa', category: 'Japonês', address: 'Rua Bocaiúva, 150 - Centro', phone: '(48) 98765-4321', status: 'pending', requestDate: new Date().toISOString() },
  { id: 'pr2', name: 'Pizzaria da Nonna', category: 'Italiano', address: 'Av. Madre Benvenuta, 1000 - Santa Mônica', phone: '(48) 91234-5678', status: 'pending', requestDate: new Date().toISOString() },
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
  { id: 'cf1', consumoId: 'c1', fotoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300', valorLidoIa: 150.50, lidoPor: 'cliente', statusValidacao: 'pendente' },
  { id: 'cf2', consumoId: 'c2', fotoUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=300', valorLidoIa: 340.00, lidoPor: 'restaurante', statusValidacao: 'aprovado' },
];

const mockInitialFriends: Friend[] = [
  {
    id: 'fr_1',
    userId: 'usr_1',
    name: 'Ana Beatriz Souza',
    username: '@anabeatriz',
    phone: '(48) 99123-4567',
    email: 'ana.souza@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 320,
    since: 'Conectado em Jan/2026',
    status: 'accepted',
  },
  {
    id: 'fr_2',
    userId: 'usr_2',
    name: 'Lucas Mendes Prado',
    username: '@lucasmendes',
    phone: '(48) 98877-6655',
    email: 'lucas.prado@yahoo.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 150,
    since: 'Conectado em Fev/2026',
    status: 'accepted',
  },
];

const mockInitialFriendInvites: FriendInvite[] = [
  {
    id: 'inv_1',
    userId: 'usr_3',
    name: 'Camila Fernandes Lima',
    username: '@camilalima',
    phone: '(48) 99654-3210',
    email: 'camila.lima@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 840,
    direction: 'received',
    status: 'pending',
    createdAt: 'Hoje às 09:30',
  },
  {
    id: 'inv_2',
    userId: 'usr_4',
    name: 'Gabriel Silveira Santos',
    username: '@gabrielsilveira',
    phone: '(48) 98411-2233',
    email: 'gabriel.s@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 45,
    direction: 'sent',
    status: 'pending',
    createdAt: 'Ontem às 18:40',
  },
];

export const useStore = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      currentRole: 'client',
      setRole: (role) => set({ currentRole: role }),
      restaurants: mockRestaurants,
      
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
      notifications: mockNotifications,
      internalReviews: mockInternalReviews,
      clientBookings: mockClientBookings,

      // Friends & Network State
      friends: mockInitialFriends,
      friendInvites: mockInitialFriendInvites,

      sendFriendInvite: (user: UserSearchResult) => {
        const state = get();
        const alreadyFriend = state.friends.some((f) => f.userId === user.id || f.username === user.username);
        if (alreadyFriend) return false;

        const alreadyInvited = state.friendInvites.some((inv) => inv.userId === user.id && inv.status === 'pending');
        if (alreadyInvited) return false;

        const newInvite: FriendInvite = {
          id: `inv_${Date.now()}`,
          userId: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
          avatarUrl: user.avatarUrl,
          loopsBalance: user.loopsBalance,
          direction: 'sent',
          status: 'pending',
          createdAt: 'Agora mesmo',
        };

        set((s) => ({ friendInvites: [newInvite, ...s.friendInvites] }));
        return true;
      },

      acceptFriendInvite: (inviteId: string) => {
        const state = get();
        const invite = state.friendInvites.find((inv) => inv.id === inviteId);
        if (!invite) return;

        const newFriend: Friend = {
          id: `fr_${Date.now()}`,
          userId: invite.userId,
          name: invite.name,
          username: invite.username,
          phone: invite.phone,
          email: invite.email,
          avatarUrl: invite.avatarUrl,
          loopsBalance: invite.loopsBalance,
          since: 'Conectado agora',
          status: 'accepted',
        };

        set((s) => ({
          friends: [newFriend, ...s.friends],
          friendInvites: s.friendInvites.filter((inv) => inv.id !== inviteId),
        }));
      },

      rejectFriendInvite: (inviteId: string) => {
        set((s) => ({
          friendInvites: s.friendInvites.filter((inv) => inv.id !== inviteId),
        }));
      },

      removeFriend: (friendId: string) => {
        set((s) => ({
          friends: s.friends.filter((f) => f.id !== friendId),
        }));
      },
      
      createReservation: (reservationData) => {
        const newReservation: Reservation = {
          ...reservationData,
          id: Math.random().toString(36).substring(2, 9),
          status: 'pending'
        };
        const restaurant = get().restaurants.find((item) => item.id === reservationData.restaurantId);
        const newClientBooking: ClientBooking = {
          id: newReservation.id,
          partnerType: PartnerType.RESTAURANT,
          partnerId: reservationData.restaurantId,
          partnerName: reservationData.restaurantName || restaurant?.nome || 'Restaurante Loopis',
          productName: 'Reserva de mesa',
          neighborhood: restaurant?.location || 'Florianópolis',
          imageUrl: restaurant?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=900',
          date: reservationData.date,
          time: reservationData.time,
          quantity: reservationData.guests,
          quantityLabel: 'pessoas',
          status: 'confirmed',
          paymentStatus: 'pay_at_venue',
          total: 0,
          loopsUsed: 0,
          loopsEarned: 0,
        };
        set((state) => ({ activeReservation: newReservation, clientBookings: [newClientBooking, ...state.clientBookings] }));
        
        setTimeout(() => {
          const currentRes = get().activeReservation;
          if (currentRes && currentRes.id === newReservation.id && currentRes.status === 'pending') {
            get().updateReservationStatus('confirmed');
          }
        }, 2000);
      },
      
      updateReservationStatus: (status) => set((state) => {
        const activeReservation = state.activeReservation ? { ...state.activeReservation, status } : null;
        const bookingStatus: ClientBookingStatus | null =
          status === 'confirmed' || status === 'checked_in' || status === 'completed' || status === 'cancelled'
            ? status
            : null;
        return {
          activeReservation,
          clientBookings: bookingStatus && activeReservation
            ? state.clientBookings.map((booking) => booking.id === activeReservation.id ? { ...booking, status: bookingStatus } : booking)
            : state.clientBookings,
        };
      }),
      
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

      completeClientPayment: (description, loopsUsed, loopsEarned) => {
        const normalizedUsed = Math.max(0, Math.floor(loopsUsed));
        const normalizedEarned = Math.max(0, Math.floor(loopsEarned));
        if (normalizedUsed > get().loopsBalance) return false;

        set((state) => {
          const entries: Transaction[] = [];
          if (normalizedUsed > 0) {
            entries.push({
              id: `payment-loops-${Date.now()}`,
              date: new Date().toISOString(),
              amount: -normalizedUsed,
              type: 'redeem',
              description: `Loops usados: ${description}`,
            });
          }
          if (normalizedEarned > 0) {
            entries.push({
              id: `payment-cashback-${Date.now()}`,
              date: new Date().toISOString(),
              amount: normalizedEarned,
              type: 'earn',
              description: `Cashback: ${description}`,
            });
          }

          return {
            loopsBalance: state.loopsBalance - normalizedUsed + normalizedEarned,
            transactions: [...entries, ...state.transactions],
          };
        });
        return true;
      },

      markNotificationRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        ),
      })),

      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
      })),

      submitReview: (notificationId, rating, comment) => {
        const notification = get().notifications.find((item) => item.id === notificationId);
        if (!notification || notification.reviewId || rating < 1 || rating > 5 || !comment.trim()) return null;

        const reviewId = `review-${Date.now()}`;
        const review: InternalReview = {
          id: reviewId,
          notificationId,
          partnerId: notification.partnerId,
          partnerName: notification.partnerName,
          experienceId: notification.experienceId,
          experienceName: notification.experienceName,
          userName: 'Você',
          rating,
          comment: comment.trim(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          internalReviews: [review, ...state.internalReviews],
          notifications: state.notifications.map((item) =>
            item.id === notificationId ? { ...item, read: true, reviewId } : item
          ),
        }));

        return reviewId;
      },

      updateClientBookingStatus: (bookingId, status) => set((state) => ({
        clientBookings: state.clientBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        ),
      })),

      // B2B Actions
      b2bReservations: mockB2bReservations,
      
      updateB2bReservationStatus: (id, status) => set((state) => ({
        b2bReservations: state.b2bReservations.map(res => 
          res.id === id ? { ...res, status } : res
        )
      })),
      
      processBilling: (reservationId, amount) => {
        const loopsEarned = Math.floor(amount); // 1 Loop per R$ 1
        
        set((state) => ({
          // Update B2B side
          b2bReservations: state.b2bReservations.map(res => 
            res.id === reservationId ? { ...res, status: 'completed' } : res
          ),
          // Update Client side (Simulating client getting the loops)
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

        // Mock pushing to active restaurants feed
        const newRestaurant: Restaurante = {
          id: `rest_${id}`,
          nome: request.name,
          location: 'Florianópolis', // simplified
          endereco: request.address,
          promotion: 'Novo Parceiro! Ganhe Loops',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
          rating: 5.0,
          categoria: request.category,
          distance: '0 km',
          horarioFuncionamento: 'A definir',
          fotosGaleria: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'],
          fotosMenu: [], status: 'aprovado', avaliacoesGoogle: []
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
      merge: (persistedState: unknown, currentState: AppState): AppState => {
        const persisted = persistedState as Partial<AppState> | undefined;
        const persistedRestaurants = persisted?.restaurants || [];
        const mergedRestaurants = [...currentState.restaurants];
        persistedRestaurants.forEach((pr) => {
          if (!mergedRestaurants.some((r) => r.id === pr.id)) {
            mergedRestaurants.push(pr);
          }
        });
        return {
          ...currentState,
          ...persisted,
          restaurants: mergedRestaurants,
        };
      },
    }
  )
);
