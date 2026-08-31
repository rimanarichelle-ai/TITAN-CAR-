"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  Vehicle,
  VehicleFilterState,
  CompanyConfig,
  Lead,
  LeadStatus,
  LeadNote,
  VehicleStatus,
  InquiryType,
  PreferredContact,
  Customer,
  Appointment,
  AppointmentStatus,
  AppointmentType,
  Review,
  FaqItem,
  AnalyticsEvent,
  AppLanguage,
  RentalBooking,
} from "@/types";
import { INITIAL_VEHICLES } from "@/lib/db/mock-vehicles";
import { EL_MOUSSAFIR_TENANT } from "@/config/tenant/el-moussafir";
import { TITAN_CAR_TENANT } from "@/config/tenant/titan-car";
import {
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
  INITIAL_APPOINTMENTS,
  INITIAL_RENTAL_BOOKINGS,
} from "@/lib/db/mock-data";
import { formatVehicleImageUrl } from "@/lib/utils";

interface InventoryContextType {
  // Inventory
  vehicles: Vehicle[];
  tenantConfig: CompanyConfig;
  selectedVehicle: Vehicle | null;
  filterState: VehicleFilterState;
  viewMode: "grid" | "list";
  filteredVehicles: Vehicle[];

  // Modals & Drawers
  isAdminDrawerOpen: boolean;
  activeInquiryVehicle: Vehicle | null;
  isInquiryModalOpen: boolean;
  activeInquiryType: InquiryType;
  isAppointmentModalOpen: boolean;
  activeAppointmentVehicle: Vehicle | null;
  isRentalBookingModalOpen: boolean;
  activeBookingVehicle: Vehicle | null;
  isAiAssistantOpen: boolean;
  aiInitialPrompt: string;

  // CRM & Bookings Data
  rentalBookings: RentalBooking[];
  leads: Lead[];
  customers: Customer[];
  appointments: Appointment[];
  reviews: Review[];
  faqs: FaqItem[];
  analyticsEvents: AnalyticsEvent[];
  language: AppLanguage;

  // Actions: Inventory
  setFilterState: React.Dispatch<React.SetStateAction<VehicleFilterState>>;
  resetFilters: () => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSelectedVehicle: (v: Vehicle | null) => void;
  updateVehicleStatus: (vehicleId: string, newStatus: VehicleStatus) => void;
  addVehicle: (newVehicle: Omit<Vehicle, "id" | "companyId">) => void;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (vehicleId: string) => void;
  toggleFeaturedVehicle: (vehicleId: string) => void;

  // Actions: Tenant & Multi-Tenant White-Label
  updateTenantConfig: (updates: Partial<CompanyConfig>) => void;
  switchTenant: (tenantId: string) => void;

  // Actions: Modals
  setIsAdminDrawerOpen: (open: boolean) => void;
  openInquiryModal: (vehicle?: Vehicle | null, type?: InquiryType) => void;
  closeInquiryModal: () => void;
  openAppointmentModal: (vehicle?: Vehicle | null) => void;
  closeAppointmentModal: () => void;
  openRentalBookingModal: (vehicle?: Vehicle | null) => void;
  closeRentalBookingModal: () => void;
  openAiAssistant: (initialPrompt?: string) => void;
  closeAiAssistant: () => void;

  // Actions: Rental Bookings
  submitRentalBooking: (bookingData: Omit<RentalBooking, "id" | "companyId" | "status" | "createdAt">) => Promise<{ success: boolean; bookingId: string; message: string }>;
  updateRentalBookingStatus: (bookingId: string, status: RentalBooking["status"]) => void;
  deleteRentalBooking: (bookingId: string) => void;
  isVehicleAvailable: (vehicleId: string, startDate: string, endDate: string) => boolean;

  // Actions: Leads CRM
  submitLead: (leadData: {
    fullName: string;
    phone: string;
    email?: string;
    vehicleId?: string;
    vehicleTitle?: string;
    inquiryType: InquiryType;
    message: string;
    preferredContact: PreferredContact;
    campaign?: string;
  }) => Promise<{ success: boolean; message: string }>;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addLeadNote: (leadId: string, noteText: string, author?: string) => void;
  deleteLead: (leadId: string) => void;
  convertLeadToCustomer: (leadId: string) => void;

