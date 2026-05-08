import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllAds, createAd } from "@/services/ad.service";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const ads = await getAllAds();
    return NextResponse.json({ success: true, data: ads });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const ad   = await createAd(body, session.user.id!);
    return NextResponse.json({ success: true, data: ad }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
