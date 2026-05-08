import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateAd, deleteAd, trackAdImpression, trackAdClick } from "@/services/ad.service";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (body.action === "impression") { await trackAdImpression(params.id); return NextResponse.json({ success: true }); }
    if (body.action === "click")      { await trackAdClick(params.id);      return NextResponse.json({ success: true }); }
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    const ad = await updateAd(params.id, body);
    return NextResponse.json({ success: true, data: ad });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await deleteAd(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
