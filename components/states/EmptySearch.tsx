"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { SearchX, RotateCcw } from "lucide-react";

export function EmptySearch() {
  const { resetFilters } = useInventory();

  return (
    <div className="titan-card p-8 md:p-12 text-center max-w-[600px] mx-auto my-8 space-y-4">
      <div className="w-12 h-12 bg-[#F5F5F2] border border-[#D9D9D4] rounded-[8px] mx-auto flex items-center justify-center text-[#666666]">
        <SearchX className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-[#151515]">
          Aucun véhicule ne correspond à vos critères.
        </h3>
        <p className="text-[14px] text-[#666666] max-w-[440px] mx-auto">
          Essayez d&apos;élargir vos filtres de recherche ou de réinitialiser vos critères de sélection.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={resetFilters}
          className="h-10 px-5 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] font-medium text-[14px] rounded-[8px] inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialiser les filtres</span>
        </button>
      </div>
    </div>
  );
}
