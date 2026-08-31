"use client";

import React, { useState } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { InquiryType, PreferredContact } from "@/types";
import { Send, CheckCircle2, AlertCircle, X, MessageCircle, Phone, Mail } from "lucide-react";
import { buildWhatsAppVehicleMessage, buildWhatsAppUrl } from "@/lib/utils";

interface InquiryFormProps {
  onSuccess?: () => void;
  isInline?: boolean;
}

export function InquiryForm({ onSuccess, isInline = false }: InquiryFormProps) {
  const { activeInquiryVehicle, activeInquiryType, submitLead, tenantConfig } = useInventory();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType>(activeInquiryType || "VEHICLE");
  const [preferredContact, setPreferredContact] = useState<PreferredContact>("WHATSAPP");
  const [message, setMessage] = useState(() => {
    if (activeInquiryVehicle) {
      return `Bonjour, je souhaiterais obtenir des informations complémentaires concernant le véhicule ${activeInquiryVehicle.brand} ${activeInquiryVehicle.model} (${activeInquiryVehicle.year || ""}).`;
    }
    return `Bonjour, je souhaite entrer en contact avec ${tenantConfig.company.name} concernant vos véhicules disponibles.`;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setStatusMessage({
        type: "error",
        text: "Une erreur est survenue. Vérifiez vos informations et réessayez.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await submitLead({
        fullName,
        phone,
        email: email.trim() || undefined,
        vehicleId: activeInquiryVehicle?.id,
        vehicleTitle: activeInquiryVehicle ? `${activeInquiryVehicle.brand} ${activeInquiryVehicle.model}` : undefined,
        inquiryType,
        message,
        preferredContact,
      });

      if (response.success) {
        setStatusMessage({
          type: "success",
          text: `Votre demande a bien été envoyée. ${tenantConfig.company.name} vous contactera prochainement.`,
        });
        setFullName("");
        setPhone("");
        setEmail("");
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        setStatusMessage({
          type: "error",
          text: "Une erreur est survenue. Vérifiez vos informations et réessayez.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Une erreur est survenue. Vérifiez vos informations et réessayez.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const msg = activeInquiryVehicle
      ? buildWhatsAppVehicleMessage(activeInquiryVehicle.brand, activeInquiryVehicle.model, activeInquiryVehicle.version, activeInquiryVehicle.id)
      : `Bonjour ${tenantConfig.company.name}, je souhaite obtenir des informations sur vos véhicules disponibles.`;
    const url = buildWhatsAppUrl(tenantConfig.company.whatsapp, msg);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="dealership-inquiry-form">
      {/* Vehicle Context Banner if attached */}
      {activeInquiryVehicle && (
        <div className="bg-[#111111] border border-[#303030] p-3 rounded-[8px] flex items-center justify-between text-[13px]">
          <div>
            <span className="text-[#8A8A8A] block">Véhicule concerné</span>
            <strong className="text-[#FFFFFF]">
              {activeInquiryVehicle.brand} {activeInquiryVehicle.model} ({activeInquiryVehicle.year})
            </strong>
          </div>
          <span className="font-bold text-[#C62828]">
            {activeInquiryVehicle.dailyRate ? `${activeInquiryVehicle.dailyRate.toLocaleString("fr-FR")} DA / j` : "Prix sur demande"}
          </span>
        </div>
      )}

      {/* Inquiry Type */}
      <div>
        <label className="block text-[13px] font-medium text-[#E8E8E8] mb-1">
          Objet de votre demande <span className="text-[#C62828]">*</span>
        </label>
        <select
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as InquiryType)}
          className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] focus:outline-none focus:border-[#C62828]"
        >
          <option value="VEHICLE">Demande d’information sur un véhicule</option>
          <option value="PRICE_REQUEST">Demande de tarif / Cotation</option>
          <option value="AVAILABILITY">Vérification de la disponibilité</option>
          <option value="VISIT">Prendre rendez-vous / Visite showroom</option>
          <option value="TRADE_IN">Estimation de reprise de mon véhicule</option>
          <option value="GENERAL">Renseignement général</option>
        </select>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-[13px] font-medium text-[#E8E8E8] mb-1">
          Nom et prénom <span className="text-[#C62828]">*</span>
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ex : Mohamed Benali"
          className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-[13px] font-medium text-[#E8E8E8] mb-1">
          Numéro de téléphone <span className="text-[#C62828]">*</span>
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ex : 0550 12 34 56"
          className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
        />
      </div>

      {/* Email (Optional) */}
      <div>
        <label className="block text-[13px] font-medium text-[#E8E8E8] mb-1">
          Adresse email <span className="text-[#8A8A8A] font-normal">(Optionnel)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ex : mohamed@example.com"
          className="w-full h-10 px-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-[13px] font-medium text-[#E8E8E8] mb-1">
          Votre message <span className="text-[#C62828]">*</span>
        </label>
        <textarea
          rows={3}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Précisez votre demande ou vos questions..."
          className="w-full p-3 bg-[#111111] border border-[#303030] rounded-[8px] text-[14px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
        />
      </div>

      {/* Preferred contact channel */}
      <div>
        <label className="block text-[13px] font-medium text-[#E8E8E8] mb-1.5">
          Canal de réponse préféré
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPreferredContact("WHATSAPP")}
            className={`h-9 border rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              preferredContact === "WHATSAPP"
                ? "bg-[#C62828] text-[#FFFFFF] border-[#C62828]"
                : "bg-[#111111] text-[#B0B0B0] border-[#303030] hover:bg-[#222222]"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setPreferredContact("PHONE")}
            className={`h-9 border rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              preferredContact === "PHONE"
                ? "bg-[#C62828] text-[#FFFFFF] border-[#C62828]"
                : "bg-[#111111] text-[#B0B0B0] border-[#303030] hover:bg-[#222222]"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Téléphone</span>
          </button>

          <button
            type="button"
            onClick={() => setPreferredContact("EMAIL")}
            className={`h-9 border rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              preferredContact === "EMAIL"
                ? "bg-[#C62828] text-[#FFFFFF] border-[#C62828]"
                : "bg-[#111111] text-[#B0B0B0] border-[#303030] hover:bg-[#222222]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>
      </div>

      {/* Status Feedback */}
      {statusMessage && (
        <div
          className={`p-3 rounded-[8px] text-[13px] flex items-start gap-2.5 ${
            statusMessage.type === "success"
              ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
              : "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-medium text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}</span>
        </button>

        <div className="text-center">
          <span className="text-[12px] text-[#8A8A8A]">ou contact direct immédiat :</span>
        </div>

        <button
          type="button"
          onClick={handleDirectWhatsApp}
          className="w-full h-10 bg-[#222222] hover:bg-[#303030] border border-[#303030] text-[#FFFFFF] font-medium text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Écrire sur WhatsApp</span>
        </button>
      </div>
    </form>
  );
}

export function InquiryModal() {
  const { isInquiryModalOpen, closeInquiryModal, activeInquiryVehicle, tenantConfig } = useInventory();

  if (!isInquiryModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={closeInquiryModal}
      id="inquiry-modal-overlay"
    >
      <div
        className="relative bg-[#181818] border border-[#303030] rounded-[10px] w-full max-w-lg overflow-hidden shadow-none my-auto text-[#E8E8E8]"
        onClick={(e) => e.stopPropagation()}
        id="inquiry-modal-content"
      >
        {/* Header */}
        <div className="bg-[#111111] border-b border-[#303030] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#FFFFFF]">
              {activeInquiryVehicle ? "Demande d'information" : `Contacter ${tenantConfig.company.name}`}
            </h3>
            <p className="text-[13px] text-[#8A8A8A]">
              Remplissez ce formulaire pour être contacté rapidement.
            </p>
          </div>
          <button
            onClick={closeInquiryModal}
            className="w-8 h-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#FFFFFF] hover:bg-[#222222] rounded-[6px] border border-[#303030] transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          <InquiryForm onSuccess={closeInquiryModal} />
        </div>
      </div>
    </div>
  );
}
