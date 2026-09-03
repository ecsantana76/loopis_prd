export interface GuestRestaurant {
  id: string;
  name: string;
  category: string;
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
}

export interface AuthModalState {
  isOpen: boolean;
  selectedRestaurant: GuestRestaurant | null;
  initialMode: 'login' | 'register';
  triggerSource: 'card_click' | 'header_login' | 'header_register' | 'banner_click';
}
