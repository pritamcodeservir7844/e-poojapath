import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBookingById, updateBooking } from "@/services/booking.service";

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
    const body = await req.json();
    const updates: Record<string, any> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.paymentStatus !== undefined) updates.paymentStatus = body.paymentStatus;
    if (body.paymentId !== undefined) updates.paymentId = body.paymentId;
    if (body.videoUrl !== undefined) updates.videoUrl = body.videoUrl;
    if (body.errorMessage !== undefined) updates.errorMessage = body.errorMessage;

    const booking = await updateBooking(params.id, updates);
    return NextResponse.json({ success: true, data: booking });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
