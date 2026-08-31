import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { EL_MOUSSAFIR_TENANT } from "@/config/tenant/el-moussafir";
import { TITAN_CAR_TENANT } from "@/config/tenant/titan-car";

export async function POST(req: NextRequest) {
  try {
    const { message, inventory, history, tenantId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const currentTenant = tenantId === "titan_car" ? TITAN_CAR_TENANT : EL_MOUSSAFIR_TENANT;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // High-precision algorithmic intent matcher for preview without API key
      const query = message.toLowerCase();
      const matched = (inventory || []).filter(
        (v: {
          brand: string;
          model: string;
          fuelType?: string;
          transmission?: string;
          bodyType?: string;
          rentalCategory?: string;
        }) => {
          return (
            v.brand.toLowerCase().includes(query) ||
            v.model.toLowerCase().includes(query) ||
            (v.fuelType && query.includes(v.fuelType.toLowerCase())) ||
            (v.transmission && query.includes(v.transmission.toLowerCase())) ||
            (v.bodyType && query.includes(v.bodyType.toLowerCase())) ||
            (v.rentalCategory && query.includes(v.rentalCategory.toLowerCase()))
          );
        }
      );

      return NextResponse.json({
        reply:
          matched.length > 0
            ? `J'ai trouvé ${matched.length} véhicule(s) disponible(s) immédiatement chez ${currentTenant.company.name} (Boufarik, Blida, Aéroport d'Alger). Vous pouvez réserver en ligne ou nous contacter sur WhatsApp pour bloquer vos dates.`
            : `Bienvenue chez ${currentTenant.company.name} à ${currentTenant.company.city}. Notre flotte est révisée et disponible avec prise en charge express ou livraison à l'Aéroport International d'Alger Houari Boumediene. Comment puis-je vous aider pour votre séjour ou déplacement ?`,
        suggestedVehicleIds: matched.slice(0, 3).map((v: { id: string }) => v.id),
        intent: "FLEET_SEARCH",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const tenantInfo = JSON.stringify({
      name: currentTenant.company.name,
      displayName: currentTenant.company.displayName,
      category: currentTenant.company.category,
      city: currentTenant.company.city,
      wilaya: currentTenant.company.wilaya,
      address: currentTenant.company.address,
      phone: currentTenant.company.phone || "0550 00 00 00",
      whatsapp: currentTenant.company.whatsapp || "+213 550 00 00 00",
      openingHours: currentTenant.company.openingHours,
      deliveryLocations: [
        "Agence / Showroom Boufarik",
        "Blida Centre-Ville",
        "Aéroport International d'Alger Houari Boumediene (24/7)",
        "Livraison VIP Alger & environs",
      ],
      trustScore: "4.5/5 basé sur 16 avis Google vérifiés",
      conditions: {
        driverAge: "21 ans minimum (25 ans pour catégories Prestige)",
        documentsRequired: "Permis de conduire valide + Pièce d'identité ou Passeport biométrique",
        deposit: "Caution de 35 000 DA à 65 000 DA restituée au retour",
        assistance: "Assistance routière 24h/24 et 7j/7 incluse sur tout le territoire algérien",
      },
    });

    const inventoryData = JSON.stringify(
      (inventory || []).map(
        (v: {
          id: string;
          brand: string;
          model: string;
          version?: string;
          year?: number;
          mileage?: number;
          fuelType?: string;
          transmission?: string;
          dailyRate?: number;
          price?: number;
          deposit?: number;
          status: string;
          rentalCategory?: string;
          features?: string[];
        }) => ({
          id: v.id,
          title: `${v.brand} ${v.model} ${v.version || ""} (${v.year || "N/A"})`,
          dailyRateDZD: v.dailyRate ? `${v.dailyRate.toLocaleString("fr-FR")} DA / jour` : undefined,
          purchasePriceDZD: v.price ? `${v.price.toLocaleString("fr-FR")} DA` : undefined,
          depositDZD: v.deposit ? `${v.deposit.toLocaleString("fr-FR")} DA` : undefined,
          category: v.rentalCategory,
          fuel: v.fuelType,
          transmission: v.transmission,
          status: v.status,
          features: v.features?.slice(0, 5),
        })
      )
    );

    const systemInstruction = `Tu es le Conseiller Virtuel Officiel et Concierge d'élite de l'agence automobile ${currentTenant.company.name}, basée à ${currentTenant.company.city}, ${currentTenant.company.wilaya} (Algérie).

DIRECTIVES STRICTES D'INTÉGRITÉ ET VÉRITÉ (ZÉRO FABRICATION) :
1. RÈGLE D'OR : Tu dois te baser EXCLUSIVEMENT et STRICTEMENT sur les données de la flotte et les informations réelles fournies ci-dessous. Tu as l'INTERDICTION ABSOLUE d'inventer des véhicules, des tarifs, des remises, des conditions ou des disponibilités non présents dans le stock.
2. Si un client demande un véhicule ou service non répertorié, réponds avec courtoisie en proposant les alternatives existantes les plus proches dans notre flotte disponible.
3. Spécificités de l'entreprise : Prise en charge 24/7 à l'Aéroport International d'Alger Houari Boumediene, véhicules récents en excellent état, assistance 24/7, contrat clair.
4. Langues : Tu réponds fluidement dans la langue choisie par le client (Français, Arabe algérien / Darja, Arabe littéraire ou Anglais).
5. Ton : Haut de gamme, courtois, précis, rassurant et axé sur la conversion et la satisfaction client.
6. FORMAT DE RÉPONSE : À la fin de ta réponse, insère un bloc JSON strict avec l'intention détectée et les identifiants recommandés : {"intent": "BOOKING" | "PRICING" | "AIRPORT_DELIVERY" | "GENERAL", "recommendedVehicleIds": ["id1", "id2"]}.

DONNÉES DE L'ENTREPRISE :
${tenantInfo}

FLOTTE VÉHICULES ACTUELLE :
${inventoryData}`;

    const prompt = `Historique de la conversation :
${JSON.stringify(history || [])}

Message de l'utilisateur :
"${message}"

Formule une réponse claire, chaleureuse, élégante et précise. Mentionne les tarifs en Dinars Algériens (DA), les modalités de remise des clés et propose la réservation en ligne ou le contact direct.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    const fullText = response.text || "";

    let cleanReply = fullText;
    let suggestedVehicleIds: string[] = [];
    let intent = "GENERAL";

    const jsonMatch = fullText.match(/\{[\s\S]*"recommendedVehicleIds"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.recommendedVehicleIds)) {
          suggestedVehicleIds = parsed.recommendedVehicleIds;
        }
        if (parsed.intent) {
          intent = parsed.intent;
        }
        cleanReply = fullText.replace(jsonMatch[0], "").trim();
      } catch {
        // preserve text
      }
    }

    if (suggestedVehicleIds.length === 0 && inventory) {
      for (const v of inventory) {
        if (fullText.includes(v.brand) && fullText.includes(v.model)) {
          suggestedVehicleIds.push(v.id);
        }
      }
    }

    return NextResponse.json({
      reply: cleanReply,
      suggestedVehicleIds: Array.from(new Set(suggestedVehicleIds)).slice(0, 3),
      intent,
    });
  } catch (error) {
    console.error("Gemini assistant error:", error);
    return NextResponse.json(
      {
        reply:
          "Bienvenue chez EL MOUSSAFIR CARS à Boufarik. Notre équipe est à votre disposition 24h/24 pour vos réservations et livraisons à l'Aéroport d'Alger. N'hésitez pas à nous contacter directement sur WhatsApp ou par téléphone.",
        suggestedVehicleIds: [],
        intent: "GENERAL",
      },
      { status: 200 }
    );
  }
}
