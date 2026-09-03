import { PartnerType } from './partner';
import type { LinkedRestaurantOption, LinkedRentalOption } from './guest';

export const ExperiencePrimaryAction = {
  RESERVATION: 'RESERVATION',
  SLOT_BOOKING: 'SLOT_BOOKING',
  TICKET_PURCHASE: 'TICKET_PURCHASE',
} as const;

export type ExperiencePrimaryAction =
  (typeof ExperiencePrimaryAction)[keyof typeof ExperiencePrimaryAction];

export interface ExperienceBaseDetail {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  subtitle?: string;
  description: string;
  neighborhood: string;
  address: string;
  imageUrl: string;
  galleryUrls?: string[];
  priceFrom: number;
  cashbackPercent: number;
  loopsRedeemCost?: number;
  tags?: string[];
  linkedRestaurants?: LinkedRestaurantOption[];
  linkedRentals?: LinkedRentalOption[];
}

export interface RestaurantExperienceDetail extends ExperienceBaseDetail {
  partner_type: typeof PartnerType.RESTAURANT;
  primaryAction: typeof ExperiencePrimaryAction.RESERVATION;
  reservation: {
    acceptsPartySize: true;
    minGuests: number;
    maxGuests: number;
    availableTimes: string[];
  };
}

export interface TourExperienceDetail extends ExperienceBaseDetail {
  partner_type: typeof PartnerType.TOUR;
  primaryAction: typeof ExperiencePrimaryAction.SLOT_BOOKING;
  slotBooking: {
    durationMinutes: number;
    departureTimes: string[];
    maxCapacityPerSlot: number;
    meetingPointLabel: string;
  };
}

export interface EventExperienceDetail extends ExperienceBaseDetail {
  partner_type: typeof PartnerType.EVENT;
  primaryAction: typeof ExperiencePrimaryAction.TICKET_PURCHASE;
  ticketPurchase: {
    startsAt: string;
    gateOpensAt: string;
    ageRating: 'free' | '10' | '12' | '14' | '16' | '18';
    ticketLots: Array<{
      id: string;
      name: string;
      price: number;
      availableQuantity: number;
    }>;
  };
}

export interface RentalExperienceDetail extends ExperienceBaseDetail {
  partner_type: typeof PartnerType.RENTAL;
  primaryAction: typeof ExperiencePrimaryAction.SLOT_BOOKING;
  slotBooking: {
    minimumRentalHours: number;
    availableUnits: number;
    requiresSecurityDeposit: boolean;
  };
}

export type ExperienceDetail =
  | RestaurantExperienceDetail
  | TourExperienceDetail
  | EventExperienceDetail
  | RentalExperienceDetail;

export type Experience = ExperienceDetail;

export const isReservationExperience = (
  experience: ExperienceDetail,
): experience is RestaurantExperienceDetail =>
  experience.primaryAction === ExperiencePrimaryAction.RESERVATION;

export const isSlotBookingExperience = (
  experience: ExperienceDetail,
): experience is TourExperienceDetail | RentalExperienceDetail =>
  experience.primaryAction === ExperiencePrimaryAction.SLOT_BOOKING;

export const isTicketPurchaseExperience = (
  experience: ExperienceDetail,
): experience is EventExperienceDetail =>
  experience.primaryAction === ExperiencePrimaryAction.TICKET_PURCHASE;
