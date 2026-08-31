import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  fullName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phone: z.string().min(8, "Le numéro de téléphone est requis"),
  email: z.string().email("Adresse email invalide").optional().or(z.literal("")),
  vehicleId: z.string().optional(),
  vehicleTitle: z.string().optional(),
  inquiryType: z.enum(["VEHICLE", "PRICE_REQUEST", "AVAILABILITY", "VISIT", "TRADE_IN", "GENERAL"]),
  message: z.string().min(3, "Veuillez préciser votre demande"),
  preferredContact: z.enum(["WHATSAPP", "PHONE", "EMAIL"]).default("WHATSAPP"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Une erreur est survenue. Vérifiez vos informations et réessayez.",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    const newLead = {
      id: `lead_${Date.now()}`,
      companyId: "titan_car",
      ...result.data,
      source: "website_api",
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Votre demande a bien été envoyée. TITAN CAR vous contactera prochainement.",
        lead: newLead,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Une erreur est survenue. Vérifiez vos informations et réessayez.",
      },
      { status: 500 }
    );
  }
}
