import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const members = await User.find({ role: { $in: ["admin", "temple_owner"] } })
      .select("name email role createdAt isBlocked")
      .sort({ role: 1, createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: members });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const { email, role } = await req.json();
    if (!email || !["admin", "temple_owner"].includes(role))
      return NextResponse.json({ success: false, error: "Invalid email or role" }, { status: 400 });

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role },
      { new: true }
    ).select("name email role");

    if (!user)
      return NextResponse.json({ success: false, error: "No user found with that email" }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const { email } = await req.json();
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: "user" },
      { new: true }
    ).select("name email role");

    if (!user)
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
