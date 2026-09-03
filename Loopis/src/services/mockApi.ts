import type {
  Order,
  Coupon,
  SplitPaymentSession,
  RestaurantBillingSettings,
  UserSearchResult,
  CommercialSimulationResult,
} from '../types';

// Mock Orders Database
const mockOrders: Record<string, Order> = {
  'LOOP-8821': {
    id: 'ord_sintra_8821',
    code: 'LOOP-8821',
    tableNumber: 'Mesa 14 (Salão Principal)',
    restaurantId: 'marisqueira-sintra',
    restaurantName: 'Marisqueira Sintra',
    restaurantLogo: '/images/restaurants/marisqueira-sintra.png',
    serverName: 'Carlos M.',
    createdAt: new Date().toISOString(),
    status: 'open',
    subtotal: 268.00,
    serviceChargePercent: 10,
    serviceChargeAmount: 26.80,
    appliedDiscount: {
      type: 'reservation',
      description: 'Desconto Reserva Loopis (20% Cashback/Abatimento)',
      percentage: 20,
      amount: 53.60,
    },
    totalPayable: 241.20,
    items: [
      {
        id: 'it_1',
        name: 'Sequência de Frutos do Mar Especial',
        category: 'Prato Principal',
        quantity: 1,
        unitPrice: 189.00,
        totalPrice: 189.00,
        notes: 'Sem coentro, ponto tradicional',
      },
      {
        id: 'it_2',
        name: 'Vinho Verde Alvarinho 750ml',
        category: 'Bebidas',
        quantity: 1,
        unitPrice: 55.00,
        totalPrice: 55.00,
      },
      {
        id: 'it_3',
        name: 'Pastéis de Nata Artesanais (Dupla)',
        category: 'Sobremesa',
        quantity: 1,
        unitPrice: 24.00,
        totalPrice: 24.00,
        notes: 'Com canela à parte',
      },
    ],
  },
  'CMD-4091': {
    id: 'ord_ori_4091',
    code: 'CMD-4091',
    tableNumber: 'Mesa 08 (Varanda)',
    restaurantId: 'boteco-ori',
    restaurantName: 'Boteco ORI',
    restaurantLogo: '/images/restaurants/boteco-ori.png',
    serverName: 'Mariana S.',
    createdAt: new Date().toISOString(),
    status: 'open',
    subtotal: 174.50,
    serviceChargePercent: 10,
    serviceChargeAmount: 17.45,
    appliedDiscount: {
      type: 'campaign',
      description: 'Happy Hour Loopis - Chopp em dobro & 15% OFF',
      percentage: 15,
      amount: 26.18,
    },
    totalPayable: 165.77,
    items: [
      {
        id: 'it_10',
        name: 'Porção de Picanha Fatiada no Rechaud',
        category: 'Petiscos',
        quantity: 1,
        unitPrice: 98.00,
        totalPrice: 98.00,
        notes: 'Acompanha farofa de bacon e vinagrete',
      },
      {
        id: 'it_11',
        name: 'Chopp Artesanal IPA 500ml',
        category: 'Chopp & Cervejas',
        quantity: 3,
        unitPrice: 15.50,
        totalPrice: 46.50,
      },
      {
        id: 'it_12',
        name: 'Cestinha de Pastéis Gourmet (6 un)',
        category: 'Entradas',
        quantity: 1,
        unitPrice: 30.00,
        totalPrice: 30.00,
        notes: '3 queijo brie e 3 carne seca',
      },
    ],
  },
  'TIM-1092': {
    id: 'ord_tim_1092',
    code: 'TIM-1092',
    tableNumber: 'Mesa 22 (Deck Lagoa)',
    restaurantId: 'o-timoneiro',
    restaurantName: 'O Timoneiro',
    restaurantLogo: '/images/restaurants/o-timoneiro.jpg',
    serverName: 'Roberto B.',
    createdAt: new Date().toISOString(),
    status: 'open',
    subtotal: 340.00,
    serviceChargePercent: 10,
    serviceChargeAmount: 34.00,
    appliedDiscount: {
      type: 'reservation',
      description: 'Reserva VIP Loopis - 25% Cashback',
      percentage: 25,
      amount: 85.00,
    },
    totalPayable: 289.00,
    items: [
      {
        id: 'it_20',
        name: 'Sequência de Camarão Completa para 2',
        category: 'Especialidades',
        quantity: 1,
        unitPrice: 260.00,
        totalPrice: 260.00,
      },
      {
        id: 'it_21',
        name: 'Caipirinha de Cachaça Premium com Frutas Vermelhas',
        category: 'Drinks',
        quantity: 2,
        unitPrice: 28.00,
        totalPrice: 56.00,
      },
      {
        id: 'it_22',
        name: 'Água Mineral San Pellegrino 500ml',
        category: 'Bebidas',
        quantity: 2,
        unitPrice: 12.00,
        totalPrice: 24.00,
      },
    ],
  },
};

