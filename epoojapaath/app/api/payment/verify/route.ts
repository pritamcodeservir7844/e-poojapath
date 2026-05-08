import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyPaymentSignature } from "@/services/payment.service";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { orderId, paymentId, signature } = await req.json();
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Payment verified" });
  } catch {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
