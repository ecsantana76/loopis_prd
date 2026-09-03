export interface OrderItem {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type OrderStatus = 'open' | 'pending_payment' | 'partially_paid' | 'paid' | 'cancelled';

export interface Order {
  id: string;
  code: string; // Ex: 'LOOP-8821', 'CMD-4091'
  tableNumber?: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string;
  serverName?: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  serviceChargePercent?: number;
  serviceChargeAmount?: number;
  appliedDiscount: {
    type: 'reservation' | 'coupon' | 'campaign';
    description: string;
    percentage?: number;
    amount: number;
  };
  totalPayable: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  expiresAt: string;
  isValid: boolean;
  restaurantId?: string;
  errorMessage?: string;
}

export type ParticipantAssignedType = 'me' | 'app_user' | 'guest';

export interface SplitParticipant {
  id: string;
  name: string;
  assignedType: ParticipantAssignedType;
  phone?: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  amount: number;
  percentage: number;
  isPaid: boolean;
  paidAt?: string;
  paymentMethod?: 'pix' | 'credit_card' | 'loop_credits';
  pixQrCodePayload?: string;
  paymentUrl: string;
}

export type SplitMode = 'full' | 'equal' | 'custom';

export interface SplitPaymentSession {
  id: string;
  orderId: string;
  orderCode: string;
  restaurantId: string;
  restaurantName: string;
  originalSubtotal: number;
  discountAmount: number;
  loopCreditsApplied: number;
  loopDiscountAmount: number;
  finalTotalAmount: number;
  splitMode: SplitMode;
  totalParts: number;
  participants: SplitParticipant[];
  totalPaidAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  status: 'open' | 'partial' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface UserSearchResult {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  avatarUrl: string;
  loopsBalance: number;
}

export interface RestaurantBillingSettings {
  restaurantId: string;
  restaurantName: string;
  hasMonthlyFee: boolean;
  monthlyFeeAmount: number;
  commissionPercent: number;
  acceptsLoopCredits: boolean;
  loopConversionRate: number; // Ex: 1.0 (R$ 1,00 = 1 crédito)
  invoiceDueDay: number;
  bankAccountInfo?: {
    bank: string;
    accountType: 'corrente' | 'poupanca';
    agency: string;
    accountNumber: string;
    pixKey: string;
  };
  updatedAt: string;
}

export interface CommercialSimulationResult {
  simulatedGmv: number;
  loopisCommissionAmount: number;
  monthlyFeeTotal: number;
  netRestaurantPayout: number;
  estimatedCustomerCashbackLoops: number;
}
