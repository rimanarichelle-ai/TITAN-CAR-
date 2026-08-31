"use client";

import React from "react";
import { Vehicle } from "@/types";
import { useInventory } from "@/lib/store/inventory-context";
import Image from "next/image";
import { formatPrice, formatDailyRate, buildWhatsAppVehicleMessage, buildWhatsAppUrl, formatVehicleImageUrl } from "@/lib/utils";
import { Calendar, Fuel, Cog, ArrowRight, MessageCircle, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: "grid" | "list";
}

export function VehicleCard({ vehicle, viewMode = "grid" }: VehicleCardProps) {
  const { setSelectedVehicle, openRentalBookingModal, tenantConfig, trackEvent } = useInventory();
  
  const [prevVehicleId, setPrevVehicleId] = React.useState(vehicle.id);
  const [imgError, setImgError] = React.useState(false);

  if (prevVehicleId !== vehicle.id) {
    setPrevVehicleId(vehicle.id);
    setImgError(false);
  }

  const primaryImg = formatVehicleImageUrl(vehicle.mainImage || vehicle.gallery?.[0]);
  const imgSrc = imgError ? "/vehicles/clio5.jpg" : primaryImg;

  // Status badge
  const getStatusBadge = () => {
    switch (vehicle.status) {
      case "AVAILABLE":
        return (
          <span className="px-2.5 py-0.5 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-[11px] font-extrabold rounded-[6px] uppercase tracking-wider shadow-sm">
            Disponible
          </span>
        );
      case "RESERVED":
        return (
          <span className="px-2.5 py-0.5 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 text-[11px] font-extrabold rounded-[6px] uppercase tracking-wider shadow-sm">
            Réservé
          </span>
        );
      case "SOLD":
        return (
          <span className="px-2.5 py-0.5 bg-[#6B7280]/20 text-[#9CA3AF] border border-[#6B7280]/40 text-[11px] font-extrabold rounded-[6px] uppercase tracking-wider shadow-sm">
            Indisponible
          </span>
        );
      default:
        return null;
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent("whatsapp_clicked", vehicle.id, "vehicle_card");
    const msg = buildWhatsAppVehicleMessage(vehicle.brand, vehicle.model, vehicle.version, vehicle.id, tenantConfig.company.name);
    const url = buildWhatsAppUrl(tenantConfig.company.whatsapp || tenantConfig.company.phone, msg);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openRentalBookingModal(vehicle);
  };

  const isRentalMode = !!vehicle.dailyRate;

  if (viewMode === "list") {
    return (
      <div
        onClick={() => setSelectedVehicle(vehicle)}
        className="bg-[#181818] border border-[#303030] hover:border-[#EF4444] transition-all duration-200 rounded-[12px] cursor-pointer p-4 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between group text-[#FFFFFF] shadow-lg hover:shadow-red-950/20 hover:-translate-y-0.5"
        id={`vehicle-card-${vehicle.id}`}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-56 aspect-[16/10] bg-[#111111] rounded-[8px] overflow-hidden shrink-0 border border-[#303030] group-hover:border-[#EF4444]/40">
            <Image
              src={imgSrc}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              sizes="(max-width: 640px) 100vw, 280px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
            <div className="absolute top-2 left-2">{getStatusBadge()}</div>
            {vehicle.rentalCategory && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#111111]/90 text-[#EF4444] text-[10px] font-black rounded-[4px] border border-[#303030]">
                {vehicle.rentalCategory}
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="text-[11px] text-[#EF4444] uppercase font-black tracking-wider">
              {vehicle.brand}
            </div>
            <h3 className="text-xl font-black text-[#FFFFFF] leading-tight group-hover:text-[#EF4444] transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.version && (
              <p className="text-[13px] text-[#A0A0A0] font-medium line-clamp-1">
                {vehicle.version}
              </p>
            )}

            {/* Description excerpt */}
            {vehicle.description && (
              <p className="text-[12px] text-[#888888] line-clamp-2 pt-1 font-normal leading-relaxed">
                {vehicle.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#B0B0B0] pt-1.5 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#EF4444]" />
                {vehicle.year || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-[#EF4444]" />
                {vehicle.fuelType || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Cog className="w-3.5 h-3.5 text-[#EF4444]" />
                {vehicle.transmission || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#EF4444]" />
                {vehicle.location || "Boufarik"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-row md:flex-col items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#303030] shrink-0">
          <div className="text-left md:text-right">
            <div className="text-[10px] text-[#8A8A8A] uppercase font-bold">Tarif Location</div>
            <div className="text-[20px] font-black text-[#FFFFFF]">
              {isRentalMode ? formatDailyRate(vehicle.dailyRate) : formatPrice(vehicle.price)}
            </div>
            {vehicle.deposit && (
              <div className="text-[11px] text-[#8A8A8A] font-medium">
                Caution : {vehicle.deposit.toLocaleString("fr-FR")} DA
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="whatsapp"
              size="md"
              onClick={handleWhatsAppClick}
              icon={<MessageCircle className="w-4 h-4" />}
              title="Poser une question via WhatsApp"
            >
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleReserveClick}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Réserver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode (Default)
  return (
    <div
      onClick={() => setSelectedVehicle(vehicle)}
      className="bg-[#181818] border border-[#303030] hover:border-[#EF4444] transition-all duration-200 rounded-[12px] cursor-pointer flex flex-col h-full group overflow-hidden text-[#FFFFFF] shadow-xl hover:shadow-red-950/30 hover:-translate-y-1"
      id={`vehicle-card-${vehicle.id}`}
    >
      {/* Vehicle Image Container */}
      <div className="relative aspect-[16/10] bg-[#111111] overflow-hidden">
        <Image
          src={imgSrc}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
        
        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          {getStatusBadge()}
          {vehicle.featured && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#EF4444] to-[#B71C1C] text-[#FFFFFF] text-[10px] font-black rounded-[4px] uppercase tracking-wider shadow-md">
              En vedette
            </span>
          )}
        </div>

        {/* Category Pill */}
        {vehicle.rentalCategory && (
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 bg-[#111111]/90 border border-[#303030] text-[#EF4444] text-[10px] font-black rounded-[4px]">
            {vehicle.rentalCategory}
          </div>
        )}

        {/* Photos count */}
        {vehicle.gallery && vehicle.gallery.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-[#111111]/90 text-[#FFFFFF] text-[11px] rounded-[4px] border border-[#303030] font-bold">
            {vehicle.gallery.length} photos
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#EF4444] uppercase font-black tracking-wider">
              {vehicle.brand}
            </div>
            <div className="text-[11px] text-[#888888] font-bold">
              {vehicle.year}
            </div>
          </div>
          
          <h3 className="text-[18px] font-black text-[#FFFFFF] group-hover:text-[#EF4444] transition-colors duration-150 line-clamp-1 mt-0.5">
            {vehicle.brand} {vehicle.model}
          </h3>
          {vehicle.version && (
            <p className="text-[12px] text-[#909090] font-medium line-clamp-1 mt-0.5">
              {vehicle.version}
            </p>
          )}

          {/* Description Excerpt for Car Listing */}
          {vehicle.description && (
            <p className="text-[12px] text-[#808080] line-clamp-2 mt-2 leading-relaxed font-normal">
              {vehicle.description}
            </p>
          )}

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2.5 text-[11px] text-[#B0B0B0] border-t border-[#2A2A2A] mt-3">
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
              <span className="truncate font-semibold">{vehicle.transmission || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
              <span className="font-semibold">{vehicle.fuelType || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
              <span className="truncate font-semibold text-[#888888]">{vehicle.location || "Boufarik & Aéroport 24/7"}</span>
            </div>
          </div>
        </div>

        {/* Footer: Price & Direct Lively Actions */}
        <div className="pt-3 border-t border-[#303030] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#8A8A8A] uppercase font-extrabold block leading-none">
              Tarif / jour
            </span>
            <span className="text-[17px] font-black text-[#FFFFFF]">
              {isRentalMode ? formatDailyRate(vehicle.dailyRate) : formatPrice(vehicle.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="whatsapp"
              size="icon"
              onClick={handleWhatsAppClick}
              title="Discuter sur WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleReserveClick}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Réserver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
