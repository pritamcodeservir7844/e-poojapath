import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import TempleRequest from "@/models/TempleRequest";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const requests = await TempleRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
