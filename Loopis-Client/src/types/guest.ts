export type PartnerMacroCategory =
  | 'Todos'
  | 'Restaurantes & Gastronomia'
  | 'Eventos/Shows'
  | 'Tours/Roteiros'
  | 'Experiências'
  | 'Outros';

export interface GuestRestaurant {
  id: string;
  name: string;
  category: string;
  macroCategory?: PartnerMacroCategory;
  rating: number;
  reviewsCount: number;
  estimatedTime?: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  imageUrl: string;
  logoUrl?: string;
  location: string;
  address: string;
  cashbackPercent: number;
  promotionBadge?: string;
  featuredBadge?: string;
  isPopular?: boolean;
  isWeeklyHighlight?: boolean;
}

export type Restaurant = GuestRestaurant;

export interface AdBanner {
  id: string;
  type: 'hero' | 'interstitial' | 'sponsored';
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  targetUrl?: string;
  ctaText?: string;
  sponsorName?: string;
  gradientColor?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  count?: number;
  imageUrl?: string;
  macroCategory?: PartnerMacroCategory;
}

export interface NeighborhoodInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  badge: string;
  highlights: string[];
  vibe: string;
  partnersCount: number;
  experiencesCount: number;
}

export interface LinkedRestaurantOption {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  location: string;
  imageUrl: string;
  pricePerPerson: number;
  cashbackPercent: number;
  specialBenefit: string;
  scheduleMode: 'client_choice' | 'fixed';
  fixedDateTime?: string;
  availableTimes?: string[];
  description?: string;
}

export interface LinkedRentalOption {
  id: string;
  title: string;
  partnerName: string;
  imageUrl: string;
  price: number;
  unitLabel: string;
  cashbackPercent: number;
  description: string;
  scheduleMode: 'client_choice' | 'fixed';
  fixedDateTime?: string;
  availableSlots?: string[];
}

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  partnerId: string;
  partnerName: string;
  macroCategory: PartnerMacroCategory;
  type: 'Gastronomia' | 'Sunset & Drinks' | 'Tour & Roteiro' | 'Harmonização' | 'Aventura & Mar' | 'Romântico' | 'Workshop & Aula' | 'Show & Evento';
  neighborhood: string;
  address: string;
  imageUrl: string;
  galleryUrls?: string[];
  duration: string;
  rating: number;
  reviewsCount: number;
  price: number;
  cashbackPercent: number;
  loopsRedeemCost: number;
  badges?: string[];
  includedItems: string[];
  description: string;
  scheduleInfo: string;
  maxParticipants?: number;
  linkedRestaurants?: LinkedRestaurantOption[];
  linkedRentals?: LinkedRentalOption[];
}

export interface AuthModalState {
  isOpen: boolean;
  selectedRestaurant: GuestRestaurant | null;
  initialMode: 'login' | 'register';
  triggerSource: 'card_click' | 'header_login' | 'header_register' | 'banner_click';
}

