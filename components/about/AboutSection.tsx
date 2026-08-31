"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { ShieldCheck, Award, MapPin, Users, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const { tenantConfig } = useInventory();

  return (
    <section className="py-14 md:py-20 bg-[#111111] border-b border-[#303030]" id="about">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#181818] border border-[#303030] text-[#EF4444] text-[12px] font-bold rounded-[6px] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#EF4444]" />
              À Propos de {tenantConfig.company.name}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight">
              L&apos;Excellence de la Location Automobile à{" "}
              <span className="text-[#EF4444]">{tenantConfig.company.city}</span>
            </h2>

            <p className="text-[15px] sm:text-[16px] text-[#B0B0B0] leading-relaxed">
              Basé à Boufarik dans la Wilaya de Blida, {tenantConfig.company.name} est la référence régionale pour la location de véhicules récents, citadines, berlines et SUV de prestige comme la Mercedes Classe G 63 AMG.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#181818] border border-[#303030] p-4 rounded-[8px] space-y-1">
                <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-[15px]">
                  <CheckCircle2 className="w-4 h-4 text-[#EF4444]" />
                  <span>Véhicules Récents</span>
                </div>
                <p className="text-[13px] text-[#8A8A8A]">
                  Flotte renouvelée régulièrement avec des modèles sous garantie constructeur.
                </p>
              </div>

              <div className="bg-[#181818] border border-[#303030] p-4 rounded-[8px] space-y-1">
                <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-[15px]">
                  <CheckCircle2 className="w-4 h-4 text-[#EF4444]" />
                  <span>Transparence Totale</span>
                </div>
                <p className="text-[13px] text-[#8A8A8A]">
                  Tarifs clairs, contrats officiels et caution restituée sans délai.
                </p>
              </div>

              <div className="bg-[#181818] border border-[#303030] p-4 rounded-[8px] space-y-1">
                <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-[15px]">
                  <CheckCircle2 className="w-4 h-4 text-[#EF4444]" />
                  <span>Livraison Aéroports</span>
                </div>
                <p className="text-[13px] text-[#8A8A8A]">
                  Prise en charge directe 24h/24 à Houari Boumediene (Alger).
                </p>
              </div>

              <div className="bg-[#181818] border border-[#303030] p-4 rounded-[8px] space-y-1">
                <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-[15px]">
                  <CheckCircle2 className="w-4 h-4 text-[#EF4444]" />
                  <span>Service Client 24/7</span>
                </div>
                <p className="text-[13px] text-[#8A8A8A]">
                  Équipe locale réactive à votre écoute par téléphone et WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column Stats & Assurance */}
          <div className="lg:col-span-5 bg-[#181818] border border-[#303030] p-6 sm:p-8 rounded-[8px] space-y-6">
            <h3 className="text-xl font-bold text-[#FFFFFF]">
              Indicateurs de Confiance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#303030]">
                <div>
                  <div className="text-2xl font-extrabold text-[#FFFFFF]">4.9 / 5</div>
                  <div className="text-[12px] text-[#8A8A8A]">Note moyenne des clients certifiés</div>
                </div>
                <div className="w-10 h-10 bg-[#222222] border border-[#303030] rounded-[6px] flex items-center justify-center text-[#EF4444] font-bold">
                  ★
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#303030]">
                <div>
                  <div className="text-2xl font-extrabold text-[#FFFFFF]">100%</div>
                  <div className="text-[12px] text-[#8A8A8A]">Véhicules révisés &amp; désinfectés</div>
                </div>
                <ShieldCheck className="w-6 h-6 text-[#EF4444]" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-[#FFFFFF]">24/7</div>
                  <div className="text-[12px] text-[#8A8A8A]">Service navette aéroport d&apos;Alger</div>
                </div>
                <MapPin className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
