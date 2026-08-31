"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { Phone, Mail, MapPin, ExternalLink, Calendar, SlidersHorizontal, Shield } from "lucide-react";
import { TitanLogo } from "@/components/ui/TitanLogo";

export function Footer() {
  const {
    tenantConfig,
    openRentalBookingModal,
    setIsAdminDrawerOpen,
  } = useInventory();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-[#B0B0B0] border-t border-[#303030]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col items-start gap-1">
              <TitanLogo variant="horizontal" size="lg" />
              <div className="text-[11px] text-[#8A8A8A] uppercase font-bold tracking-wider pt-1">
                {tenantConfig.company.category}
              </div>
            </div>

            <p className="text-[13px] text-[#B0B0B0] leading-relaxed max-w-[360px]">
              Location de véhicules récents à Boufarik, Blida et livraison express 24h/7j à l&apos;Aéroport d&apos;Alger Houari Boumediene.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => openRentalBookingModal()}
                className="h-9 px-4 bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#991B1B] text-[#FFFFFF] font-extrabold text-[12px] rounded-[6px] flex items-center gap-1.5 transform hover:scale-105 active:scale-95 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-2px_rgba(220,38,38,0.6)] transition-all duration-200 cursor-pointer border border-[#EF4444]/30"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Réserver un véhicule</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[13px] font-bold text-[#FFFFFF] uppercase tracking-wider">
              Navigation Rapide
            </div>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a href="#inventory" className="hover:text-[#C62828] transition-colors">
                  Flotte de Véhicules Disponibles
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C62828] transition-colors">
                  Navette Aéroport &amp; Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#C62828] transition-colors">
                  À Propos de l&apos;Agence
                </a>
              </li>
              <li>
                <a href="#avis-clients" className="hover:text-[#C62828] transition-colors">
                  Avis &amp; Témoignages
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C62828] transition-colors">
                  Conditions &amp; FAQ
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#C62828] transition-colors">
                  Contact &amp; Agence Boufarik
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[13px] font-bold text-[#FFFFFF] uppercase tracking-wider">
              Coordonnées Agence
            </div>
            <div className="space-y-2.5 text-[13px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C62828] shrink-0 mt-0.5" />
                <span>{tenantConfig.company.address || `${tenantConfig.company.city}, Wilaya de ${tenantConfig.company.wilaya}, Algérie`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C62828] shrink-0" />
                <span>{tenantConfig.company.phone || "+213 550 12 34 56"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C62828] shrink-0" />
                <span>{tenantConfig.company.email || "contact@titancar.dz"}</span>
              </div>
            </div>
          </div>

          {/* SaaS & Socials */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-[13px] font-bold text-[#FFFFFF] uppercase tracking-wider">
              Administration
            </div>
            <div className="space-y-2 text-[13px]">
              <button
                type="button"
                onClick={() => setIsAdminDrawerOpen(true)}
                className="hover:text-[#C62828] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C62828]" />
                <span>Console CRM Agent</span>
              </button>

              {tenantConfig.socials.facebook && (
                <a
                  href={tenantConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C62828] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Facebook</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#303030] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8A8A8A]">
          <div>
            © {currentYear} {tenantConfig.company.name}. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#C62828]" />
              Paiement Sécurisé &amp; Contrat Officiel
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
