"use client";

import React from "react";
import { InventoryProvider } from "@/lib/store/inventory-context";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/hero/Hero";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import { ServicesSection } from "@/components/services/ServicesSection";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { FaqSection } from "@/components/faq/FaqSection";
import { AboutSection } from "@/components/about/AboutSection";
import { LocationSection } from "@/components/location/LocationSection";
import { Footer } from "@/components/layout/Footer";
import { VehicleDetailModal } from "@/components/vehicles/VehicleDetailModal";
import { InquiryModal } from "@/components/forms/InquiryModal";
import { AppointmentModal } from "@/components/forms/AppointmentModal";
import RentalBookingModal from "@/components/booking/RentalBookingModal";
import { AdminDrawer } from "@/components/admin/AdminDrawer";
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: "TITAN CAR - Location de Véhicules Récents",
    description: "Location de véhicules récents, citadines, berlines, SUV et Mercedes Classe G à Boufarik (Blida) et livraison 24/7 à l'Aéroport d'Alger Houari Boumediene.",
    url: "https://titancar.dz",
    telephone: "+213 550 00 00 00",
    priceRange: "4800 DZD - 45000 DZD / jour",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boulevard Principal",
      addressLocality: "Boufarik",
      addressRegion: "Blida",
      addressCountry: "DZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.5744,
      longitude: 2.9133,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "38",
    },
  };

  return (
    <InventoryProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-[#111111] text-[#E8E8E8] antialiased selection:bg-[#EF4444] selection:text-[#FFFFFF]">
        {/* Navigation Header */}
        <Header />

        {/* Main Automotive Single Website Experience */}
        <main className="flex-1">
          {/* 1. Hero Section with Full Viewport Background & Action Buttons */}
          <Hero />

          {/* 2. Primary Commercial Surface: Cars Listing with Descriptions & Specifications */}
          <VehicleGrid />

          {/* 3. Verified Automotive Services & Airport Delivery */}
          <ServicesSection />

          {/* 4. Real Verified Customer Reviews & Google Rating (4.9/5) */}
          <ReviewsSection />

          {/* 5. Frequently Asked Questions (Algerian rental context) */}
          <FaqSection />

          {/* 6. About TITAN CAR (Factual Narrative) */}
          <AboutSection />

          {/* 7. Location, Google Maps, Aéroport d'Alger & Agency Hours */}
          <LocationSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Overlays, Modals & Floating WhatsApp FAB */}
        <VehicleDetailModal />
        <RentalBookingModal />
        <InquiryModal />
        <AppointmentModal />
        <AdminDrawer />
        <WhatsAppFloatingButton />
      </div>
    </InventoryProvider>
  );
}
