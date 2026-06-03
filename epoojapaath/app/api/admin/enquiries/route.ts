import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

// Admin: fetch all contact enquiries
export async function GET(_: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const enquiries = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: enquiries });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed" }, { status: 500 });
  }
}

// Admin: delete a contact enquiry
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing inquiry ID" }, { status: 400 });
    }
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed" }, { status: 500 });
  }
}
