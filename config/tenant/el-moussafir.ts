import { CompanyConfig } from "@/types";

export const EL_MOUSSAFIR_TENANT: CompanyConfig = {
  company: {
    id: "el_moussafir",
    name: "EL MOUSSAFIR CARS",
    displayName: "EL MOUSSAFIR CARS",
    category: "Location de Véhicules & Mobilité Touristique & Professionnelle",
    country: "Algérie",
    wilaya: "Blida",
    city: "Boufarik",
    address: "Boulevard Principal, Centre-Ville, Boufarik, Wilaya de Blida (Service Aéroport d'Alger Houari Boumediene)",
    phone: "+213 550 12 34 56",
    whatsapp: "+213 550 12 34 56",
    email: "contact@elmoussafir-cars.dz",
    openingHours: [
      {
        days: "Samedi - Jeudi",
        hours: "08:00 - 20:00 (Assistance & Navette Aéroport 24h/7j)",
      },
      {
        days: "Vendredi",
        hours: "09:00 - 18:00 (Sur réservation)",
      },
    ],
    coordinates: {
      latitude: 36.5744,
      longitude: 2.9133,
    },
  },

  branding: {
    logo: null,
    favicon: null,
    accentColor: "#C62828", // Brand Red
    fontFamily: "Plus Jakarta Sans, sans-serif",
  },

  services: {
    vehicleSales: false,
    tradeIn: false,
    sourcing: true,
    inspection: true,
    financing: false,
    delivery: true, // Airport & home delivery
    warranty: true,
    afterSales: true,
  },

  localization: {
    defaultLanguage: "fr",
    supportedLanguages: ["fr", "ar", "en"],
    currency: "DZD",
    currencySymbol: "DA",
  },

  socials: {
    facebook: "https://facebook.com/elmoussafircars",
    instagram: "https://instagram.com/elmoussafircars",
    tiktok: "https://tiktok.com/@elmoussafircars",
    youtube: null,
    whatsapp: "https://wa.me/213550123456",
    googleMaps: "https://maps.google.com/?q=Boufarik+Blida+Algeria",
  },

  trust: {
    googleRating: 4.5,
    reviewCount: 16,
  },

  seo: {
    title: "EL MOUSSAFIR CARS | Location de Voiture Boufarik, Blida & Aéroport d'Alger",
    description: "Location de voitures récentes à Boufarik, Blida et Alger. Tarifs transparents, boîte automatique et manuelle, livraison aéroport Houari Boumediene 24/7. Réservation instantanée.",
    keywords: [
      "location voiture Boufarik",
      "location voiture Blida",
      "location voiture Alger",
      "location de voiture Boufarik",
      "location de voiture Blida",
      "car rental Boufarik",
      "car rental Blida",
      "car rental Algeria",
      "location voiture aeroport alger",
      "location voiture automatique algerie"
    ],
  },
};
