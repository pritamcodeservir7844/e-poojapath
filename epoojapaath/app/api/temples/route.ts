import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getApprovedTemples, createTemple } from "@/services/temple.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const temples = await getApprovedTemples({
      city: searchParams.get("city") || undefined,
      deity: searchParams.get("deity") || undefined,
      featured: searchParams.get("featured") === "true",
    });
    return NextResponse.json({ success: true, data: temples });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch temples" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const temple = await createTemple(body, session.user.id!);
    return NextResponse.json({ success: true, data: temple }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
