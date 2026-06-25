import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { updateBooking } from "@/services/booking.service";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      console.warn("Webhook attempt missing signature or webhook secret is unset");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log("Razorpay Webhook Event Received:", event);

    await connectDB();

    if (event === "order.paid") {
      const order = payload.payload.order.entity;
      const orderId = order.id;

      let payment = await Payment.findOne({ orderId });
      if (!payment) {
        const booking = await Booking.findOne({ orderId });
        if (booking) {
          payment = await Payment.create({
            user: booking.user,
            booking: booking._id,
            orderId: orderId,
            amount: order.amount / 100,
            status: "success",
            paymentMethod: "webhook",
            gatewayResponse: payload,
          });
        }
      } else {
        payment.status = "success";
        payment.gatewayResponse = payload;
        await payment.save();
      }

      const firstBooking = await Booking.findOne({ orderId });
      if (firstBooking) {
        await updateBooking(firstBooking._id.toString(), {
          paymentStatus: "paid",
          status: "confirmed",
        });
      }
    } else if (event === "payment.captured") {
      const p = payload.payload.payment.entity;
      const orderId = p.order_id;
      const paymentId = p.id;
      const paymentMethod = p.method;

      let payment = await Payment.findOne({ orderId });
      if (!payment) {
        const booking = await Booking.findOne({ orderId });
        if (booking) {
          payment = await Payment.create({
            user: booking.user,
            booking: booking._id,
            orderId: orderId,
            paymentId,
            paymentMethod,
            amount: p.amount / 100,
            status: "success",
            gatewayResponse: payload,
          });
        }
      } else {
        payment.status = "success";
        payment.paymentId = paymentId;
        payment.paymentMethod = paymentMethod;
        payment.gatewayResponse = payload;
        await payment.save();
      }

      const firstBooking = await Booking.findOne({ orderId });
      if (firstBooking) {
        await updateBooking(firstBooking._id.toString(), {
          paymentStatus: "paid",
          status: "confirmed",
          paymentId,
        });
      }
    } else if (event === "payment.failed") {
      const p = payload.payload.payment.entity;
      const orderId = p.order_id;
      const paymentId = p.id;
      const errorMessage = p.error_description || p.error_reason || "Payment failed";

      let payment = await Payment.findOne({ orderId });
      if (!payment) {
        const booking = await Booking.findOne({ orderId });
        if (booking) {
          payment = await Payment.create({
            user: booking.user,
            booking: booking._id,
            orderId: orderId,
            paymentId,
            amount: p.amount / 100,
            status: "failed",
            errorMessage,
            gatewayResponse: payload,
          });
        }
      } else {
        payment.status = "failed";
        payment.paymentId = paymentId;
        payment.errorMessage = errorMessage;
        payment.gatewayResponse = payload;
        await payment.save();
      }

      const firstBooking = await Booking.findOne({ orderId });
      if (firstBooking) {
        await updateBooking(firstBooking._id.toString(), {
          paymentStatus: "failed",
          paymentId,
          errorMessage,
        });
      }
    } else if (event === "refund.processed") {
      const r = payload.payload.refund.entity;
      const paymentId = r.payment_id;

      let payment = await Payment.findOne({ paymentId });
      if (payment) {
        payment.status = "refunded";
        payment.gatewayResponse = payload;
        await payment.save();

        const orderId = payment.orderId;
        const firstBooking = await Booking.findOne({ orderId });
        if (firstBooking) {
          await updateBooking(firstBooking._id.toString(), {
            status: "cancelled",
            paymentStatus: "failed",
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error in webhook handler:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
