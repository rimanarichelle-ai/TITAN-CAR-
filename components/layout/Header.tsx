"use client";

import React, { useState } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import {
  Menu,
  X,
  Calendar,
  SlidersHorizontal,
  Globe,
  Sparkles,
  Building2,
  Check,
} from "lucide-react";
import { AppLanguage } from "@/types";
import { Button } from "@/components/ui/Button";
import { TitanLogo } from "@/components/ui/TitanLogo";

export function Header() {
  const {
    tenantConfig,
    setIsAdminDrawerOpen,
    openRentalBookingModal,
    leads,
    rentalBookings,
    language,
    setLanguage,
  } = useInventory();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLanguageChange = (lang: AppLanguage) => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  const totalBadges = leads.length + rentalBookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;

  return (
    <header className="sticky top-0 z-40 bg-[#181818]/95 backdrop-blur-md border-b border-[#303030] text-[#FFFFFF]" id="header">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="#header"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center text-left focus:outline-none group transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 py-1"
          id="brand-logo"
        >
          <TitanLogo variant="horizontal" size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-[13px] font-semibold text-[#B0B0B0]">
          <button
            onClick={() => scrollToSection("inventory")}
            className="px-3 py-1.5 rounded-[6px] hover:text-[#FFFFFF] hover:bg-[#222222] transition-all cursor-pointer relative group active:scale-95"
            id="nav-vehicles"
          >
            <span>Flotte de Véhicules</span>
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EF4444] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </button>

          <button
            onClick={() => scrollToSection("services")}
            className="px-3 py-1.5 rounded-[6px] hover:text-[#FFFFFF] hover:bg-[#222222] transition-all cursor-pointer relative group active:scale-95"
            id="nav-services"
          >
            <span>Services &amp; Aéroport</span>
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EF4444] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </button>

          <button
            onClick={() => scrollToSection("avis-clients")}
            className="px-3 py-1.5 rounded-[6px] hover:text-[#FFFFFF] hover:bg-[#222222] transition-all cursor-pointer relative group active:scale-95"
            id="nav-reviews"
          >
            <span>Avis Clients (4.9/5)</span>
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EF4444] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </button>

          <button
            onClick={() => scrollToSection("faq")}
            className="px-3 py-1.5 rounded-[6px] hover:text-[#FFFFFF] hover:bg-[#222222] transition-all cursor-pointer relative group active:scale-95"
            id="nav-faq"
          >
            <span>FAQ &amp; Conditions</span>
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EF4444] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </button>

          <button
            onClick={() => scrollToSection("location")}
            className="px-3 py-1.5 rounded-[6px] hover:text-[#FFFFFF] hover:bg-[#222222] transition-all cursor-pointer relative group active:scale-95"
            id="nav-location"
          >
            <span>Agence &amp; Contact</span>
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EF4444] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </button>
        </nav>

        {/* Header Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              icon={<Globe className="w-3.5 h-3.5 text-[#8A8A8A]" />}
              title="Changer de langue"
            >
              <span>{language.toUpperCase()}</span>
            </Button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-1.5 w-32 bg-[#181818] border border-[#303030] rounded-[8px] shadow-2xl py-1 z-50">
                <button
                  onClick={() => handleLanguageChange("fr")}
                  className={`w-full px-3 py-1.5 text-left text-[12px] flex items-center justify-between hover:bg-[#222222] cursor-pointer transition-colors ${
                    language === "fr" ? "font-black text-[#EF4444]" : "text-[#E8E8E8]"
                  }`}
                >
                  <span>Français</span>
                  {language === "fr" && <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full" />}
                </button>
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className={`w-full px-3 py-1.5 text-left text-[12px] flex items-center justify-between hover:bg-[#222222] cursor-pointer transition-colors ${
                    language === "ar" ? "font-black text-[#EF4444]" : "text-[#E8E8E8]"
                  }`}
                >
                  <span>العربية</span>
                  {language === "ar" && <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full" />}
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`w-full px-3 py-1.5 text-left text-[12px] flex items-center justify-between hover:bg-[#222222] cursor-pointer transition-colors ${
                    language === "en" ? "font-black text-[#EF4444]" : "text-[#E8E8E8]"
                  }`}
                >
                  <span>English</span>
                  {language === "en" && <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full" />}
                </button>
              </div>
            )}
          </div>

          {/* CRM Console Trigger */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdminDrawerOpen(true)}
            icon={<SlidersHorizontal className="w-3.5 h-3.5 text-[#EF4444]" />}
            title="Console d'Administration"
            id="btn-admin-drawer"
          >
            <span>Gestion</span>
            {totalBadges > 0 && (
              <span className="px-1.5 py-0.2 bg-[#EF4444] text-[#FFFFFF] text-[10px] font-black rounded-full ml-1 shadow-sm">
                {totalBadges}
              </span>
            )}
          </Button>

          {/* Primary CTA: Réserver un véhicule */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => openRentalBookingModal()}
            icon={<Calendar className="w-3.5 h-3.5" />}
            id="btn-book-header"
          >
            Réserver
          </Button>
        </div>

        {/* Mobile menu buttons */}
        <div className="flex sm:hidden items-center gap-1.5">
          <Button
            variant="primary"
            size="xs"
            onClick={() => openRentalBookingModal()}
            icon={<Calendar className="w-3.5 h-3.5" />}
          >
            Réserver
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsAdminDrawerOpen(true)}
            title="CRM"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#EF4444]" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            id="btn-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#303030] bg-[#181818] px-4 py-4 space-y-3">
          <button
            onClick={() => scrollToSection("inventory")}
            className="w-full text-left py-2.5 text-[14px] font-bold text-[#FFFFFF] border-b border-[#303030] hover:text-[#EF4444] transition-colors"
          >
            Flotte de Véhicules Disponibles
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="w-full text-left py-2.5 text-[14px] font-bold text-[#FFFFFF] border-b border-[#303030] hover:text-[#EF4444] transition-colors"
          >
            Services &amp; Navette Aéroport 24/7
          </button>
          <button
            onClick={() => scrollToSection("avis-clients")}
            className="w-full text-left py-2.5 text-[14px] font-bold text-[#FFFFFF] border-b border-[#303030] hover:text-[#EF4444] transition-colors"
          >
            Avis Clients Vérifiés (4.9/5)
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="w-full text-left py-2.5 text-[14px] font-bold text-[#FFFFFF] border-b border-[#303030] hover:text-[#EF4444] transition-colors"
          >
            Conditions &amp; FAQ
          </button>
          <button
            onClick={() => scrollToSection("location")}
            className="w-full text-left py-2.5 text-[14px] font-bold text-[#FFFFFF] border-b border-[#303030] hover:text-[#EF4444] transition-colors"
          >
            Agence Boufarik / Contact
          </button>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                openRentalBookingModal();
              }}
              icon={<Calendar className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Réserver Immédiatement
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
