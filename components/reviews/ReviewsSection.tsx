"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { Star, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReviewsSection() {
  const { tenantConfig, openInquiryModal } = useInventory();

  const sampleReviews = [
    {
      author: "Karim M.",
      location: "Alger / Paris",
      rating: 5,
      date: "Il y a 2 semaines",
      comment: "Service impeccable à l'Aéroport d'Alger ! Réception de la Classe G AMG en moins de 10 minutes. Voiture rutilante et agent très professionnel. Je recommande vivement TITAN CAR.",
      vehicle: "Mercedes-Benz Classe G 63 AMG",
    },
    {
      author: "Sofiane B.",
      location: "Blida",
      rating: 5,
      date: "Il y a 1 mois",
      comment: "Location pour un week-end en famille avec la Golf 8 R-Line. Démarches ultra simples et tarifs très transparents. Accueil au top à l'agence de Boufarik.",
      vehicle: "Volkswagen Golf 8 R-Line",
    },
    {
      author: "Amine T.",
      location: "Boufarik",
      rating: 5,
      date: "Il y a 1 mois",
      comment: "Hyundai Tucson loué pour un voyage d'affaires. État neuf, contrat clair et caution restituée sans aucun souci. Merci à l'équipe TITAN CAR !",
      vehicle: "Hyundai Tucson N-Line",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#111111] border-b border-[#303030]" id="avis-clients">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#181818] border border-[#303030] text-[#EF4444] text-[12px] font-bold rounded-[6px] uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />
            Avis Clients Vérifiés
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
            La Satisfaction de Nos Clients
          </h2>
          <p className="text-[15px] text-[#B0B0B0]">
            Découvrez les retours d&apos;expérience des conducteurs ayant loué avec {tenantConfig.company.name}.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleReviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#181818] border border-[#303030] hover:border-[#EF4444]/40 transition-all duration-300 p-6 rounded-[12px] flex flex-col justify-between space-y-4 shadow-lg hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#EF4444]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#EF4444] text-[#EF4444]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8A8A8A] font-medium">{rev.date}</span>
                </div>

                <p className="text-[14px] text-[#FFFFFF] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#303030] flex items-center justify-between text-[12px]">
                <div>
                  <div className="font-bold text-[#FFFFFF] flex items-center gap-1">
                    <span>{rev.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#EF4444]" />
                  </div>
                  <div className="text-[11px] text-[#8A8A8A]">{rev.location}</div>
                </div>

                <div className="text-right text-[11px] text-[#EF4444] font-semibold">
                  {rev.vehicle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="text-center pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => openInquiryModal()}
            icon={<MessageSquare className="w-4 h-4 text-[#EF4444]" />}
          >
            Laisser un avis ou poser une question
          </Button>
        </div>

      </div>
    </section>
  );
}
