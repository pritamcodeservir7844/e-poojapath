import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

// GET all pujas (admin)
export async function GET(_: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const pujas = await Puja.find({})
      .populate("temple", "name slug coverImage location")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: pujas });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
