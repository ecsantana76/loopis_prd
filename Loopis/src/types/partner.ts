export const PartnerType = {
  RESTAURANT: 'restaurante',
  TOUR: 'tour',
  EVENT: 'evento',
  RENTAL: 'rental',
} as const;

export type PartnerType = (typeof PartnerType)[keyof typeof PartnerType];

export interface FlorianopolisAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: 'Florianopolis';
  state: 'SC';
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface BankTransferData {
  bankName: string;
  bankCode?: string;
  agency: string;
  accountNumber: string;
  accountDigit?: string;
  accountType: 'checking' | 'savings' | 'payment';
  pixKey?: string;
  documentHolder: string;
}

export interface BasePartnerOnboarding {
  document: string;
  documentType: 'cnpj' | 'cpf';
  legalName: string;
  tradeName: string;
  phone: string;
  address: FlorianopolisAddress;
  photos: string[];
  payoutBankData: BankTransferData;
}

export interface RestaurantOnboardingData {
  tableCount: number;
  acceptsReservations: boolean;
  defaultServiceFeePercent: number;
  orderModel: 'physical' | 'digital';
}

export interface TourOnboardingData {
  meetingPoint: {
    label: string;
    latitude: number;
    longitude: number;
  };
  maxCapacityPerDeparture: number;
  includedItems: string[];
  excludedItems: string[];
  requiresLiabilityWaiver: boolean;
}

export interface EventOnboardingData {
  ageRating: 'free' | '10' | '12' | '14' | '16' | '18';
  totalCapacity: number;
  usesNominalTickets: boolean;
  gateOpeningTimes: string[];
}

export interface RentalOnboardingData {
  availableUnits: number;
  minimumRentalHours: number;
  securityDepositAmount: number;
}

export interface RestaurantPayload {
  partner_type: typeof PartnerType.RESTAURANT;
  restaurant: RestaurantOnboardingData;
}

export interface TourPayload {
  partner_type: typeof PartnerType.TOUR;
  tour: TourOnboardingData;
}

export interface EventPayload {
  partner_type: typeof PartnerType.EVENT;
  event: EventOnboardingData;
}

export interface RentalPayload {
  partner_type: typeof PartnerType.RENTAL;
  rental: RentalOnboardingData;
}

export type PartnerRegistrationPayload = BasePartnerOnboarding & (
  | RestaurantPayload
  | TourPayload
  | EventPayload
  | RentalPayload
);

export const isRestaurantPayload = (
  payload: PartnerRegistrationPayload,
): payload is BasePartnerOnboarding & RestaurantPayload =>
  payload.partner_type === PartnerType.RESTAURANT;

export const isTourPayload = (
  payload: PartnerRegistrationPayload,
): payload is BasePartnerOnboarding & TourPayload =>
  payload.partner_type === PartnerType.TOUR;

export const isEventPayload = (
  payload: PartnerRegistrationPayload,
): payload is BasePartnerOnboarding & EventPayload =>
  payload.partner_type === PartnerType.EVENT;

export const isRentalPayload = (
  payload: PartnerRegistrationPayload,
): payload is BasePartnerOnboarding & RentalPayload =>
  payload.partner_type === PartnerType.RENTAL;
