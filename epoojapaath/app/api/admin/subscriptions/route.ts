import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import "@/models/Temple"; // Ensure Temple model is registered for populate

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    // Fetch all bookings belonging to a subscription
    const bookings = await Booking.find({ subscriptionParentId: { $ne: null } })
      .populate("temple", "name")
      .sort({ date: 1 })
      .lean();

    const subscriptionMap = new Map<string, any>();

    for (const booking of bookings) {
      const parentId = booking.subscriptionParentId!;
      if (!subscriptionMap.has(parentId)) {
        subscriptionMap.set(parentId, {
          id: parentId,
          devoteeName: booking.devoteeName,
          gotra: booking.gotra,
          sankalp: booking.sankalp,
          serviceName: booking.serviceName,
          serviceNameHi: booking.serviceNameHi,
          templeName: (booking.temple as any)?.name || "Unknown Temple",
          duration: booking.subscriptionDuration || 1,
          totalAmount: booking.amount,
          createdAt: booking.createdAt,
          bookings: [],
        });
      }
      subscriptionMap.get(parentId).bookings.push(booking);
    }

    const subscriptions = Array.from(subscriptionMap.values()).map((sub) => {
      const subBookings = sub.bookings;
      const completedCount = subBookings.filter((b: any) => b.status === "completed").length;
      
      const startDate = subBookings[0]?.date || null;
      
      const nextBooking = subBookings.find((b: any) => b.status !== "completed" && b.status !== "cancelled");
      const nextBookingDate = nextBooking ? nextBooking.date : null;

      const status = completedCount === sub.duration ? "completed" : "active";

      return {
        id: sub.id,
        devoteeName: sub.devoteeName,
        gotra: sub.gotra,
        sankalp: sub.sankalp,
        serviceName: sub.serviceName,
        serviceNameHi: sub.serviceNameHi,
        templeName: sub.templeName,
        duration: sub.duration,
        totalAmount: sub.totalAmount,
        completedCount,
        startDate,
        nextBookingDate,
        status,
        createdAt: sub.createdAt,
      };
    });

    subscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