// Mock Coupons
const mockCoupons: Record<string, Coupon> = {
  'LOOP20': {
    code: 'LOOP20',
    description: '20% OFF em toda a comanda no festival gastronômico',
    discountType: 'percentage',
    discountValue: 20,
    expiresAt: '2026-12-31',
    isValid: true,
  },
  'PRIMEIRAVEZ': {
    code: 'PRIMEIRAVEZ',
    description: '10% OFF no seu primeiro pagamento via Loopis',
    discountType: 'percentage',
    discountValue: 10,
    expiresAt: '2026-12-31',
    isValid: true,
  },
  'CORTESIA30': {
    code: 'CORTESIA30',
    description: 'Abatimento fixo de R$ 30,00 concedido pela casa',
    discountType: 'fixed',
    discountValue: 30.00,
    expiresAt: '2026-12-31',
    isValid: true,
  },
  'EXPIRADO': {
    code: 'EXPIRADO',
    description: 'Cupom de Natal 2025',
    discountType: 'percentage',
    discountValue: 25,
    expiresAt: '2025-12-25',
    isValid: false,
    errorMessage: 'Cupom expirado em 25/12/2025.',
  },
};

// Mock Registered Users for Split search
const mockUsersList: UserSearchResult[] = [
  {
    id: 'usr_1',
    name: 'Ana Beatriz Souza',
    username: '@anabeatriz',
    phone: '(48) 99123-4567',
    email: 'ana.souza@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 320,
  },
  {
    id: 'usr_2',
    name: 'Lucas Mendes Prado',
    username: '@lucasmendes',
    phone: '(48) 98877-6655',
    email: 'lucas.prado@yahoo.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 150,
  },
  {
    id: 'usr_3',
    name: 'Camila Fernandes Lima',
    username: '@camilalima',
    phone: '(48) 99654-3210',
    email: 'camila.lima@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 840,
  },
  {
    id: 'usr_4',
    name: 'Gabriel Silveira Santos',
    username: '@gabrielsilveira',
    phone: '(48) 98411-2233',
    email: 'gabriel.s@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 45,
  },
  {
    id: 'usr_5',
    name: 'Mariana Vasconcelos',
    username: '@marivasconcelos',
    phone: '(48) 99988-1122',
    email: 'mari.vasconcelos@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    loopsBalance: 210,
  },
];

// Default Restaurant Commercial Settings Mock
let restaurantBillingSettingsStorage: Record<string, RestaurantBillingSettings> = {
  'marisqueira-sintra': {
    restaurantId: 'marisqueira-sintra',
    restaurantName: 'Marisqueira Sintra',
    hasMonthlyFee: true,
    monthlyFeeAmount: 249.90,
    commissionPercent: 12.5,
    acceptsLoopCredits: true,
    loopConversionRate: 1.0,
    invoiceDueDay: 10,
    bankAccountInfo: {
      bank: 'Banco Itaú (341)',
      accountType: 'corrente',
      agency: '1420',
      accountNumber: '48201-9',
      pixKey: '12.345.678/0001-90',
    },
    updatedAt: new Date().toISOString(),
  },
  'boteco-ori': {
    restaurantId: 'boteco-ori',
    restaurantName: 'Boteco ORI',
    hasMonthlyFee: false,
    monthlyFeeAmount: 0.0,
    commissionPercent: 15.0,
    acceptsLoopCredits: true,
    loopConversionRate: 1.0,
    invoiceDueDay: 15,
    updatedAt: new Date().toISOString(),
  },
};

