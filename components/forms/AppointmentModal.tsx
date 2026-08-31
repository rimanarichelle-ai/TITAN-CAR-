"use client";

import React, { useState } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { AppointmentType } from "@/types";
import { X, Calendar, Clock, Car, CheckCircle2, User, Phone, Mail, FileText } from "lucide-react";

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:30 - 11:30",
  "14:00 - 15:00",
  "15:30 - 16:30",
  "17:00 - 18:00",
];

export function AppointmentModal() {
  const {
    isAppointmentModalOpen,
    closeAppointmentModal,
    activeAppointmentVehicle,
    vehicles,
    scheduleAppointment,
    tenantConfig,
  } = useInventory();

  const APPOINTMENT_TYPES: { type: AppointmentType; label: string; desc: string }[] = [
    { type: "SHOWROOM_VISIT", label: "Visite Showroom", desc: `Découverte du véhicule sur place à ${tenantConfig.company.city}` },
    { type: "TEST_DRIVE", label: "Essai sur Route", desc: `Essai accompagné avec un conseiller ${tenantConfig.company.name}` },
    { type: "VEHICLE_INSPECTION", label: "Inspection & Diagnostic", desc: "Contrôle technique détaillé avant réservation" },
    { type: "TRADE_IN_VALUATION", label: "Estimation Reprise", desc: "Évaluation sur place de votre véhicule actuel" },
  ];

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(activeAppointmentVehicle?.id || "");
  const [aptType, setAptType] = useState<AppointmentType>("SHOWROOM_VISIT");
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAppointmentModalOpen) return null;

  const currentVehicle = vehicles.find((v) => v.id === (selectedVehicleId || activeAppointmentVehicle?.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !date || !timeSlot) return;

    setIsSubmitting(true);
    const result = await scheduleAppointment({
      customerName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      vehicleId: currentVehicle?.id,
      vehicleTitle: currentVehicle ? `${currentVehicle.brand} ${currentVehicle.model} (${currentVehicle.year})` : undefined,
      date,
      timeSlot,
      type: aptType,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setSuccessMessage(null);
        closeAppointmentModal();
        setFullName("");
        setPhone("");
        setEmail("");
        setNotes("");
      }, 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in"
      onClick={closeAppointmentModal}
      id="appointment-modal-overlay"
    >
      <div
        className="w-full max-w-xl bg-[#181818] rounded-[10px] border border-[#303030] shadow-none overflow-hidden my-auto text-[#E8E8E8]"
        onClick={(e) => e.stopPropagation()}
        id="appointment-modal-content"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#303030] flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#222222] border border-[#303030] text-[#C62828] rounded-[6px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#C62828]" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#FFFFFF]">
                Planifier un rendez-vous showroom
              </h3>
              <p className="text-[12px] text-[#8A8A8A]">
                {tenantConfig.company.name} &bull; Agence {tenantConfig.company.city}
              </p>
            </div>
          </div>

          <button
            onClick={closeAppointmentModal}
            className="w-8 h-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#FFFFFF] hover:bg-[#222222] rounded-[6px] border border-[#303030] transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {successMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-[#10B981]/15 text-[#10B981] rounded-full border border-[#10B981]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[16px] text-[#FFFFFF]">
              Rendez-vous enregistré avec succès
            </h4>
            <p className="text-[13px] text-[#B0B0B0] max-w-md mx-auto">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#C62828]" />
                <span>Véhicule concerné</span>
              </label>
              <select
                value={selectedVehicleId || activeAppointmentVehicle?.id || ""}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
              >
                <option value="">Visite générale de l&apos;agence (aucun véhicule spécifique)</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} {v.version ? `- ${v.version}` : ""} ({v.year})
                  </option>
                ))}
              </select>
            </div>

            {/* Type of Appointment */}
            <div>
              <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5">
                Motif du rendez-vous
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {APPOINTMENT_TYPES.map((t) => (
                  <label
                    key={t.type}
                    className={`p-3 rounded-[8px] border text-left cursor-pointer transition-colors block ${
                      aptType === t.type
                        ? "border-[#C62828] bg-[#C62828]/10 text-[#FFFFFF]"
                        : "border-[#303030] bg-[#111111] hover:bg-[#222222] text-[#B0B0B0]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="aptType"
                      checked={aptType === t.type}
                      onChange={() => setAptType(t.type)}
                      className="sr-only"
                    />
                    <div className="font-semibold text-[13px] text-[#FFFFFF]">{t.label}</div>
                    <div className="text-[11px] text-[#8A8A8A] mt-0.5 leading-tight">{t.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span>Date souhaitée *</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span>Créneau horaire *</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span>Nom complet *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Karim Belhadj"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span>Téléphone *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex : 0550 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span>Email (facultatif)</span>
                </label>
                <input
                  type="email"
                  placeholder="Ex : contact@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#E8E8E8] mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span>Notes / Précisions</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Prise en charge Aéroport d'Alger"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[13px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#303030] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeAppointmentModal}
                className="h-10 px-4 bg-[#111111] border border-[#303030] hover:bg-[#222222] text-[#E8E8E8] font-medium text-[13px] rounded-[6px] transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-medium text-[13px] rounded-[6px] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isSubmitting ? "Enregistrement..." : "Confirmer la demande de RDV"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
