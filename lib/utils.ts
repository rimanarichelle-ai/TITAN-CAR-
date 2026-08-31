import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format standard price: "6 800 000 DA" or "Prix sur demande"
 */
export function formatPrice(price?: number, currency = "DA"): string {
  if (price === undefined || price === null || price <= 0) {
    return "Prix sur demande";
  }
  return `${price.toLocaleString("fr-FR")} ${currency}`;
}

/**
 * Format daily rental rate: "5 500 DA / jour"
 */
export function formatDailyRate(rate?: number, currency = "DA"): string {
  if (rate === undefined || rate === null || rate <= 0) {
    return "Sur demande";
  }
  return `${rate.toLocaleString("fr-FR")} ${currency}/jour`;
}

/**
 * Format vehicle mileage: "18 500 km"
 */
export function formatMileage(km?: number): string {
  if (km === undefined || km === null) return "Non renseigné";
  if (km === 0) return "0 km (Neuf)";
  return `${km.toLocaleString("fr-FR")} km`;
}

/**
 * Build WhatsApp click-to-chat URL or message text for general inquiries
 */
export function buildWhatsAppVehicleMessage(
  brand: string,
  model: string,
  version?: string,
  id?: string,
  companyName = "EL MOUSSAFIR CARS"
): string {
  const versionText = version ? ` (${version})` : "";
  return `Bonjour ${companyName},\n\nJe suis intéressé par le véhicule suivant :\n${brand} ${model}${versionText}\n\nPouvez-vous me confirmer sa disponibilité et me donner plus d'informations ?\n\nMerci.`;
}

/**
 * Build WhatsApp click-to-chat message for full rental reservation
 */
export function buildWhatsAppRentalBookingMessage(params: {
  companyName?: string;
  vehicleTitle: string;
  startDate: string;
  endDate: string;
  days: number;
  dailyRate: number;
  totalPrice: number;
  pickupLocation: string;
  returnLocation: string;
  customerName: string;
  phone: string;
  campaign?: string;
}): string {
  const {
    companyName = "EL MOUSSAFIR CARS",
    vehicleTitle,
    startDate,
    endDate,
    days,
    dailyRate,
    totalPrice,
    pickupLocation,
    returnLocation,
    customerName,
    phone,
    campaign,
  } = params;

  return `Bonjour ${companyName},\n\n` +
    `Je souhaite réserver le véhicule suivant :\n` +
    `🚘 *Véhicule* : ${vehicleTitle}\n` +
    `📅 *Dates* : Du ${startDate} au ${endDate} (${days} jour${days > 1 ? "s" : ""})\n` +
    `📍 *Prise en charge* : ${pickupLocation}\n` +
    `🏁 *Restitution* : ${returnLocation}\n` +
    `💰 *Tarif estimé* : ${totalPrice.toLocaleString("fr-FR")} DA (${dailyRate.toLocaleString("fr-FR")} DA/j)\n\n` +
    `👤 *Client* : ${customerName} (${phone})\n` +
    (campaign ? `🏷️ *Origine / Code Promo* : ${campaign}\n` : "") +
    `\nPouvez-vous me confirmer la disponibilité et les modalités de remise des clés ? Merci !`;
}

export function buildWhatsAppUrl(phone: string | null | undefined, message: string): string {
  const encoded = encodeURIComponent(message);
  if (!phone || phone.trim() === "") {
    return `https://wa.me/?text=${encoded}`;
  }
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function buildGoogleMapsUrl(latitude: number, longitude: number, placeName = "EL MOUSSAFIR CARS"): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(placeName)}`;
}

/**
 * Safely formats and sanitizes vehicle image URLs / asset paths for Next.js Image component rendering.
 * Guarantees leading slashes for local assets, handles protocol upgrades, and provides clean fallbacks.
 */
export function formatVehicleImageUrl(url?: string | null): string {
  const DEFAULT_FALLBACK = "/vehicles/clio5.jpg";

  if (!url || typeof url !== "string") {
    return DEFAULT_FALLBACK;
  }

  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_FALLBACK;

  // Full URLs (http / https)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const secureUrl = trimmed.replace(/^http:\/\//i, "https://");
    if (secureUrl.includes("unsplash.com") && !secureUrl.includes("photo-")) {
      return DEFAULT_FALLBACK;
    }
    return secureUrl;
  }

  // Data URIs or Blob URLs
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Relative / local paths
  let cleanPath = trimmed;

  if (cleanPath.startsWith("./")) {
    cleanPath = cleanPath.slice(2);
  }
  if (cleanPath.startsWith("public/")) {
    cleanPath = cleanPath.slice(7);
  }

  // Ensure leading slash and proper folder prefix
  if (!cleanPath.startsWith("/")) {
    if (!cleanPath.startsWith("vehicles/")) {
      cleanPath = `/vehicles/${cleanPath}`;
    } else {
      cleanPath = `/${cleanPath}`;
    }
  }

  return cleanPath;
}
