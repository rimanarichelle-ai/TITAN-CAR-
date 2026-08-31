"use client";

import React, { useState } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function FaqSection() {
  const { tenantConfig } = useInventory();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Quelles sont les conditions nécessaires pour louer une voiture ?",
      a: "Vous devez être âgé d'au moins 25 ans et être titulaire d'un permis de conduire valide depuis plus de 2 ans. Les documents requis sont : Pièce d'identité nationale ou Passeport en cours de validité, Permis de conduire et dépôt d'une caution.",
    },
    {
      q: "Comment se déroule la prise en charge à l'Aéroport d'Alger Houari Boumediene ?",
      a: "Un agent dédié vous attend directement au niveau du hall des arrivées de l'aéroport avec un panneau à votre nom. La remise des clés et l'état des lieux s'effectuent sur place en 5 minutes.",
    },
    {
      q: "Quel est le montant de la caution et comment est-elle restituée ?",
      a: "Le montant de la caution varie entre 50 000 DA et 150 000 DA selon la catégorie du véhicule loué. Elle est restituée immédiatement à la fin de votre contrat lors de la restitution du véhicule en bon état.",
    },
    {
      q: "Le kilométrage est-il limité pendant la durée de location ?",
      a: "Nos contrats incluent un forfait kilométrique généreux adapté à vos déplacements en Algérie. Des options kilométrage illimité sont également disponibles sur demande lors de la réservation.",
    },
    {
      q: "Que faire en cas de panne ou de pépin sur la route ?",
      a: "Tous nos véhicules bénéficient d'une assistance dépannage 24h/24 et 7j/7. En cas de problème, notre hotline est joignable immédiatement pour vous envoyer une dépanneuse ou un véhicule de remplacement.",
    },
  ];

  const handleWhatsAppHelp = () => {
    const msg = `Bonjour ${tenantConfig.company.name}, j'ai une question concernant les conditions de location.`;
    const url = buildWhatsAppUrl(tenantConfig.company.whatsapp || tenantConfig.company.phone, msg);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-14 md:py-20 bg-[#181818] border-b border-[#303030]" id="faq">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#222222] border border-[#303030] text-[#EF4444] text-[12px] font-bold rounded-[6px] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#EF4444]" />
            Questions Fréquentes
          </div>
          <h2 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            FAQ &amp; Conditions de Location
          </h2>
          <p className="text-[15px] text-[#B0B0B0]">
            Tout ce que vous devez savoir avant de réserver votre véhicule à Boufarik ou Alger.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#111111] border border-[#303030] rounded-[8px] overflow-hidden transition-all duration-200 hover:border-[#EF4444]/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]"
                >
                  <span className="text-[15px] sm:text-[16px] font-bold text-[#FFFFFF]">
                    {faq.q}
                  </span>
                  <div className={`p-1 rounded-full bg-[#1A1A1A] border border-[#303030] transition-transform duration-200 ${isOpen ? "rotate-180 bg-[#EF4444]/20 border-[#EF4444]/50" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-[#EF4444] shrink-0" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-[14px] text-[#B0B0B0] border-t border-[#303030] leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help CTA */}
        <div className="bg-[#111111] border border-[#303030] p-6 rounded-[8px] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-bold text-[#FFFFFF] text-[15px]">
              Vous avez une question spécifique ?
            </div>
            <div className="text-[13px] text-[#8A8A8A]">
              Notre équipe commerciale répond à toutes vos questions en direct sur WhatsApp.
            </div>
          </div>

          <Button
            variant="whatsapp"
            size="md"
            onClick={handleWhatsAppHelp}
            icon={<MessageCircle className="w-4 h-4" />}
            className="shrink-0"
          >
            Posez votre question
          </Button>
        </div>

      </div>
    </section>
  );
}
