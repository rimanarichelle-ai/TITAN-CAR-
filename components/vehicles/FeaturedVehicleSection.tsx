"use client";

import React from "react";
import Image from "next/image";
import { useInventory } from "@/lib/store/inventory-context";
import { Button } from "@/components/ui/Button";
import { formatVehicleImageUrl } from "@/lib/utils";
import {
  Sparkles,
  Gauge,
  Users,
  Tag,
  ShieldCheck,
  Calendar,
  Fuel,
  Info,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";

export function FeaturedVehicleSection() {
  const { vehicles, openRentalBookingModal, setSelectedVehicle, trackEvent } = useInventory();

  // Try to find matching vehicle or provide high-end featured vehicle details
  const starVehicle = vehicles.find((v) => v.id === "veh_titan_coolray" || v.brand.toLowerCase().includes("geely")) || vehicles[0];

  const handleRentClick = () => {
    trackEvent("booking_started", starVehicle?.id, "star_agency_section");
    openRentalBookingModal(starVehicle);
  };

  const handleViewDetailsClick = () => {
    trackEvent("vehicle_view", starVehicle?.id, "star_agency_section");
    if (starVehicle) {
      setSelectedVehicle(starVehicle);
    }
  };

  return (
    <section className="relative bg-gray-50 border-y border-gray-200/80 py-16 md:py-24 text-gray-900 overflow-hidden" id="star-vehicle">
      
      {/* Decorative Subtle Background Gradients */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-100/60 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-red-100/40 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-bold rounded-full shadow-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Sélection Coup de Cœur 2024</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Découvrez Notre Véhicule Star
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Confort absolu, finitions haut de gamme et plaisir de conduite exceptionnel sur toutes les routes d&apos;Algérie.
          </p>
        </div>

        {/* Responsive Split Layout (Desktop Grid 2 Cols / Mobile Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Image Showcase with Rounded Corners & Soft Shadow */}
          <div className="relative group">
            <div className="relative h-[320px] sm:h-[420px] md:h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 bg-white">
              <Image
                src={formatVehicleImageUrl(starVehicle?.mainImage || "/vehicles/coolray.jpg")}
                alt={`${starVehicle?.brand || "Geely"} ${starVehicle?.model || "Coolray S"} - Star of the Agency`}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Overlay Gradient for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

              {/* Price & Status Float Tags */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="bg-emerald-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Disponible Immédiatement
                </span>
                <span className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">
                  Modèle 2024
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-widest">Finition Sport Edition</p>
                  <p className="text-lg sm:text-xl font-bold drop-shadow">Gris Céleste &amp; Calandre Sport</p>
                </div>
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-black text-base shadow-lg border border-red-500/30">
                  12 500 DA <span className="text-xs font-normal opacity-90">/ jour</span>
                </div>
              </div>
            </div>

            {/* Decorative Card Accent */}
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-full h-full border-2 border-blue-500/30 rounded-2xl -z-10 pointer-events-none hidden sm:block" />
          </div>

          {/* Right Column: Text Content, Badges, Specs Grid & Action Buttons */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Highlight Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 border border-amber-300 text-amber-900 text-xs sm:text-sm font-extrabold rounded-full shadow-sm">
              <span>⭐ Star of the Agency</span>
            </div>

            {/* Title & Subheading */}
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Geely Coolray S — Sport Edition (2024)
              </h3>
              <p className="text-sm sm:text-base font-semibold text-blue-600">
                Crossover Dynamique 1.5L Turbo • Boîte Automatique DCT-7
              </p>
            </div>

            {/* Brief Engaging Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Découvrez notre crossover compact de prestige Geely Coolray S en finition Gris Céleste avec toit noir et calandre sport d&apos;origine. Alliant un design futuriste racé, une motorisation vive 177ch et un habitacle connecté à double écran numérique, c&apos;est le véhicule parfait pour vos déplacements en Algérie.
            </p>

            {/* Quick Specs Grid (3 Columns) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
              <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl shadow-sm text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  <Gauge className="w-4 h-4 shrink-0" />
                  <span>Moteur</span>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-slate-900">1.5L Turbo</p>
                <p className="text-[11px] text-slate-500 font-medium">177 CH • BVA 7</p>
              </div>

              <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl shadow-sm text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Places</span>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-slate-900">5 Places</p>
                <p className="text-[11px] text-slate-500 font-medium">Cuir Sport &amp; ISOFIX</p>
              </div>

              <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl shadow-sm text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  <Tag className="w-4 h-4 shrink-0" />
                  <span>Tarif / Jour</span>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-red-600">12 500 DA</p>
                <p className="text-[11px] text-slate-500 font-medium">Kilométrage 250 km/j</p>
              </div>
            </div>

            {/* Feature Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 font-medium pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Livraison Express Aéroport d&apos;Alger 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Toit panoramique ouvrant &amp; caméras 360°</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Système CarPlay &amp; Android Auto sans fil</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Assistance dépannage &amp; assurance toutes risques</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Button
                variant="primary"
                size="lg"
                onClick={handleRentClick}
                icon={<Calendar className="w-5 h-5" />}
                className="justify-center text-base font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                id="btn-rent-star-car"
              >
                Réserver ce Véhicule
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleViewDetailsClick}
                icon={<Info className="w-5 h-5 text-blue-600" />}
                className="justify-center text-base font-bold bg-white hover:bg-gray-100 text-slate-900 border-gray-300"
                id="btn-details-star-car"
              >
                Voir les Détails
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
