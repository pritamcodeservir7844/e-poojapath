import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import Booking from "@/models/Booking";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const [temple, pujas, chadawas, bookings] = await Promise.all([
      Temple.findById(params.id).populate("owner", "name email phone").lean(),
      Puja.find({ temple: params.id }).lean(),
      Chadawa.find({ temple: params.id }).lean(),
      Booking.find({ temple: params.id })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);
    if (!temple) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const revenue = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.amount, 0);

    return NextResponse.json({ success: true, data: { temple, pujas, chadawas, bookings, revenue } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

// Admin: temple edit karo
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const body = await req.json();
    const temple = await Temple.findByIdAndUpdate(params.id, body, { new: true });
    if (!temple) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Public pages ko fresh data milega
    revalidatePath("/temples");
    revalidatePath(`/temples/${temple.slug}`);
    revalidatePath("/puja");
    revalidatePath("/chadawa");
    revalidatePath("/");

    return NextResponse.json({ success: true, data: temple });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

// Admin: temple delete karo (sath mein pujas + chadawas bhi)
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const temple = await Temple.findById(params.id);
    if (!temple) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const slug = temple.slug;

    // Cascade delete: temple ki pujas aur chadawas bhi delete karo
    await Promise.all([
      Puja.deleteMany({ temple: params.id }),
      Chadawa.deleteMany({ temple: params.id }),
      Temple.findByIdAndDelete(params.id),
    ]);

    revalidatePath("/temples");
    revalidatePath(`/temples/${slug}`);
    revalidatePath("/puja");
    revalidatePath("/chadawa");
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Temple aur uske sare data delete ho gaye" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
