import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createBooking, getUserBookings } from "@/services/booking.service";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const bookings = await getUserBookings(session.user.id!);
    return NextResponse.json({ success: true, data: bookings });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body    = await req.json();
    const booking = await createBooking({ ...body, user: session.user.id });
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
