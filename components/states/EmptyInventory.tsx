"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { Car, MessageCircle } from "lucide-react";

export function EmptyInventory() {
  const { openInquiryModal, tenantConfig } = useInventory();

  return (
    <div className="bg-[#111111] border border-[#303030] rounded-[8px] p-8 md:p-12 text-center max-w-[600px] mx-auto my-8 space-y-4">
      <div className="w-12 h-12 bg-[#222222] border border-[#303030] rounded-[6px] mx-auto flex items-center justify-center text-[#C62828]">
        <Car className="w-6 h-6 text-[#C62828]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-[#FFFFFF]">
          Aucun véhicule n’est actuellement disponible.
        </h3>
        <p className="text-[14px] text-[#B0B0B0] max-w-[420px] mx-auto">
          Contactez {tenantConfig.company.name} pour connaître les prochains véhicules et créneaux proposés.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => openInquiryModal(null, "GENERAL")}
          className="h-10 px-6 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-bold text-[14px] rounded-[6px] inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Nous contacter</span>
        </button>
      </div>
    </div>
  );
}
