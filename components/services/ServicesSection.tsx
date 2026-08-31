"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { Plane, ShieldCheck, Clock, MapPin, Key, Award, Headphones, ChevronRight } from "lucide-react";

export function ServicesSection() {
  const { openRentalBookingModal, openInquiryModal, tenantConfig } = useInventory();

  const services = [
    {
      icon: Plane,
      title: "Livraison Aéroport 24h/7j",
      subtitle: "Alger Houari Boumediene",
      desc: "Prise en charge directe à la sortie du terminal ou dépose à votre départ. Agent dédié et remise des clés en 5 minutes.",
    },
    {
      icon: Key,
      title: "Location Court & Moyen Terme",
      subtitle: "Particuliers & Entreprises",
      desc: "Forfaits flexibles à la journée, semaine ou mois. Kilométrage adapté et contrat transparent sans frais cachés.",
    },
    {
      icon: ShieldCheck,
      title: "Assistance & Dépannage 24/7",
      subtitle: "Tranquillité Totale",
      desc: "Assistance routière disponible 24h/24 et 7j/7 sur toute la Wilaya de Blida, Alger et axes autoroutiers.",
    },
    {
      icon: Clock,
      title: "Réservation Instantanée",
      subtitle: "Confirmation WhatsApp Express",
      desc: "Sélectionnez votre véhicule, vos dates et options. Validation rapide par nos conseillers en moins de 15 minutes.",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#181818] border-b border-[#303030]" id="services">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Heading */}
        <div className="text-center max-w-[720px] mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#222222] border border-[#303030] text-[#C62828] text-[12px] font-bold rounded-[6px] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Services Mobilité VIP
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
            Pourquoi Choisir {tenantConfig.company.name} ?
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#B0B0B0] leading-relaxed">
            Une expérience de location automobile haut de gamme à Boufarik, Blida et l&apos;Aéroport d&apos;Alger.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-[#111111] border border-[#303030] hover:border-[#C62828] p-6 rounded-[8px] transition-colors duration-150 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#222222] border border-[#303030] rounded-[8px] flex items-center justify-center text-[#C62828]">
                    <IconComponent className="w-6 h-6 text-[#C62828]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#C62828] uppercase tracking-wider">
                      {item.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-[#FFFFFF] mt-0.5 group-hover:text-[#C62828] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[13px] text-[#B0B0B0] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#303030]">
                  <button
                    type="button"
                    onClick={() => openRentalBookingModal()}
                    className="text-[12px] font-bold text-[#FFFFFF] hover:text-[#C62828] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Réserver ce service</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C62828]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner CTA */}
        <div className="bg-[#111111] border border-[#303030] p-6 sm:p-8 rounded-[8px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#FFFFFF]">
              Besoin d&apos;un véhicule spécifique ou d&apos;un devis entreprise ?
            </h3>
            <p className="text-[14px] text-[#B0B0B0]">
              Notre équipe à Boufarik vous recontacte immédiatement pour établir votre contrat sur-mesure.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openInquiryModal()}
              className="h-10 px-5 bg-[#222222] hover:bg-[#303030] border border-[#303030] text-[#FFFFFF] font-semibold text-[13px] rounded-[6px] transition-colors cursor-pointer"
            >
              Demande d&apos;information
            </button>
            <button
              type="button"
              onClick={() => openRentalBookingModal()}
              className="h-10 px-6 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-bold text-[13px] rounded-[6px] transition-colors cursor-pointer"
            >
              Réserver Maintenant
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
