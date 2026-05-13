import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chadawa from "@/models/Chadawa";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const item = await Chadawa.findById(params.id).populate("temple", "name slug coverImage description location rating reviewCount").lean();
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
