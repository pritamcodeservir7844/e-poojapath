import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import Booking from "@/models/Booking";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const [temple, pujas, chadawas, bookings] = await Promise.all([
      Temple.findById(params.id).populate("owner", "name email phone").lean(),
      Puja.find({ temple: params.id }).lean(),
      Chadawa.find({ temple: params.id }).lean(),
      Booking.find({ temple: params.id })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);
    if (!temple) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const revenue = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.amount, 0);

    return NextResponse.json({ success: true, data: { temple, pujas, chadawas, bookings, revenue } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
