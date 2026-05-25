import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Temple from "@/models/Temple";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ success: false, error: "bookingId is required" }, { status: 400 });
  }

  try {
    await connectDB();
    const review = await Review.findOne({ booking: bookingId }).lean();
    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { bookingId, templeId, rating, comment } = await req.json();

    if (!bookingId || !templeId || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Verify booking belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    if (booking.user.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return NextResponse.json({ success: false, error: "Review already exists for this booking" }, { status: 400 });
    }

    // Create review
    const review = await Review.create({
      user: session.user.id,
      temple: templeId,
      booking: bookingId,
      rating: Number(rating),
      comment,
    });

    // Recalculate temple average rating and count
    const reviews = await Review.find({ temple: templeId });
    const count = reviews.length;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / count;
    await Temple.findByIdAndUpdate(templeId, { rating: avg, reviewCount: count });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
