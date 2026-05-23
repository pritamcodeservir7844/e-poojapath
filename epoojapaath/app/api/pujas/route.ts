import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Temple from "@/models/Temple";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q");
    const templeId = searchParams.get("temple");

    // Sirf approved temples ki pujas dikhao
    const query: Record<string, unknown> = { isActive: true };
    if (search) query.name = new RegExp(search, "i");

    if (templeId) {
      // Agar specific temple ki pujas maange, to pehle check karo temple approved hai ya nahi
      const temple = await Temple.findById(templeId).lean();
      if (!temple || (temple as any).status !== "approved") {
        return NextResponse.json({ success: true, data: [] });
      }
      query.temple = templeId;
    } else {
      // Sab pujas ke liye: temple join karke sirf approved wale lo
      const approvedTempleIds = await Temple.find({ status: "approved" }, "_id").lean();
      query.temple = { $in: approvedTempleIds.map((t: any) => t._id) };
    }

    const pujas = await Puja.find(query)
      .populate("temple", "name slug coverImage location rating status")
      .sort({ totalBooked: -1 })
      .lean();

    return NextResponse.json({ success: true, data: pujas });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
