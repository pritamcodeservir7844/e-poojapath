import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const puja = await Puja.findById(params.id).populate("temple", "name slug coverImage description location rating reviewCount timings status").lean();
    if (!puja) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Agar temple approved nahi hai to puja bhi nahi dikhayenge
    const temple = (puja as any).temple;
    if (!temple || temple.status !== "approved") {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: puja });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
