"use client";

import React from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { VehicleCard } from "./VehicleCard";
import { FilterBar } from "@/components/filters/FilterBar";
import { EmptyInventory } from "@/components/states/EmptyInventory";
import { EmptySearch } from "@/components/states/EmptySearch";

export function VehicleGrid() {
  const { vehicles, filteredVehicles, viewMode } = useInventory();

  return (
    <section className="py-12 md:py-16 bg-[#111111] border-b border-[#303030]" id="inventory">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
                Véhicules disponibles
              </h2>
              <p className="text-[15px] text-[#B0B0B0] mt-1">
                Consultez la flotte actuellement proposée à la location par TITAN CAR.
              </p>
            </div>
            <div className="text-[13px] text-[#B0B0B0]">
              Total : <strong className="text-[#FFFFFF]">{vehicles.length}</strong> véhicules en inventaire
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <FilterBar />

        {/* Vehicle Results Content */}
        {vehicles.length === 0 ? (
          <EmptyInventory />
        ) : filteredVehicles.length === 0 ? (
          <EmptySearch />
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode="list" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode="grid" />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
