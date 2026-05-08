import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Temple from "@/models/Temple";
import Booking from "@/models/Booking";
import Blog from "@/models/Blog";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    const [users, temples, bookings, blogs, revenue] = await Promise.all([
      User.countDocuments(),
      Temple.countDocuments({ status: "approved" }),
      Booking.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);
    return NextResponse.json({
      success: true,
      data: {
        users,
        temples,
        bookings,
        blogs,
        revenue: revenue[0]?.total ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
