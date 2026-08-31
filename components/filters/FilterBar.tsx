"use client";

import React, { useState } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { Search, SlidersHorizontal, RotateCcw, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FilterBar() {
  const {
    vehicles,
    filterState,
    setFilterState,
    resetFilters,
    viewMode,
    setViewMode,
    filteredVehicles,
  } = useInventory();

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Extract unique available brands from vehicles
  const brands = Array.from(new Set(vehicles.map((v) => v.brand))).sort();
  const fuelTypes = Array.from(new Set(vehicles.map((v) => v.fuelType).filter(Boolean))) as string[];
  const transmissions = Array.from(new Set(vehicles.map((v) => v.transmission).filter(Boolean))) as string[];
  const bodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType).filter(Boolean))) as string[];

  const categories = [
    { label: "Tous les Véhicules", value: "ALL" },
    { label: "Prestige & SUV", value: "SUV" },
    { label: "Citadines", value: "Citadine" },
    { label: "Berlines", value: "Berline" },
    { label: "Utilitaires", value: "Utilitaire" },
  ];

  const hasActiveFilters =
    filterState.search !== "" ||
    filterState.brand !== "ALL" ||
    filterState.status !== "ALL" ||
    filterState.fuelType !== "ALL" ||
    filterState.transmission !== "ALL" ||
    filterState.bodyType !== "ALL" ||
    filterState.minYear !== undefined ||
    filterState.maxYear !== undefined ||
    filterState.maxMileage !== undefined ||
    filterState.minPrice !== undefined ||
    filterState.maxPrice !== undefined;

  return (
    <div className="space-y-4" id="inventory-filters">
      
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive =
            cat.value === "ALL"
              ? filterState.bodyType === "ALL"
              : filterState.bodyType === cat.value;

          return (
            <Button
              key={cat.value}
              variant="pill"
              size="sm"
              active={isActive}
              onClick={() =>
                setFilterState((prev) => ({
                  ...prev,
                  bodyType: cat.value,
                }))
              }
              className="shrink-0"
            >
              {cat.label}
            </Button>
          );
        })}
      </div>

      {/* Top Bar: Search Input, Quick Filters, View Switcher */}
      <div className="titan-card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#181818] border border-[#303030]">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterState.search}
            onChange={(e) => setFilterState((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Rechercher par modèle, finition ou mot-clé..."
            className="w-full h-10 pl-10 pr-4 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#EF4444] transition-colors"
          />
        </div>

        {/* Quick Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Brand select */}
          <select
            value={filterState.brand}
            onChange={(e) => setFilterState((prev) => ({ ...prev, brand: e.target.value }))}
            className="h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] focus:outline-none focus:border-[#EF4444] transition-colors cursor-pointer"
            aria-label="Filtrer par marque"
          >
            <option value="ALL">Toutes les marques</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Status select */}
          <select
            value={filterState.status}
            onChange={(e) => setFilterState((prev) => ({ ...prev, status: e.target.value }))}
            className="h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] focus:outline-none focus:border-[#EF4444] transition-colors cursor-pointer"
            aria-label="Filtrer par statut"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="RESERVED">Réservé</option>
            <option value="SOLD">Indisponible</option>
          </select>

          {/* Sort By */}
          <select
            value={filterState.sortBy}
            onChange={(e) =>
              setFilterState((prev) => ({
                ...prev,
                sortBy: e.target.value as "newest" | "price_asc" | "price_desc" | "mileage_asc" | "featured",
              }))
            }
            className="h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] focus:outline-none focus:border-[#EF4444] transition-colors cursor-pointer"
            aria-label="Trier les véhicules"
          >
            <option value="newest">Plus récents</option>
            <option value="featured">Mis en avant</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="mileage_asc">Kilométrage</option>
          </select>

          {/* Advanced filters toggle */}
          <Button
            variant={isAdvancedOpen || hasActiveFilters ? "primary" : "secondary"}
            size="md"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            Filtres
          </Button>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center border border-[#303030] rounded-[8px] overflow-hidden bg-[#111111]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`rounded-none h-10 w-10 min-w-0 min-h-0 ${
                viewMode === "grid" ? "bg-[#EF4444] text-[#FFFFFF]" : "text-[#8A8A8A]"
              }`}
              aria-label="Affichage en grille"
              title="Affichage en grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`rounded-none h-10 w-10 min-w-0 min-h-0 ${
                viewMode === "list" ? "bg-[#EF4444] text-[#FFFFFF]" : "text-[#8A8A8A]"
              }`}
              aria-label="Affichage en liste"
              title="Affichage en liste"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

        </div>

      </div>

      {/* Advanced Filter Collapse */}
      {isAdvancedOpen && (
        <div className="titan-card p-5 space-y-4 bg-[#181818] border border-[#303030] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Fuel type */}
            <div>
              <label className="block text-[12px] font-medium text-[#8A8A8A] uppercase mb-1.5">
                Carburant
              </label>
              <select
                value={filterState.fuelType}
                onChange={(e) => setFilterState((prev) => ({ ...prev, fuelType: e.target.value }))}
                className="w-full h-9 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#EF4444]"
              >
                <option value="ALL">Tous les carburants</option>
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-[12px] font-medium text-[#8A8A8A] uppercase mb-1.5">
                Boîte de vitesses
              </label>
              <select
                value={filterState.transmission}
                onChange={(e) => setFilterState((prev) => ({ ...prev, transmission: e.target.value }))}
                className="w-full h-9 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#EF4444]"
              >
                <option value="ALL">Toutes les boîtes</option>
                {transmissions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Body type */}
            <div>
              <label className="block text-[12px] font-medium text-[#8A8A8A] uppercase mb-1.5">
                Carrosserie
              </label>
              <select
                value={filterState.bodyType}
                onChange={(e) => setFilterState((prev) => ({ ...prev, bodyType: e.target.value }))}
                className="w-full h-9 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#EF4444]"
              >
                <option value="ALL">Toutes carrosseries</option>
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Min */}
            <div>
              <label className="block text-[12px] font-medium text-[#8A8A8A] uppercase mb-1.5">
                Année minimum
              </label>
              <select
                value={filterState.minYear || ""}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    minYear: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  }))
                }
                className="w-full h-9 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#EF4444]"
              >
                <option value="">Toutes les années</option>
                <option value="2020">2020 et +</option>
                <option value="2021">2021 et +</option>
                <option value="2022">2022 et +</option>
                <option value="2023">2023 et +</option>
                <option value="2024">2024 et +</option>
              </select>
            </div>

          </div>

          {/* Reset Filters & Results summary */}
          <div className="flex items-center justify-between pt-3 border-t border-[#303030] text-[13px]">
            <span className="text-[#8A8A8A]">
              <strong className="text-[#FFFFFF]">{filteredVehicles.length}</strong> véhicule{filteredVehicles.length > 1 ? "s" : ""} correspondant{filteredVehicles.length > 1 ? "s" : ""}
            </span>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="xs"
                onClick={resetFilters}
                icon={<RotateCcw className="w-3.5 h-3.5 text-[#EF4444]" />}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
