import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Booking from "@/models/Booking";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [templeCount, bookingCount, cities, devotees] = await Promise.all([
      Temple.countDocuments({ status: "approved" }),
      Booking.countDocuments({ status: { $in: ["confirmed", "completed"] } }),
      Temple.distinct("location.city"),
      Booking.distinct("devoteeName"),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        temples: templeCount,
        bookings: bookingCount + 280,
        cities: cities.length + 4,
        devotees: devotees.length + 325,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
