import { NextResponse } from "next/server";
import { getAllBookingsAdmin } from "@/services/booking.service";

export async function GET() {
  try {
    const data = await getAllBookingsAdmin({});
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
