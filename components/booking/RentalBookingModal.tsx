"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Calendar,
  MapPin,
  CheckCircle2,
  Car,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useInventory } from "@/lib/store/inventory-context";
import { formatDailyRate, buildWhatsAppUrl, buildWhatsAppRentalBookingMessage, formatVehicleImageUrl } from "@/lib/utils";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/Button";

interface RentalBookingContentProps {
  initialVehicle: Vehicle;
  onClose: () => void;
}

function RentalBookingContent({ initialVehicle, onClose }: RentalBookingContentProps) {
  const {
    vehicles,
    tenantConfig,
    submitRentalBooking,
    trackEvent,
  } = useInventory();

  // Dates defaults: Tomorrow to +4 days
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const defaultEndDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
  }, []);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicle.id);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [endTime, setEndTime] = useState("18:00");
  const [pickupLocation, setPickupLocation] = useState(initialVehicle.availableLocations?.[0] || "Boufarik Showroom");
  const [returnLocation, setReturnLocation] = useState(initialVehicle.availableLocations?.[0] || "Boufarik Showroom");
  const [notes, setNotes] = useState("");

  // Options
  const [insuranceOption, setInsuranceOption] = useState(true);
  const [additionalDriver, setAdditionalDriver] = useState(false);
  const [babySeat, setBabySeat] = useState(false);
  const [airportMeet, setAirportMeet] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Current active vehicle
  const currentVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || initialVehicle;
  }, [vehicles, selectedVehicleId, initialVehicle]);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [startDate, endDate]);

  // Pricing calculations
  const dailyRate = currentVehicle?.dailyRate || 5500;
  const depositAmount = currentVehicle?.deposit || 40000;
  
  const optionsTotal = useMemo(() => {
    let total = 0;
    if (insuranceOption) total += 1000 * rentalDays;
    if (additionalDriver) total += 500 * rentalDays;
    if (babySeat) total += 1500; // Flat fee
    if (airportMeet) total += 2000; // Airport delivery fee
    return total;
  }, [insuranceOption, additionalDriver, babySeat, airportMeet, rentalDays]);

  const baseRentalTotal = dailyRate * rentalDays;
  const grandTotal = baseRentalTotal + optionsTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg("Veuillez renseigner votre nom complet et votre numéro de téléphone.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await submitRentalBooking({
        vehicleId: currentVehicle?.id || "unknown",
        vehicleTitle: `${currentVehicle?.brand || ""} ${currentVehicle?.model || ""}`,
        vehicleImage: currentVehicle?.mainImage,
        customerName,
        phone,
        email: email || undefined,
        startDate,
        startTime,
        endDate,
        endTime,
        days: rentalDays,
        dailyRate,
        totalPrice: grandTotal,
        depositAmount,
        pickupLocation,
        returnLocation,
        source: "DIRECT_WEB",
        options: {
          insuranceComprehensive: insuranceOption,
          additionalDriver,
          babySeat,
          airportMeetAndGreet: airportMeet,
        },
        notes: notes || undefined,
      });

      if (res.success && res.bookingId) {
        setIsSuccess(true);
        setSubmittedBookingId(res.bookingId);
        trackEvent("booking_submitted", currentVehicle?.id, res.bookingId);
      } else {
        setErrorMsg(res.message || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch {
      setErrorMsg("Impossible d'enregistrer la réservation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppMessage = buildWhatsAppRentalBookingMessage({
    companyName: tenantConfig.company.name,
    vehicleTitle: `${currentVehicle?.brand || ""} ${currentVehicle?.model || ""}`,
    startDate,
    endDate,
    days: rentalDays,
    dailyRate,
    totalPrice: grandTotal,
    pickupLocation,
    returnLocation,
    customerName: customerName || "Client",
    phone: phone || "Non renseigné",
  });

  const whatsAppUrl = buildWhatsAppUrl(tenantConfig.company.whatsapp || tenantConfig.company.phone, whatsAppMessage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#181818] border border-[#303030] rounded-[10px] shadow-none overflow-hidden my-6 text-[#E8E8E8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#303030] bg-[#111111]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#222222] border border-[#303030] flex items-center justify-center text-[#C62828]">
              <Car className="w-4 h-4 text-[#C62828]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] leading-tight">
                Réservation de Véhicule
              </h2>
              <p className="text-[11px] text-[#8A8A8A]">
                {tenantConfig.company.name} — Prise en charge express &amp; Aéroport 24/7
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[6px] bg-[#222222] hover:bg-[#303030] text-[#8A8A8A] hover:text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#FFFFFF]">Réservation Enregistrée !</h3>
            <p className="text-[13px] text-[#B0B0B0] max-w-md mx-auto">
              Votre demande pour la <strong className="text-[#FFFFFF]">{currentVehicle?.brand} {currentVehicle?.model}</strong> a bien été prise en compte sous la référence <strong className="text-[#C62828]">{submittedBookingId}</strong>.
            </p>
            <div className="bg-[#111111] p-4 rounded-[8px] border border-[#303030] text-left text-[12px] space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Dates :</span>
                <span className="font-semibold text-[#FFFFFF]">{startDate} au {endDate} ({rentalDays} jours)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Lieu de prise en charge :</span>
                <span className="font-semibold text-[#FFFFFF]">{pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Total estimé :</span>
                <span className="font-bold text-[#C62828]">{grandTotal.toLocaleString("fr-FR")} DA</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-[#FFFFFF] font-bold text-[13px] rounded-[6px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirmer sur WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 bg-[#222222] hover:bg-[#303030] text-[#FFFFFF] text-[13px] font-semibold rounded-[6px] border border-[#303030] transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-[8px] bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-[12px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Vehicle Selection & Summary */}
            <div className="bg-[#111111] border border-[#303030] rounded-[8px] p-3 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-24 h-16 rounded-[6px] overflow-hidden bg-[#181818] shrink-0 border border-[#303030]">
                <Image
                  src={formatVehicleImageUrl(currentVehicle?.mainImage || currentVehicle?.gallery?.[0])}
                  alt={currentVehicle?.model || "Véhicule"}
                  fill
                  sizes="100px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 w-full text-center sm:text-left">
                <div className="text-[11px] text-[#C62828] font-bold uppercase">
                  {currentVehicle?.brand}
                </div>
                <div className="text-[15px] font-bold text-[#FFFFFF]">
                  {currentVehicle?.model} ({currentVehicle?.year})
                </div>
                <div className="text-[12px] text-[#B0B0B0]">
                  Tarif : <strong className="text-[#C62828]">{formatDailyRate(dailyRate)}</strong> • Caution : {depositAmount.toLocaleString("fr-FR")} DA
                </div>
              </div>

              {/* Selector */}
              <div className="w-full sm:w-auto">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full sm:w-44 h-9 bg-[#181818] border border-[#303030] rounded-[6px] text-[12px] px-2 text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({formatDailyRate(v.dailyRate)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#B0B0B0] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Date de départ</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="col-span-2 h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-2.5 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                    required
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-2 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#B0B0B0] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Date de retour</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="col-span-2 h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-2.5 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                    required
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-2 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                  />
                </div>
              </div>
            </div>

            {/* Location Picks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#B0B0B0] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Lieu de prise en charge</span>
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-2.5 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                >
                  <option value="Boufarik Showroom">Agence / Showroom Boufarik</option>
                  <option value="Aéroport d'Alger Houari Boumediene (24/7)">Aéroport d&apos;Alger Houari Boumediene (24/7)</option>
                  <option value="Blida Centre">Blida Centre-Ville</option>
                  <option value="Alger Centre">Alger Centre / Hôtel</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#B0B0B0] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Lieu de restitution</span>
                </label>
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="w-full h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-2.5 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                >
                  <option value="Boufarik Showroom">Agence / Showroom Boufarik</option>
                  <option value="Aéroport d'Alger Houari Boumediene (24/7)">Aéroport d&apos;Alger Houari Boumediene (24/7)</option>
                  <option value="Blida Centre">Blida Centre-Ville</option>
                  <option value="Alger Centre">Alger Centre / Hôtel</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 pt-2 border-t border-[#303030]">
              <h4 className="text-[13px] font-bold text-[#FFFFFF]">Informations Conducteur</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nom complet *"
                    className="w-full h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-3 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Téléphone (ex: 0550 12 34 56) *"
                    className="w-full h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-3 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse email (optionnel)"
                  className="w-full h-9 bg-[#111111] border border-[#303030] rounded-[6px] px-3 text-[12px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                />
              </div>
            </div>

            {/* Extra Options */}
            <div className="space-y-2 pt-2 border-t border-[#303030]">
              <h4 className="text-[13px] font-bold text-[#FFFFFF]">Options Complémentaires</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                <label className="flex items-center gap-2 p-2 bg-[#111111] border border-[#303030] rounded-[6px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={insuranceOption}
                    onChange={(e) => setInsuranceOption(e.target.checked)}
                    className="rounded accent-[#C62828]"
                  />
                  <span>Assurance Tous Risques (+1 000 DA/j)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#111111] border border-[#303030] rounded-[6px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={additionalDriver}
                    onChange={(e) => setAdditionalDriver(e.target.checked)}
                    className="rounded accent-[#C62828]"
                  />
                  <span>2ème Conducteur (+500 DA/j)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#111111] border border-[#303030] rounded-[6px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={airportMeet}
                    onChange={(e) => setAirportMeet(e.target.checked)}
                    className="rounded accent-[#C62828]"
                  />
                  <span>Accueil VIP Aéroport (+2 000 DA)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#111111] border border-[#303030] rounded-[6px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={babySeat}
                    onChange={(e) => setBabySeat(e.target.checked)}
                    className="rounded accent-[#C62828]"
                  />
                  <span>Siège Bébé / Enfant (+1 500 DA)</span>
                </label>
              </div>
            </div>

            {/* Price Breakdown Summary */}
            <div className="bg-[#111111] border border-[#303030] rounded-[8px] p-3 text-[12px] space-y-1.5">
              <div className="flex justify-between text-[#B0B0B0]">
                <span>Location de base ({rentalDays} jours x {dailyRate.toLocaleString("fr-FR")} DA) :</span>
                <span className="font-semibold text-[#FFFFFF]">{baseRentalTotal.toLocaleString("fr-FR")} DA</span>
              </div>
              {optionsTotal > 0 && (
                <div className="flex justify-between text-[#B0B0B0]">
                  <span>Options sélectionnées :</span>
                  <span className="font-semibold text-[#FFFFFF]">{optionsTotal.toLocaleString("fr-FR")} DA</span>
                </div>
              )}
              <div className="flex justify-between text-[14px] font-extrabold text-[#C62828] border-t border-[#303030] pt-2">
                <span>Total Estimé :</span>
                <span>{grandTotal.toLocaleString("fr-FR")} DA</span>
              </div>
              <div className="text-[11px] text-[#8A8A8A]">
                * Caution de garantie de {depositAmount.toLocaleString("fr-FR")} DA demandée à la remise des clés (restituée au retour).
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                icon={<CheckCircle2 className="w-4 h-4" />}
                className="flex-1 justify-center"
              >
                Confirmer la Réservation
              </Button>

              <Button
                type="button"
                variant="whatsapp"
                size="md"
                onClick={() => {
                  trackEvent("whatsapp_clicked", currentVehicle?.id, "booking_modal_direct_wa");
                  window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
                }}
                icon={<MessageSquare className="w-4 h-4" />}
                className="shrink-0"
              >
                WhatsApp Direct
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RentalBookingModal() {
  const {
    isRentalBookingModalOpen,
    activeBookingVehicle,
    closeRentalBookingModal,
    vehicles,
  } = useInventory();

  if (!isRentalBookingModalOpen) return null;

  const targetVehicle = activeBookingVehicle || vehicles[0];
  if (!targetVehicle) return null;

  return (
    <RentalBookingContent
      key={targetVehicle.id}
      initialVehicle={targetVehicle}
      onClose={closeRentalBookingModal}
    />
  );
}
