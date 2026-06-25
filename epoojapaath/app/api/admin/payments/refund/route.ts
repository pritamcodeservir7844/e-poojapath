import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { refundRazorpayPayment } from "@/services/payment.service";
import { updateBooking } from "@/services/booking.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, amount } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ success: false, error: "Payment ID is required" }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return NextResponse.json({ success: false, error: "Payment record not found" }, { status: 404 });
    }

    // Call Razorpay API to process refund
    console.log(`Initiating refund for payment ID: ${paymentId}, amount: ${amount || payment.amount}`);
    const refund = await refundRazorpayPayment(paymentId, amount);
    console.log("Refund processed successfully:", refund);

    // Update payment record in database
    payment.status = "refunded";
    if (!payment.gatewayResponse) {
      payment.gatewayResponse = {};
    }
    payment.gatewayResponse.refund = refund;
    await payment.save();

    // Update corresponding Booking(s)
    const booking = await Booking.findOne({ orderId: payment.orderId });
    if (booking) {
      await updateBooking(booking._id.toString(), {
        status: "cancelled",
        paymentStatus: "failed",
      });
    }

    return NextResponse.json({ success: true, data: refund });
  } catch (error: any) {
    console.error("Error processing refund:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to process refund" }, { status: 500 });
  }
}
