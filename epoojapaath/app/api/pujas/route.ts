import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q");
    const templeId = searchParams.get("temple");

    const query: Record<string, unknown> = { isActive: true };
    if (search) query.name = new RegExp(search, "i");
    if (templeId) query.temple = templeId;

    const pujas = await Puja.find(query)
      .populate("temple", "name slug coverImage location rating")
      .sort({ totalBooked: -1 })
      .lean();

    return NextResponse.json({ success: true, data: pujas });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
