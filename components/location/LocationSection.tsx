"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

export function LocationSection() {
  const { tenantConfig, openAppointmentModal } = useInventory();

  const handleWhatsApp = () => {
    const msg = `Bonjour ${tenantConfig.company.name}, je souhaite obtenir des informations concernant vos véhicules disponibles à ${tenantConfig.company.city}.`;
    const url = buildWhatsAppUrl(tenantConfig.company.whatsapp || tenantConfig.company.phone, msg);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-14 md:py-20 bg-[#181818] border-b border-[#303030]" id="location">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#222222] border border-[#303030] text-[#C62828] text-[12px] font-bold rounded-[6px] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#C62828]" />
            Agence &amp; Prise en charge
          </div>
          <h2 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Contact &amp; Localisation Agence
          </h2>
          <p className="text-[15px] text-[#B0B0B0]">
            Rendez-nous visite à Boufarik ou contactez directement notre équipe commerciale.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-[#111111] border border-[#303030] p-6 sm:p-8 rounded-[8px] space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-[#FFFFFF]">
                {tenantConfig.company.name}
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#222222] border border-[#303030] rounded-[6px] flex items-center justify-center text-[#C62828] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#C62828]" />
                </div>
                <div>
                  <div className="text-[12px] text-[#8A8A8A] uppercase font-semibold">Adresse Principal</div>
                  <div className="text-[14px] text-[#FFFFFF] font-medium mt-0.5">
                    {tenantConfig.company.address || `${tenantConfig.company.city}, Wilaya de ${tenantConfig.company.wilaya}, Algérie`}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#222222] border border-[#303030] rounded-[6px] flex items-center justify-center text-[#C62828] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#C62828]" />
                </div>
                <div>
                  <div className="text-[12px] text-[#8A8A8A] uppercase font-semibold">Téléphone Direct</div>
                  <div className="text-[14px] text-[#FFFFFF] font-medium mt-0.5">
                    {tenantConfig.company.phone || "+213 550 12 34 56"}
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#222222] border border-[#303030] rounded-[6px] flex items-center justify-center text-[#C62828] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#C62828]" />
                </div>
                <div>
                  <div className="text-[12px] text-[#8A8A8A] uppercase font-semibold">Horaires d&apos;Ouverture</div>
                  <div className="text-[13px] text-[#FFFFFF] mt-0.5 space-y-0.5">
                    {tenantConfig.company.openingHours ? (
                      tenantConfig.company.openingHours.map((h, i) => (
                        <div key={i}>
                          <strong className="text-[#C62828]">{h.days}:</strong> {h.hours}
                        </div>
                      ))
                    ) : (
                      <div>Samedi - Jeudi : 08:00 - 20:00 (Navette Aéroport 24/7)</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#303030] flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex-1 h-10 bg-[#222222] hover:bg-[#303030] border border-[#303030] text-[#FFFFFF] font-bold text-[13px] rounded-[6px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Agence</span>
              </button>

              {tenantConfig.socials.googleMaps && (
                <a
                  href={tenantConfig.socials.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-bold text-[13px] rounded-[6px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Itinéraire</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: Map Embed Card */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#303030] rounded-[8px] overflow-hidden flex flex-col min-h-[380px]">
            <div className="p-3 bg-[#181818] border-b border-[#303030] flex items-center justify-between text-[12px] text-[#B0B0B0]">
              <span className="font-semibold text-[#FFFFFF] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C62828]" />
                Aperçu de la Zone d&apos;Intervention ({tenantConfig.company.city} &amp; Aéroport)
              </span>
              {tenantConfig.socials.googleMaps && (
                <a
                  href={tenantConfig.socials.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C62828] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="flex-1 relative bg-[#181818] flex items-center justify-center p-6 text-center">
              <div className="max-w-md space-y-3">
                <div className="w-12 h-12 bg-[#222222] border border-[#303030] rounded-full mx-auto flex items-center justify-center text-[#C62828]">
                  <Navigation className="w-6 h-6 text-[#C62828]" />
                </div>
                <h4 className="text-lg font-bold text-[#FFFFFF]">
                  Service de Navette &amp; Livraison à Domicile
                </h4>
                <p className="text-[13px] text-[#B0B0B0]">
                  Nos chauffeurs vous remettent les clés directement à l&apos;Aéroport d&apos;Alger Houari Boumediene, à l&apos;agence de Boufarik ou à votre hôtel/domicile.
                </p>
                <button
                  type="button"
                  onClick={() => openAppointmentModal()}
                  className="h-9 px-4 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-bold text-[12px] rounded-[6px] transition-colors cursor-pointer"
                >
                  Prendre Rendez-vous en Agence
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