// In-Memory Split Sessions Cache
const splitSessionsCache: Record<string, SplitPaymentSession> = {};

// Helper delay to simulate real network conditions
const delay = (ms: number = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async fetchOrderReceipt(rawCode: string): Promise<Order> {
    await delay(750);
    const normalized = rawCode.trim().toUpperCase();

    if (normalized === 'CMD-PAGA' || normalized === 'PAGA') {
      const error = new Error('Esta comanda já foi totalmente liquidada e encerrada.');
      (error as any).code = 'ORDER_ALREADY_PAID';
      throw error;
    }

    if (normalized === 'CMD-CANCELADA' || normalized === 'CANCELADA') {
      const error = new Error('Esta comanda foi cancelada pelo restaurante.');
      (error as any).code = 'ORDER_CANCELLED';
      throw error;
    }

    if (normalized === 'CUPOM-EXP' || normalized === 'EXPIRADO') {
      const error = new Error('O cupom/código informado já expirou.');
      (error as any).code = 'COUPON_EXPIRED';
      throw error;
    }

    if (mockOrders[normalized]) {
      return JSON.parse(JSON.stringify(mockOrders[normalized]));
    }

    if (/^(LOOP|CMD)-\d{4}$/.test(normalized)) {
      return {
        id: `ord_${normalized.toLowerCase()}`,
        code: normalized,
        tableNumber: `Mesa ${Math.floor(Math.random() * 20) + 1}`,
        restaurantId: 'marisqueira-sintra',
        restaurantName: 'Marisqueira Sintra',
        restaurantLogo: '/images/restaurants/marisqueira-sintra.png',
        serverName: 'Equipe de Atendimento',
        createdAt: new Date().toISOString(),
        status: 'open',
        subtotal: 220.00,
        serviceChargePercent: 10,
        serviceChargeAmount: 22.00,
        appliedDiscount: {
          type: 'reservation',
          description: 'Benefício Reserva Loopis (15% Cashback)',
          percentage: 15,
          amount: 33.00,
        },
        totalPayable: 209.00,
        items: [
          {
            id: 'dyn_1',
            name: 'Prato do Chef Selecionado',
            category: 'Prato Principal',
            quantity: 1,
            unitPrice: 160.00,
            totalPrice: 160.00,
          },
          {
            id: 'dyn_2',
            name: 'Bebidas e Acompanhamentos',
            category: 'Bebidas',
            quantity: 2,
            unitPrice: 30.00,
            totalPrice: 60.00,
          },
        ],
      };
    }

    const error = new Error('Cupom ou comanda não localizada. Verifique o código e tente novamente.');
    (error as any).code = 'NOT_FOUND';
    throw error;
  },

  async validateCoupon(couponCode: string, _restaurantId?: string): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
    await delay(500);
    const normalized = couponCode.trim().toUpperCase();
    const found = mockCoupons[normalized];

    if (!found) {
      return {
        valid: false,
        error: 'Cupom não encontrado. Verifique a ortografia do código.',
      };
    }

    if (!found.isValid) {
      return {
        valid: false,
        error: found.errorMessage || 'Este cupom não está mais ativo.',
      };
    }

    return {
      valid: true,
      coupon: found,
    };
  },

  async searchUsers(query: string): Promise<UserSearchResult[]> {
    await delay(300);
    if (!query || query.trim().length === 0) {
      return mockUsersList;
    }
    const q = query.toLowerCase().trim();
    return mockUsersList.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  },

  async createOrUpdateSplitSession(session: SplitPaymentSession): Promise<SplitPaymentSession> {
    await delay(400);
    splitSessionsCache[session.id] = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(splitSessionsCache[session.id]));
  },

  async getSplitSession(sessionId: string): Promise<SplitPaymentSession | null> {
    await delay(250);
    const session = splitSessionsCache[sessionId];
    if (!session) return null;
    return JSON.parse(JSON.stringify(session));
  },

  async markParticipantPaid(
    sessionId: string,
    participantId: string,
    paymentMethod: 'pix' | 'credit_card' | 'loop_credits' = 'pix'
  ): Promise<SplitPaymentSession> {
    await delay(500);
    const session = splitSessionsCache[sessionId];
    if (!session) {
      throw new Error('Sessão de divisão de conta não encontrada.');
    }

    session.participants = session.participants.map(p => {
      if (p.id === participantId) {
        return {
          ...p,
          isPaid: true,
          paidAt: new Date().toISOString(),
          paymentMethod,
        };
      }
      return p;
    });

    const totalPaid = session.participants
      .filter(p => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);

    session.totalPaidAmount = Number(totalPaid.toFixed(2));
    session.remainingAmount = Math.max(0, Number((session.finalTotalAmount - totalPaid).toFixed(2)));
    session.progressPercentage = Math.min(100, Math.round((totalPaid / session.finalTotalAmount) * 100));

    if (session.remainingAmount <= 0.01) {
      session.status = 'completed';
    } else if (session.totalPaidAmount > 0) {
      session.status = 'partial';
    }

    session.updatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(session));
  },

  async getRestaurantBillingSettings(restaurantId: string = 'marisqueira-sintra'): Promise<RestaurantBillingSettings> {
    await delay(400);
    const existing = restaurantBillingSettingsStorage[restaurantId];
    if (existing) {
      return JSON.parse(JSON.stringify(existing));
    }

    const fallback: RestaurantBillingSettings = {
      restaurantId,
      restaurantName: 'Restaurante Parceiro Loopis',
      hasMonthlyFee: false,
      monthlyFeeAmount: 0.0,
      commissionPercent: 12.0,
      acceptsLoopCredits: true,
      loopConversionRate: 1.0,
      invoiceDueDay: 10,
      updatedAt: new Date().toISOString(),
    };
    return fallback;
  },

  async saveRestaurantBillingSettings(settings: RestaurantBillingSettings): Promise<{ success: boolean; data: RestaurantBillingSettings }> {
    await delay(650);

    if (settings.hasMonthlyFee && (settings.monthlyFeeAmount === undefined || settings.monthlyFeeAmount < 0)) {
      throw new Error('O valor da mensalidade deve ser maior ou igual a zero.');
    }

    if (settings.commissionPercent === undefined || settings.commissionPercent < 0 || settings.commissionPercent > 100) {
      throw new Error('A comissão deve ser um percentual válido entre 0% e 100%.');
    }

    if (settings.acceptsLoopCredits && (settings.loopConversionRate <= 0)) {
      throw new Error('A taxa de conversão de créditos Loop deve ser maior que zero.');
    }

    const updated: RestaurantBillingSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    restaurantBillingSettingsStorage[settings.restaurantId] = updated;

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updated)),
    };
  },

  calculateCommercialProjection(simulatedGmv: number, settings: RestaurantBillingSettings): CommercialSimulationResult {
    const commissionPercent = settings.commissionPercent || 0;
    const loopisCommissionAmount = (simulatedGmv * commissionPercent) / 100;
    const monthlyFeeTotal = settings.hasMonthlyFee ? (settings.monthlyFeeAmount || 0) : 0;
    const netRestaurantPayout = Math.max(0, simulatedGmv - loopisCommissionAmount - monthlyFeeTotal);
    
    const estimatedCustomerCashbackLoops = settings.acceptsLoopCredits
      ? Math.round(simulatedGmv * (settings.loopConversionRate || 1.0) * 0.1)
      : 0;

    return {
      simulatedGmv,
      loopisCommissionAmount,
      monthlyFeeTotal,
      netRestaurantPayout,
      estimatedCustomerCashbackLoops,
    };
  },
};
