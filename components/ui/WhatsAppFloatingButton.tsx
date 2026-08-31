"use client";

import React, { useState, useEffect } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import { buildWhatsAppUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloatingButton() {
  const { tenantConfig, trackEvent } = useInventory();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth fade-in entrance on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_clicked", undefined, "floating_fab");
    const message = `Bonjour ${tenantConfig.company.name || "TITAN CARS"},\n\nJe me permets de vous contacter via votre site web pour me renseigner sur la location d'un véhicule. Pouvez-vous me donner plus d'informations ? Merci.`;
    const phone = tenantConfig.company.whatsapp || tenantConfig.company.phone || "+213550000000";
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 transition-all duration-500 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <div className="relative group flex items-center justify-end">
        {/* Desktop Tooltip Label */}
        <div
          className={`hidden md:flex items-center gap-2 mr-3 px-3.5 py-1.5 bg-[#181818]/95 border border-[#303030] text-[#FFFFFF] text-[12px] font-semibold rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0" />
          <span>WhatsApp 24/7 — Réponse Express</span>
        </div>

        {/* Floating Action Button */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-label="Contacter TITAN CARS sur WhatsApp (ouvert 24h/24)"
          className="relative min-w-[52px] min-h-[52px] sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-[#FFFFFF] flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.35)] hover:shadow-[0_10px_28px_rgba(37,211,102,0.5)] transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] touch-manipulation cursor-pointer border border-[#FFFFFF]/20"
        >
          {/* Online Pulsing Indicator Dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981] border-2 border-[#111111]" />
          </span>

          {/* WhatsApp Custom Icon */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current transition-transform duration-300 group-hover:rotate-6"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.333 4.994L2 22l5.233-1.371c1.457.796 3.097 1.215 4.774 1.216h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.038-5.176-2.923-7.062A9.922 9.922 0 0 0 12.012 2zm0 18.322h-.003a8.312 8.312 0 0 1-4.238-1.164l-.304-.181-3.149.826.84-3.072-.198-.315a8.291 8.291 0 0 1-1.272-4.433c.001-4.582 3.729-8.31 8.312-8.31 2.22 0 4.306.865 5.875 2.436a8.256 8.256 0 0 1 2.433 5.875c0 4.583-3.728 8.311-8.301 8.311zm4.557-6.223c-.25-.125-1.478-.728-1.707-.812-.228-.083-.395-.125-.561.125-.167.25-.645.812-.791.979-.145.166-.291.187-.541.062a6.822 6.822 0 0 1-2.008-1.238 7.525 7.525 0 0 1-1.389-1.73c-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.145.166-.25.25-.416.083-.166.042-.312-.021-.437-.063-.125-.562-1.354-.771-1.854-.203-.487-.411-.421-.561-.428l-.479-.008c-.166 0-.437.062-.666.312-.229.25-.874.854-.874 2.083 0 1.229.896 2.416 1.021 2.583.125.166 1.764 2.695 4.274 3.778.597.257 1.063.41 1.427.526.6.19 1.146.163 1.578.099.481-.072 1.478-.604 1.686-1.187.208-.583.208-1.083.146-1.187-.063-.104-.229-.167-.479-.292z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
