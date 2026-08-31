"use client";

import React, { useState } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { Search, Car, MapPin, Star, ArrowRight, ShieldCheck, Calendar, Sparkles, Plane, Zap, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const {
    tenantConfig,
    setFilterState,
    vehicles,
    openRentalBookingModal,
    setSelectedVehicle,
    trackEvent,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterState((prev) => ({ ...prev, search: searchQuery }));
    trackEvent("filter_used", undefined, "hero_search_bar");
    const inventorySection = document.getElementById("inventory");
    if (inventorySection) {
      inventorySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const availableCount = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const gClassVehicle = vehicles.find((v) => v.id === "veh_titan_gclass") || vehicles[0];

  return (
    <section
      className="relative min-h-screen w-full bg-[url('/image_bf2ade.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center border-b border-[#303030] py-16 px-4 sm:px-6 lg:px-8 text-[#FFFFFF] overflow-hidden"
      id="hero-section"
    >
      {/* Dark Overlay (lightened for background visibility with soft gradient for text legibility) */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/20 to-black/40 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/15 to-[#0A0A0A]/70 z-0" />

      {/* Main Centered Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-8 my-auto">
        
        {/* Top Location & Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          <div className="inline-flex items-center gap-2 bg-[#181818]/90 backdrop-blur-md border border-[#3A3A3A] px-4 py-2 rounded-full text-[#E8E8E8] shadow-lg">
            <MapPin className="w-4 h-4 text-[#EF4444]" />
            <span className="font-bold text-[#FFFFFF]">
              {tenantConfig.company.city} &amp; Boufarik
            </span>
            <span className="text-[#A0A0A0]">• Livraison Aéroport 24/7</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#181818]/90 backdrop-blur-md border border-[#3A3A3A] px-4 py-2 rounded-full shadow-lg">
            <div className="flex text-[#EF4444]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#EF4444]" />
              ))}
            </div>
            <span className="font-extrabold text-[#FFFFFF]">
              {tenantConfig.trust.googleRating.toFixed(1)} / 5
            </span>
            <span className="text-[#8A8A8A]">({tenantConfig.trust.reviewCount} avis vérifiés)</span>
          </div>
        </div>

        {/* Brand Headline Group */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/80 border border-red-800/60 text-[#EF4444] text-xs font-extrabold rounded-full uppercase tracking-wider shadow-inner">
            <Zap className="w-4 h-4 text-[#EF4444]" />
            <span>TITAN CARS — Flotte Automobile Récente &amp; SUV de Prestige</span>
          </div>

          {/* Main Large Bold Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] drop-shadow-2xl">
            <span className="hero-animated-text">
              L&apos;Excellence Automobile
            </span>{" "}
            <span className="hero-animated-text-accent">
              Sur Mesure
            </span>
          </h1>

          {/* Descriptive Subheadline */}
          <p className="text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-md hero-animated-subtitle">
            Louez des véhicules récents, citadines modernes, berlines grand confort et SUV de prestige. Prise en charge express en agence ou livraison 24h/24 à l&apos;Aéroport d&apos;Alger Houari Boumediene.
          </p>
        </div>

        {/* Quick Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-2xl bg-[#141414]/90 backdrop-blur-xl border border-[#3A3A3A] p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row gap-2.5 shadow-2xl transition-all duration-300 focus-within:border-[#EF4444]/80"
          id="hero-quick-search"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-[#8A8A8A] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par modèle (G-Class, Tucson, Golf 8, Clio 5...)"
              className="w-full h-12 sm:h-13 pl-11 pr-4 bg-[#0D0D0D] border border-[#2D2D2D] rounded-xl text-sm sm:text-base text-white placeholder-[#777777] focus:outline-none focus:border-[#EF4444] transition-colors"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            className="shrink-0 h-12 sm:h-13 px-6 text-base font-bold shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300"
          >
            Rechercher
          </Button>
        </form>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md sm:max-w-none">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              openRentalBookingModal();
              trackEvent("booking_started", undefined, "hero_cta_primary");
            }}
            icon={<Calendar className="w-6 h-6" />}
            id="hero-btn-reserve"
            className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-extrabold shadow-[0_8px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 rounded-xl"
          >
            Réserver un Véhicule
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              trackEvent("fleet_view", undefined, "hero_cta_secondary");
              document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" });
            }}
            icon={<Car className="w-6 h-6 text-[#EF4444]" />}
            id="hero-btn-fleet"
            className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-extrabold bg-[#181818]/90 hover:bg-[#252525] border border-[#3A3A3A] text-white hover:border-[#EF4444] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 rounded-xl"
          >
            Voir la Flotte ({availableCount} disponibles)
          </Button>
        </div>

        {/* Feature Highlights / Assurance Points */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-gray-300 font-medium">
          <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <Plane className="w-4 h-4 text-[#EF4444]" />
            Livraison Aéroport 24h/24 &amp; 7j/7
          </span>
          <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#EF4444]" />
            Assistance &amp; Véhicule de Remplacement
          </span>
          <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-[#EF4444]" />
            Contrat Officiel &amp; Clés en 5 min
          </span>
        </div>

      </div>
    </section>
  );
}
