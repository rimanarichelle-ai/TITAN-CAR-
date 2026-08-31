export type VehicleStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export interface Vehicle {
  id: string;
  companyId: string;

  brand: string;
  model: string;
  version?: string;

  year?: number;
  mileage?: number;

  fuelType?: "Diesel" | "Essence" | "Hybride" | "Électrique" | "GPL" | string;
  transmission?: "Manuelle" | "Automatique" | "Séquentielle" | string;
  engine?: string;
  power?: number; // ch
  fiscalPower?: number; // CV

  doors?: number;
  seats?: number;
  bodyType?: "Berline" | "SUV / 4x4" | "Citadine" | "Break" | "Coupé" | "Pick-up" | "Utilitaire" | string;

  color?: string;
  interiorColor?: string;
  condition?: "Excellent" | "Très bon" | "Neuf" | "Bon état" | string;

  price?: number; // in DZD (purchase price or legacy)
  dailyRate?: number; // in DZD/day for rental (e.g., 5500 DA/jour)
  deposit?: number; // in DZD (caution/garantie)
  minRentalDays?: number; // default 2 or 3 days
  rentalCategory?: "Économique" | "Compacte" | "Berline Confort" | "SUV & 4x4" | "Luxe & VIP" | "Utilitaire" | string;
  availableLocations?: string[];
  currency?: string; // default "DZD"

  status: VehicleStatus;

  location?: string;
  description?: string;

  mainImage?: string;
  gallery: string[];

  videoUrl?: string;

  features: string[]; // List of specific equipment / options

  featured: boolean;

  publishedAt?: string;
  updatedAt?: string;
}

export interface RentalBooking {
  id: string;
  companyId: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage?: string;
  customerName: string;
  phone: string;
  email?: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  days: number;
  dailyRate: number;
  totalPrice: number;
  depositAmount: number;
  pickupLocation: string;
  returnLocation: string;
  options: {
    insuranceComprehensive?: boolean;
    additionalDriver?: boolean;
    babySeat?: boolean;
    gpsNavigation?: boolean;
    airportMeetAndGreet?: boolean;
  };
  notes?: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  source?: string;
  campaign?: string;
  createdAt: string;
}

export interface VehicleFilterState {
  search: string;
  brand: string;
  status: string; // "ALL" | "AVAILABLE" | "RESERVED" | "SOLD"
  fuelType: string;
  transmission: string;
  bodyType: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  maxMileage?: number;
  sortBy: "newest" | "price_asc" | "price_desc" | "mileage_asc" | "featured";
}

export interface CompanyConfig {
  company: {
    id: string;
    name: string;
    displayName: string;
    category: string;
    country: string;
    wilaya: string;
    city: string;
    address?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    openingHours?: {
      days: string;
      hours: string;
    }[] | null;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };

  branding: {
    logo?: string | null;
    favicon?: string | null;
    accentColor: string;
    fontFamily?: string;
  };

  services: {
    vehicleSales: boolean;
    tradeIn?: boolean;
    financing?: boolean;
    sourcing?: boolean;
    delivery?: boolean;
    inspection?: boolean;
    warranty?: boolean;
    afterSales?: boolean;
  };

  localization: {
    defaultLanguage: string;
    supportedLanguages: string[];
    currency: string;
    currencySymbol: string;
  };

  socials: {
    facebook?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    whatsapp?: string | null;
    googleMaps?: string | null;
  };

  trust: {
    googleRating: number;
    reviewCount: number;
  };

  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "VISIT_SCHEDULED"
  | "NEGOTIATION"
  | "SOLD"
  | "LOST";

export type PreferredContact = "WHATSAPP" | "PHONE" | "EMAIL";
export type InquiryType = "VEHICLE" | "PRICE_REQUEST" | "AVAILABILITY" | "VISIT" | "TRADE_IN" | "GENERAL";

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  companyId: string;
  fullName: string;
  phone: string;
  email?: string;
  vehicleId?: string;
  vehicleTitle?: string;
  inquiryType: InquiryType;
  message: string;
  preferredContact: PreferredContact;
  source: string;
  campaign?: string;
  status: LeadStatus;
  notes?: LeadNote[];
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  companyId: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  notes?: string;
  firstContactAt: string;
  lastContactAt: string;
  totalInquiries: number;
  status: "ACTIVE" | "PROSPECT" | "CUSTOMER" | "ARCHIVED";
}

export type AppointmentStatus = "REQUESTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
export type AppointmentType = "SHOWROOM_VISIT" | "TEST_DRIVE" | "VEHICLE_INSPECTION" | "TRADE_IN_VALUATION";

export interface Appointment {
  id: string;
  companyId: string;
  customerName: string;
  phone: string;
  email?: string;
  vehicleId?: string;
  vehicleTitle?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 - 11:00"
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  companyId: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  vehicleModel?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "PURCHASE" | "DOCUMENTS" | "IMPORT_FINANCING" | "SERVICES";
}

export interface AnalyticsEvent {
  id: string;
  type:
    | "page_view"
    | "fleet_view"
    | "vehicle_view"
    | "filter_used"
    | "booking_started"
    | "booking_submitted"
    | "whatsapp_clicked"
    | "call_clicked"
    | "offer_viewed"
    | "offer_clicked"
    | "social_clicked"
    | "lead_submit"
    | "appointment_submit"
    | "ai_assistant_query"
    | "tiktok_landed";
  vehicleId?: string;
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  timestamp: string;
}

export type AppLanguage = "fr" | "ar" | "en";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: string;
  ctaText?: string;
}

