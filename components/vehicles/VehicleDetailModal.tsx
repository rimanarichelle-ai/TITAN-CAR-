"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import { useInventory } from "@/lib/store/inventory-context";
import Image from "next/image";
import { formatPrice, formatDailyRate, formatMileage, buildWhatsAppVehicleMessage, buildWhatsAppUrl, formatVehicleImageUrl } from "@/lib/utils";
import {
  X,
  CheckCircle2,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plane,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VehicleDetailDialogProps {
  vehicle: Vehicle;
  onClose: () => void;
}

function VehicleDetailDialog({ vehicle, onClose }: VehicleDetailDialogProps) {
  const {
    openRentalBookingModal,
    tenantConfig,
    vehicles,
    setSelectedVehicle,
    updateVehicle,
    trackEvent,
  } = useInventory();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const rawGallery = vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery : [vehicle.mainImage];
  const cleanGallery: string[] = rawGallery
    .filter((img): img is string => typeof img === "string" && img.length > 0 && !img.includes("unsplash.com") && !img.includes("fiat500_mint"))
    .map((img) => formatVehicleImageUrl(img))
    .filter((img, idx, self) => self.indexOf(img) === idx);

  const mainFormatted = formatVehicleImageUrl(vehicle.mainImage);
  const images: string[] =
    cleanGallery.length > 0
      ? cleanGallery
      : [mainFormatted];

  const handleRemoveCurrentImage = () => {
    const currentImg = images[activeImageIndex];
    if (!currentImg) return;
    const updatedGallery = images.filter((img) => img !== currentImg);
    const updatedMainImg = updatedGallery.length > 0 ? updatedGallery[0] : "/vehicles/clio5.jpg";
    updateVehicle(vehicle.id, {
      mainImage: updatedMainImg,
      gallery: updatedGallery,
    });
    if (activeImageIndex >= updatedGallery.length && updatedGallery.length > 0) {
      setActiveImageIndex(updatedGallery.length - 1);
    } else {
      setActiveImageIndex(0);
    }
  };

  // Track vehicle view on open
  useEffect(() => {
    trackEvent("vehicle_view", vehicle.id, "detail_modal");
  }, [vehicle.id, trackEvent]);

  // Handle keyboard navigation (ESC, Arrow Left, Arrow Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, images.length]);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWhatsAppAction = () => {
    trackEvent("whatsapp_clicked", vehicle.id, "detail_modal_cta");
    const message = buildWhatsAppVehicleMessage(
      vehicle.brand,
      vehicle.model,
      vehicle.version,
      vehicle.id,
      tenantConfig.company.name
    );
    const url = buildWhatsAppUrl(tenantConfig.company.whatsapp || tenantConfig.company.phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleReserveAction = () => {
    onClose();
    openRentalBookingModal(vehicle);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const similarVehicles = vehicles
    .filter((v) => v.id !== vehicle.id && (v.brand === vehicle.brand || v.rentalCategory === vehicle.rentalCategory || v.bodyType === vehicle.bodyType))
    .slice(0, 3);

  const isRental = !!vehicle.dailyRate;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="vehicle-detail-modal"
    >
      <div
        className="relative w-full max-w-5xl bg-[#181818] border border-[#303030] rounded-[10px] shadow-none overflow-hidden my-6 text-[#E8E8E8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#303030] bg-[#111111]">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-[#C62828] uppercase tracking-wider">
              {vehicle.brand}
            </span>
            <span className="text-[#666666]">•</span>
            <span className="text-[14px] font-semibold text-[#FFFFFF]">
              {vehicle.model} ({vehicle.year})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="h-8 px-2.5 bg-[#222222] hover:bg-[#303030] text-[#B0B0B0] hover:text-[#FFFFFF] rounded-[6px] text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copier le lien"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Copié !" : "Partager"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-[6px] bg-[#222222] hover:bg-[#303030] text-[#B0B0B0] hover:text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] bg-[#111111] rounded-[8px] overflow-hidden border border-[#303030]">
                <Image
                  src={images[activeImageIndex] || formatVehicleImageUrl(vehicle.mainImage)}
                  alt={`${vehicle.brand} ${vehicle.model} - Photo ${activeImageIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#000000]/70 hover:bg-[#000000] text-[#FFFFFF] flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                      title="Photo précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#000000]/70 hover:bg-[#000000] text-[#FFFFFF] flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                      title="Photo suivante"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleRemoveCurrentImage}
                  className="absolute top-3 right-3 h-8 px-2.5 rounded-[6px] bg-[#C62828]/80 hover:bg-[#C62828] text-white flex items-center gap-1 text-[12px] font-medium backdrop-blur-sm transition-colors cursor-pointer z-10"
                  title="Supprimer cette photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#000000]/80 text-[#FFFFFF] text-[11px] font-medium rounded-[6px]">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 aspect-[16/10] rounded-[6px] overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? "border-[#C62828]" : "border-[#303030] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img || "/vehicles/clio5.jpg"}
                        alt={`Vignette ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing & Booking Column */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#C62828] uppercase tracking-wider">
                  {vehicle.rentalCategory || "Véhicule Premium"}
                </span>
                <h2 className="text-2xl font-extrabold text-[#FFFFFF] leading-tight">
                  {vehicle.brand} {vehicle.model}
                </h2>
                {vehicle.version && (
                  <p className="text-[13px] text-[#8A8A8A] mt-0.5">{vehicle.version}</p>
                )}
              </div>

              {/* Price Card */}
              <div className="bg-[#111111] border border-[#303030] rounded-[8px] p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-[#8A8A8A]">Tarif Journalier :</span>
                  <span className="text-[22px] font-extrabold text-[#C62828]">
                    {isRental ? formatDailyRate(vehicle.dailyRate) : formatPrice(vehicle.price)}
                  </span>
                </div>
                {vehicle.deposit && (
                  <div className="flex items-center justify-between text-[12px] text-[#B0B0B0] border-t border-[#303030] pt-2">
                    <span>Caution de garantie :</span>
                    <strong className="text-[#FFFFFF]">{vehicle.deposit.toLocaleString("fr-FR")} DA</strong>
                  </div>
                )}
                {vehicle.minRentalDays && (
                  <div className="flex items-center justify-between text-[12px] text-[#B0B0B0]">
                    <span>Durée minimale :</span>
                    <strong className="text-[#FFFFFF]">{vehicle.minRentalDays} jours</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons with Lively Pop-ups & Color Gradients */}
              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleReserveAction}
                  icon={<Calendar className="w-5 h-5" />}
                  className="w-full justify-center"
                >
                  Réserver ce véhicule
                </Button>

                <Button
                  variant="whatsapp"
                  size="md"
                  onClick={handleWhatsAppAction}
                  icon={<MessageCircle className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  Contacter sur WhatsApp
                </Button>
              </div>

              {/* Assurance points */}
              <div className="bg-[#111111] border border-[#303030] rounded-[8px] p-3 space-y-1.5 text-[12px] text-[#B0B0B0]">
                <div className="flex items-center gap-2">
                  <Plane className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Livraison Aéroport d&apos;Alger 24/7 possible</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Assurance et assistance dépannage incluses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Contrat officiel et remise des clés immédiate</span>
                </div>
              </div>
            </div>

          </div>

          {/* Specifications Breakdown */}
          <div className="border-t border-[#303030] pt-5 space-y-4">
            <h3 className="text-[16px] font-bold text-[#FFFFFF]">
              Caractéristiques Techniques
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
              <div className="bg-[#111111] p-3 rounded-[8px] border border-[#303030]">
                <span className="text-[#8A8A8A] text-[11px] block">Année</span>
                <span className="font-bold text-[#FFFFFF]">{vehicle.year}</span>
              </div>
              <div className="bg-[#111111] p-3 rounded-[8px] border border-[#303030]">
                <span className="text-[#8A8A8A] text-[11px] block">Boîte</span>
                <span className="font-bold text-[#FFFFFF]">{vehicle.transmission}</span>
              </div>
              <div className="bg-[#111111] p-3 rounded-[8px] border border-[#303030]">
                <span className="text-[#8A8A8A] text-[11px] block">Carburant</span>
                <span className="font-bold text-[#FFFFFF]">{vehicle.fuelType}</span>
              </div>
              <div className="bg-[#111111] p-3 rounded-[8px] border border-[#303030]">
                <span className="text-[#8A8A8A] text-[11px] block">Kilométrage</span>
                <span className="font-bold text-[#FFFFFF]">{formatMileage(vehicle.mileage)}</span>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-[#111111] p-4 rounded-[8px] border border-[#303030] text-[13px] text-[#B0B0B0] leading-relaxed">
                {vehicle.description}
              </div>
            )}

            {/* Features List */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-[14px] font-bold text-[#FFFFFF]">
                  Équipements &amp; Options Incluses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                  {vehicle.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#E8E8E8]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Similar Vehicles */}
          {similarVehicles.length > 0 && (
            <div className="border-t border-[#303030] pt-5 space-y-3">
              <h4 className="text-[14px] font-bold text-[#FFFFFF]">
                Véhicules Similaires
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarVehicles.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => {
                      setSelectedVehicle(sim);
                      setActiveImageIndex(0);
                    }}
                    className="bg-[#111111] hover:bg-[#222222] border border-[#303030] hover:border-[#C62828] rounded-[8px] p-2.5 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div className="relative w-16 h-12 rounded-[4px] overflow-hidden shrink-0 bg-[#181818]">
                      <Image
                        src={formatVehicleImageUrl(sim.mainImage || sim.gallery?.[0])}
                        alt={sim.model}
                        fill
                        sizes="64px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[12px] font-bold text-[#FFFFFF] truncate">
                        {sim.brand} {sim.model}
                      </div>
                      <div className="text-[11px] font-semibold text-[#C62828]">
                        {formatDailyRate(sim.dailyRate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VehicleDetailModal() {
  const { selectedVehicle, setSelectedVehicle } = useInventory();
  if (!selectedVehicle) return null;
  return <VehicleDetailDialog vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />;
}
