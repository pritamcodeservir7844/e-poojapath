import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBookingById, updateBookingStatus } from "@/services/booking.service";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const booking = await getBookingById(params.id);
    if (!booking) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: booking });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { status } = await req.json();
    const booking    = await updateBookingStatus(params.id, status);
    return NextResponse.json({ success: true, data: booking });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