  // Actions: Customers
  addCustomer: (customerData: Omit<Customer, "id" | "companyId" | "firstContactAt" | "lastContactAt" | "totalInquiries">) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;

  // Actions: Appointments
  scheduleAppointment: (data: {
    customerName: string;
    phone: string;
    email?: string;
    vehicleId?: string;
    vehicleTitle?: string;
    date: string;
    timeSlot: string;
    type: AppointmentType;
    notes?: string;
  }) => Promise<{ success: boolean; message: string }>;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  deleteAppointment: (appointmentId: string) => void;

  // Actions: Reviews
  addReview: (reviewData: Omit<Review, "id" | "companyId" | "date">) => void;
  deleteReview: (reviewId: string) => void;

  // Actions: Analytics & i18n
  trackEvent: (type: AnalyticsEvent["type"], vehicleId?: string, source?: string, utm_campaign?: string) => void;
  setLanguage: (lang: AppLanguage) => void;
}

const defaultFilterState: VehicleFilterState = {
  search: "",
  brand: "ALL",
  status: "ALL",
  fuelType: "ALL",
  transmission: "ALL",
  bodyType: "ALL",
  minYear: undefined,
  maxYear: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  maxMileage: undefined,
  sortBy: "featured",
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  // 1. Tenant Config (defaults to TITAN CAR)
  const [tenantConfig, setTenantConfig] = useState<CompanyConfig>(TITAN_CAR_TENANT);

  // 2. Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // 3. Rental Bookings
  const [rentalBookings, setRentalBookings] = useState<RentalBooking[]>(INITIAL_RENTAL_BOOKINGS);

  // 4. Leads CRM
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  // 5. Customers
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // 6. Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // 7. Reviews & FAQs
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const [faqs] = useState<FaqItem[]>(INITIAL_FAQS);

  // 8. Analytics Events
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  // Hydration state tracking to prevent SSR mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after mount (client-side only, after SSR hydration completes)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedTenant = localStorage.getItem("elmoussafir_tenant_config") || localStorage.getItem("titan_tenant_config");
        if (savedTenant) {
          setTenantConfig(JSON.parse(savedTenant));
        }

        const savedVehicles = localStorage.getItem("titan_vehicles_v30") || localStorage.getItem("elmoussafir_vehicles_v8");
        if (savedVehicles) {
          try {
            const parsed = JSON.parse(savedVehicles) as Vehicle[];
            let sanitized: Vehicle[] = parsed.map((v) => {
              let mainImg = v.mainImage;
              const brandLower = v.brand?.toLowerCase() || "";
              const modelLower = v.model?.toLowerCase() || "";

              if (v.id === "veh_em_03" || (brandLower === "dacia" && modelLower.includes("sandero"))) {
                mainImg = "/vehicles/dacia_sandero.jpg";
              } else if (v.id === "veh_titan_fiat500" || (brandLower === "fiat" && modelLower.includes("500"))) {
                mainImg = "/vehicles/fiat500.jpg";
              } else if (v.id === "veh_titan_clio5" || (brandLower === "renault" && modelLower.includes("clio"))) {
                mainImg = "/vehicles/clio5.jpg";
              } else if (v.id === "veh_titan_sportage" || (brandLower === "kia" && modelLower.includes("sportage"))) {
                mainImg = "/vehicles/sportage.jpg";
              } else if (v.id === "veh_titan_golf8" || (brandLower.includes("volkswagen") && modelLower.includes("golf"))) {
                mainImg = "/vehicles/golf8.jpg";
              } else if (v.id === "veh_titan_gclass" || (brandLower.includes("mercedes") && modelLower.includes("g"))) {
                mainImg = "/vehicles/gclass.jpg";
              } else if (v.id === "veh_titan_tucson" || (brandLower.includes("hyundai") && modelLower.includes("tucson"))) {
                mainImg = "/vehicles/tucson.jpg";
              } else if (v.id === "veh_titan_coolray" || (brandLower.includes("geely") && modelLower.includes("coolray"))) {
                mainImg = "/vehicles/coolray.jpg";
              } else if (v.id === "veh_titan_octavia" || (brandLower.includes("skoda") && modelLower.includes("octavia"))) {
                mainImg = "/vehicles/octavia.jpg";
              } else if (v.id === "veh_titan_ibiza" || (brandLower.includes("seat") && modelLower.includes("ibiza"))) {
                mainImg = "/vehicles/ibiza.jpg";
              }

              const validMainImg = formatVehicleImageUrl(mainImg);
              const rawGallery = (v.gallery && v.gallery.length > 0 ? v.gallery : [validMainImg])
                .filter((img): img is string => Boolean(img) && !img.includes("unsplash.com") && !img.includes("fiat500_mint"))
                .map((img) => formatVehicleImageUrl(img))
                .filter((img, idx, self) => self.indexOf(img) === idx);

              const finalGallery: string[] = rawGallery.length > 0 ? rawGallery : [validMainImg];
              if (!finalGallery.includes(validMainImg)) {
                finalGallery.unshift(validMainImg);
              }

              return {
                ...v,
                mainImage: validMainImg,
                gallery: finalGallery,
              };
            });

            // Ensure Fiat 500 is in the array if missing from older cached storage
            const hasFiat = sanitized.some((v) => v.id === "veh_titan_fiat500" || (v.brand?.toLowerCase() === "fiat" && v.model?.toLowerCase().includes("500")));
            if (!hasFiat) {
              const fiat500Obj = INITIAL_VEHICLES.find((v) => v.id === "veh_titan_fiat500");
              if (fiat500Obj) {
                sanitized = [fiat500Obj, ...sanitized];
              }
            }

            // Ensure Dacia Sandero (veh_em_03) is in the array
            const hasDacia = sanitized.some((v) => v.id === "veh_em_03" || (v.brand?.toLowerCase() === "dacia" && v.model?.toLowerCase().includes("sandero")));
            if (!hasDacia) {
              const daciaObj = INITIAL_VEHICLES.find((v) => v.id === "veh_em_03");
              if (daciaObj) {
                sanitized = [...sanitized, daciaObj];
              }
            }

            setVehicles(sanitized);
          } catch {
            setVehicles(INITIAL_VEHICLES);
          }
        }

        const savedBookings = localStorage.getItem("elmoussafir_rental_bookings");
        if (savedBookings) {
          setRentalBookings(JSON.parse(savedBookings));
        }

        const savedLeads = localStorage.getItem("elmoussafir_leads_v3");
        if (savedLeads) {
          setLeads(JSON.parse(savedLeads));
        }

        const savedCustomers = localStorage.getItem("elmoussafir_customers");
        if (savedCustomers) {
          setCustomers(JSON.parse(savedCustomers));
        }

        const savedAppointments = localStorage.getItem("elmoussafir_appointments");
        if (savedAppointments) {
          setAppointments(JSON.parse(savedAppointments));
        }

        const savedReviews = localStorage.getItem("elmoussafir_reviews");
        if (savedReviews) {
          setReviews(JSON.parse(savedReviews));
        }

        const savedAnalytics = localStorage.getItem("elmoussafir_analytics");
        if (savedAnalytics) {
          setAnalyticsEvents(JSON.parse(savedAnalytics));
        }
      } catch (e) {
        console.error("Error reading initial state from localStorage:", e);
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 9. Language & i18n
  const [language, setLanguageState] = useState<AppLanguage>("fr");

  // Filter & Selection states
  const [filterState, setFilterState] = useState<VehicleFilterState>(defaultFilterState);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Modals state
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [activeInquiryVehicle, setActiveInquiryVehicle] = useState<Vehicle | null>(null);
  const [activeInquiryType, setActiveInquiryType] = useState<InquiryType>("GENERAL");
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [activeAppointmentVehicle, setActiveAppointmentVehicle] = useState<Vehicle | null>(null);
  const [isRentalBookingModalOpen, setIsRentalBookingModalOpen] = useState(false);
  const [activeBookingVehicle, setActiveBookingVehicle] = useState<Vehicle | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState("");

  // Persistence to localStorage (only after initial hydration to prevent overwriting)
  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("titan_vehicles_v30", JSON.stringify(vehicles));
    }
  }, [vehicles, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("elmoussafir_tenant_config", JSON.stringify(tenantConfig));
    }
  }, [tenantConfig, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("elmoussafir_rental_bookings", JSON.stringify(rentalBookings));
    }
  }, [rentalBookings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("elmoussafir_leads_v3", JSON.stringify(leads));
    }
  }, [leads, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("elmoussafir_customers", JSON.stringify(customers));
    }
  }, [customers, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("elmoussafir_appointments", JSON.stringify(appointments));
    }
  }, [appointments, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("elmoussafir_reviews", JSON.stringify(reviews));
    }
  }, [reviews, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("elmoussafir_analytics", JSON.stringify(analyticsEvents.slice(-200)));
    }
  }, [analyticsEvents, isHydrated]);

  // Set document direction for Arabic
  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  }, []);

  // Analytics Tracker
  const trackEvent = useCallback(
    (type: AnalyticsEvent["type"], vehicleId?: string, source = "website", utm_campaign?: string) => {
      const newEvent: AnalyticsEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type,
        vehicleId,
        source,
        utm_campaign,
        timestamp: new Date().toISOString(),
      };
      setAnalyticsEvents((prev) => [newEvent, ...prev]);
    },
    []
  );

  // Multi-tenant Switcher
  const switchTenant = useCallback((tenantId: string) => {
    if (tenantId === "titan_car") {
      setTenantConfig(TITAN_CAR_TENANT);
    } else {
      setTenantConfig(EL_MOUSSAFIR_TENANT);
    }
  }, []);

  // Filter Reset
  const resetFilters = useCallback(() => {
    setFilterState(defaultFilterState);
  }, []);

  // Modals Triggers
  const openInquiryModal = useCallback((vehicle?: Vehicle | null, type: InquiryType = "GENERAL") => {
    setActiveInquiryVehicle(vehicle || null);
    setActiveInquiryType(type);
    setIsInquiryModalOpen(true);
    if (vehicle) trackEvent("offer_viewed", vehicle.id, "inquiry_modal");
  }, [trackEvent]);

  const closeInquiryModal = useCallback(() => {
    setIsInquiryModalOpen(false);
    setActiveInquiryVehicle(null);
  }, []);

  const openAppointmentModal = useCallback((vehicle?: Vehicle | null) => {
    setActiveAppointmentVehicle(vehicle || null);
    setIsAppointmentModalOpen(true);
    if (vehicle) trackEvent("booking_started", vehicle.id, "appointment_modal");
  }, [trackEvent]);

  const closeAppointmentModal = useCallback(() => {
    setIsAppointmentModalOpen(false);
    setActiveAppointmentVehicle(null);
  }, []);

  const openRentalBookingModal = useCallback((vehicle?: Vehicle | null) => {
    setActiveBookingVehicle(vehicle || null);
    setIsRentalBookingModalOpen(true);
    if (vehicle) trackEvent("booking_started", vehicle.id, "rental_booking_modal");
  }, [trackEvent]);

  const closeRentalBookingModal = useCallback(() => {
    setIsRentalBookingModalOpen(false);
    setActiveBookingVehicle(null);
  }, []);

  const openAiAssistant = useCallback((initialPrompt = "") => {
    setAiInitialPrompt(initialPrompt);
    setIsAiAssistantOpen(true);
    trackEvent("ai_assistant_query", undefined, "ai_drawer_open");
  }, [trackEvent]);

  const closeAiAssistant = useCallback(() => {
    setIsAiAssistantOpen(false);
    setAiInitialPrompt("");
  }, []);

  // Check vehicle availability against confirmed bookings
  const isVehicleAvailable = useCallback(
    (vehicleId: string, startDate: string, endDate: string) => {
      const v = vehicles.find((veh) => veh.id === vehicleId);
      if (!v || v.status !== "AVAILABLE") return false;

      const targetStart = new Date(startDate).getTime();
      const targetEnd = new Date(endDate).getTime();

      const hasConflict = rentalBookings.some((booking) => {
        if (booking.vehicleId !== vehicleId) return false;
        if (booking.status === "CANCELLED" || booking.status === "COMPLETED") return false;

        const bStart = new Date(booking.startDate).getTime();
        const bEnd = new Date(booking.endDate).getTime();

        // Conflict if dates overlap
        return targetStart <= bEnd && targetEnd >= bStart;
      });

      return !hasConflict;
    },
    [vehicles, rentalBookings]
  );

  // Submit Rental Booking
  const submitRentalBooking = useCallback(
    async (bookingData: Omit<RentalBooking, "id" | "companyId" | "status" | "createdAt">) => {
      const newBooking: RentalBooking = {
        id: `book_${Date.now()}`,
        companyId: tenantConfig.company.id,
        ...bookingData,
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
      };

      setRentalBookings((prev) => [newBooking, ...prev]);

      // Automatically create or update customer
      setCustomers((prev) => {
        const existing = prev.find((c) => c.phone === bookingData.phone);
        if (existing) {
          return prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  fullName: bookingData.customerName || c.fullName,
                  email: bookingData.email || c.email,
                  lastContactAt: new Date().toISOString(),
                  totalInquiries: c.totalInquiries + 1,
                  status: "CUSTOMER",
                }
              : c
          );
        } else {
          const newCust: Customer = {
            id: `cust_${Date.now()}`,
            companyId: tenantConfig.company.id,
            fullName: bookingData.customerName,
            phone: bookingData.phone,
            whatsapp: bookingData.phone,
            email: bookingData.email,
            notes: `Réservation en ligne : ${bookingData.vehicleTitle} (${bookingData.days} jours)`,
            firstContactAt: new Date().toISOString(),
            lastContactAt: new Date().toISOString(),
            totalInquiries: 1,
            status: "CUSTOMER",
          };
          return [newCust, ...prev];
        }
      });

      trackEvent("booking_submitted", bookingData.vehicleId, bookingData.source || "online_booking", bookingData.campaign);

      return {
        success: true,
        bookingId: newBooking.id,
        message: "Votre demande de réservation a été enregistrée avec succès.",
      };
    },
    [tenantConfig.company.id, trackEvent]
  );

  const updateRentalBookingStatus = useCallback((bookingId: string, status: RentalBooking["status"]) => {
    setRentalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  }, []);

  const deleteRentalBooking = useCallback((bookingId: string) => {
    setRentalBookings((prev) => prev.filter((b) => b.id !== bookingId));
  }, []);

  // Submit Lead
  const submitLead = useCallback(
    async (leadData: {
      fullName: string;
      phone: string;
      email?: string;
      vehicleId?: string;
      vehicleTitle?: string;
      inquiryType: InquiryType;
      message: string;
      preferredContact: PreferredContact;
      campaign?: string;
    }) => {
      const newLead: Lead = {
        id: `lead_${Date.now()}`,
        companyId: tenantConfig.company.id,
        ...leadData,
        source: leadData.campaign || "site_web",
        status: "NEW",
        notes: [],
        createdAt: new Date().toISOString(),
      };

      setLeads((prev) => [newLead, ...prev]);

      // Add or update customer directory
      setCustomers((prev) => {
        const existing = prev.find((c) => c.phone === leadData.phone);
        if (existing) {
          return prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  fullName: leadData.fullName || c.fullName,
                  email: leadData.email || c.email,
                  lastContactAt: new Date().toISOString(),
                  totalInquiries: c.totalInquiries + 1,
                }
              : c
          );
        } else {
          const newCust: Customer = {
            id: `cust_${Date.now()}`,
            companyId: tenantConfig.company.id,
            fullName: leadData.fullName,
            phone: leadData.phone,
            whatsapp: leadData.preferredContact === "WHATSAPP" ? leadData.phone : undefined,
            email: leadData.email,
            firstContactAt: new Date().toISOString(),
            lastContactAt: new Date().toISOString(),
            totalInquiries: 1,
            status: "PROSPECT",
          };
          return [newCust, ...prev];
        }
      });

      trackEvent("lead_submit", leadData.vehicleId, "inquiry_form", leadData.campaign);

      return {
        success: true,
        message: "Votre message a bien été envoyé. Notre équipe vous recontactera rapidement.",
      };
    },
    [tenantConfig.company.id, trackEvent]
  );

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status,
              updatedAt: new Date().toISOString(),
            }
          : lead
      )
    );
  }, []);

  const addLeadNote = useCallback((leadId: string, noteText: string, author = "Équipe Commerciale") => {
    const newNote: LeadNote = {
      id: `note_${Date.now()}`,
      author,
      text: noteText,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              notes: [...(lead.notes || []), newNote],
              updatedAt: new Date().toISOString(),
            }
          : lead
      )
    );
  }, []);

  const deleteLead = useCallback((leadId: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  }, []);

  const convertLeadToCustomer = useCallback((leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setCustomers((prev) => {
      const exists = prev.find((c) => c.phone === lead.phone);
      if (exists) {
        return prev.map((c) =>
          c.id === exists.id ? { ...c, status: "CUSTOMER" as const } : c
        );
      } else {
        const newCust: Customer = {
          id: `cust_${Date.now()}`,
          companyId: tenantConfig.company.id,
          fullName: lead.fullName,
          phone: lead.phone,
          email: lead.email,
          firstContactAt: lead.createdAt,
          lastContactAt: new Date().toISOString(),
          totalInquiries: 1,
          status: "CUSTOMER",
        };
        return [newCust, ...prev];
      }
    });

    updateLeadStatus(leadId, "SOLD");
  }, [leads, tenantConfig.company.id, updateLeadStatus]);

  // Actions: Customers
  const addCustomer = useCallback(
    (data: Omit<Customer, "id" | "companyId" | "firstContactAt" | "lastContactAt" | "totalInquiries">) => {
      const newCust: Customer = {
        id: `cust_${Date.now()}`,
        companyId: tenantConfig.company.id,
        ...data,
        firstContactAt: new Date().toISOString(),
        lastContactAt: new Date().toISOString(),
        totalInquiries: 0,
      };
      setCustomers((prev) => [newCust, ...prev]);
    },
    [tenantConfig.company.id]
  );

  const updateCustomer = useCallback((customerId: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCustomer = useCallback((customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  }, []);

  // Actions: Appointments
  const scheduleAppointment = useCallback(
    async (data: {
      customerName: string;
      phone: string;
      email?: string;
      vehicleId?: string;
      vehicleTitle?: string;
      date: string;
      timeSlot: string;
      type: AppointmentType;
      notes?: string;
    }) => {
      const newApt: Appointment = {
        id: `apt_${Date.now()}`,
        companyId: tenantConfig.company.id,
        ...data,
        status: "REQUESTED",
        createdAt: new Date().toISOString(),
      };
      setAppointments((prev) => [newApt, ...prev]);
      trackEvent("appointment_submit", data.vehicleId, "appointment_modal");

      return {
        success: true,
        message: "Votre rendez-vous a bien été enregistré. Nous vous attendons avec plaisir.",
      };
    },
    [tenantConfig.company.id, trackEvent]
  );

  const updateAppointmentStatus = useCallback((appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
    );
  }, []);

  const deleteAppointment = useCallback((appointmentId: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
  }, []);

  // Actions: Reviews
  const addReview = useCallback(
    (reviewData: Omit<Review, "id" | "companyId" | "date">) => {
      const newRev: Review = {
        id: `rev_${Date.now()}`,
        companyId: tenantConfig.company.id,
        ...reviewData,
        date: new Date().toISOString().split("T")[0],
      };
      setReviews((prev) => [newRev, ...prev]);
    },
    [tenantConfig.company.id]
  );

  const deleteReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, []);

  // Actions: Vehicles CRUD
  const updateVehicleStatus = useCallback((vehicleId: string, newStatus: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, status: newStatus, updatedAt: new Date().toISOString() }
          : v
      )
    );
  }, []);

  const addVehicle = useCallback(
    (newVehicleData: Omit<Vehicle, "id" | "companyId">) => {
      const newVehicle: Vehicle = {
        id: `veh_${Date.now()}`,
        companyId: tenantConfig.company.id,
        ...newVehicleData,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVehicles((prev) => [newVehicle, ...prev]);
    },
    [tenantConfig.company.id]
  );

  const updateVehicle = useCallback((vehicleId: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, ...updates, updatedAt: new Date().toISOString() }
          : v
      )
    );
  }, []);

  const deleteVehicle = useCallback((vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  }, []);

  const toggleFeaturedVehicle = useCallback((vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, featured: !v.featured } : v))
    );
  }, []);

  const updateTenantConfig = useCallback((updates: Partial<CompanyConfig>) => {
    setTenantConfig((prev) => ({
      ...prev,
      ...updates,
      company: { ...prev.company, ...(updates.company || {}) },
      branding: { ...prev.branding, ...(updates.branding || {}) },
      services: { ...prev.services, ...(updates.services || {}) },
      socials: { ...prev.socials, ...(updates.socials || {}) },
      trust: { ...prev.trust, ...(updates.trust || {}) },
      seo: { ...prev.seo, ...(updates.seo || {}) },
    }));
  }, []);

  // Filtered & Sorted vehicles list
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (filterState.search.trim()) {
          const query = filterState.search.toLowerCase().trim();
          const matchTitle = `${v.brand} ${v.model} ${v.version || ""}`.toLowerCase().includes(query);
          const matchDesc = v.description?.toLowerCase().includes(query) || false;
          const matchFuel = v.fuelType?.toLowerCase().includes(query) || false;
          const matchBody = v.bodyType?.toLowerCase().includes(query) || false;
          const matchTrans = v.transmission?.toLowerCase().includes(query) || false;
          const matchFeatures = v.features?.some((f) => f.toLowerCase().includes(query)) || false;
          if (!matchTitle && !matchDesc && !matchFuel && !matchBody && !matchTrans && !matchFeatures) {
            return false;
          }
        }

        if (filterState.brand !== "ALL" && v.brand.toLowerCase() !== filterState.brand.toLowerCase()) {
          return false;
        }

        if (filterState.status !== "ALL" && v.status !== filterState.status) {
          return false;
        }

        if (filterState.fuelType !== "ALL" && v.fuelType !== filterState.fuelType) {
          return false;
        }

        if (filterState.transmission !== "ALL" && v.transmission !== filterState.transmission) {
          return false;
        }

        if (filterState.bodyType !== "ALL" && v.bodyType !== filterState.bodyType) {
          return false;
        }

        if (filterState.minYear && v.year && v.year < filterState.minYear) return false;
        if (filterState.maxYear && v.year && v.year > filterState.maxYear) return false;

        const effectivePrice = v.dailyRate || v.price;
        if (filterState.minPrice && effectivePrice && effectivePrice < filterState.minPrice) return false;
        if (filterState.maxPrice && effectivePrice && effectivePrice > filterState.maxPrice) return false;

        if (filterState.maxMileage && v.mileage && v.mileage > filterState.maxMileage) return false;

        return true;
      })
      .sort((a, b) => {
        if (filterState.sortBy === "featured") {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
        }
        if (filterState.sortBy === "price_asc") {
          const pA = a.dailyRate || a.price || Infinity;
          const pB = b.dailyRate || b.price || Infinity;
          return pA - pB;
        }
        if (filterState.sortBy === "price_desc") {
          const pA = a.dailyRate || a.price || 0;
          const pB = b.dailyRate || b.price || 0;
          return pB - pA;
        }
        if (filterState.sortBy === "mileage_asc") {
          return (a.mileage ?? 0) - (b.mileage ?? 0);
        }
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [vehicles, filterState]);

  return (
    <InventoryContext.Provider
      value={{
        vehicles,
        tenantConfig,
        selectedVehicle,
        filterState,
        viewMode,
        filteredVehicles,
        isAdminDrawerOpen,
        activeInquiryVehicle,
        isInquiryModalOpen,
        activeInquiryType,
        isAppointmentModalOpen,
        activeAppointmentVehicle,
        isRentalBookingModalOpen,
        activeBookingVehicle,
        isAiAssistantOpen,
        aiInitialPrompt,
        rentalBookings,
        leads,
        customers,
        appointments,
        reviews,
        faqs,
        analyticsEvents,
        language,
        setFilterState,
        resetFilters,
        setViewMode,
        setSelectedVehicle,
        updateVehicleStatus,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        toggleFeaturedVehicle,
        updateTenantConfig,
        switchTenant,
        setIsAdminDrawerOpen,
        openInquiryModal,
        closeInquiryModal,
        openAppointmentModal,
        closeAppointmentModal,
        openRentalBookingModal,
        closeRentalBookingModal,
        openAiAssistant,
        closeAiAssistant,
        submitRentalBooking,
        updateRentalBookingStatus,
        deleteRentalBooking,
        isVehicleAvailable,
        submitLead,
        updateLeadStatus,
        addLeadNote,
        deleteLead,
        convertLeadToCustomer,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        scheduleAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        addReview,
        deleteReview,
        trackEvent,
        setLanguage,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
