import { NextRequest, NextResponse } from "next/server";
import { INITIAL_VEHICLES } from "@/lib/db/mock-vehicles";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const status = searchParams.get("status");

  let filtered = [...INITIAL_VEHICLES];

  if (brand && brand !== "ALL") {
    filtered = filtered.filter((v) => v.brand.toLowerCase() === brand.toLowerCase());
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((v) => v.status === status);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    vehicles: filtered,
  });
}
