import { CompanyConfig } from "@/types";

export const TITAN_CAR_TENANT: CompanyConfig = {
  company: {
    id: "titan_car",
    name: "TITAN CAR",
    displayName: "TITAN CAR",
    category: "Location & Vente Automobile Premium",
    country: "Algérie",
    wilaya: "Blida / Alger",
    city: "Boufarik & Aéroport d'Alger",
    address: "Boulevard Principal, Boufarik (Blida) — Livraison Aéroport d'Alger 24/7",
    phone: "+213 550 00 00 00",
    whatsapp: "+213 550 00 00 00",
    email: "contact@titancar.dz",
    openingHours: [
      {
        days: "Lundi - Dimanche (7j/7)",
        hours: "24h/24 (Livraisons Aéroport & Agence)",
      },
    ],
    coordinates: {
      latitude: 36.5744,
      longitude: 2.9133,
    },
  },

  branding: {
    logo: "/logo.svg",
    favicon: "/logo-mark.svg",
    accentColor: "#EF4444",
    fontFamily: "Plus Jakarta Sans, sans-serif",
  },

  services: {
    vehicleSales: true,
    tradeIn: true,
    sourcing: true,
    inspection: true,
    financing: false,
    delivery: true,
    warranty: true,
    afterSales: true,
  },

  localization: {
    defaultLanguage: "fr",
    supportedLanguages: ["fr", "ar"],
    currency: "DZD",
    currencySymbol: "DA",
  },

  socials: {
    facebook: "https://www.facebook.com/people/TITAN-CARS/61557559393496/?sk=following",
    instagram: "https://instagram.com/titan_car_dz",
    tiktok: null,
    youtube: null,
    whatsapp: "https://wa.me/213550000000",
    googleMaps: "https://maps.app.goo.gl/Zwi6PRFG7YErRP92A",
  },

  trust: {
    googleRating: 4.9,
    reviewCount: 38,
  },

  seo: {
    title: "TITAN CAR | Location de Véhicules Récents & Mercedes Classe G à Alger & Boufarik",
    description: "Location de véhicules récents, citadines, berlines, SUV et SUV de prestige chez TITAN CAR. Prise en charge 24/7 à l'Aéroport d'Alger Houari Boumediene.",
    keywords: [
      "TITAN CAR",
      "location voiture Alger",
      "location Mercedes Classe G Alger",
      "location voiture Aeroport Alger",
      "location voiture Boufarik",
      "TITAN CARS"
    ],
  },
};

