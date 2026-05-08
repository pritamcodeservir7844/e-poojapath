import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import TempleMember from "@/models/TempleMember";
import User from "@/models/User";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const members = await TempleMember.find({ temple: params.id }).populate("user", "name email avatar").lean();
    return NextResponse.json({ success: true, data: members });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { email, role, permissions } = await req.json();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: "User with this email not found" }, { status: 404 });
    const member = await TempleMember.create({ temple: params.id, user: user._id, role, permissions, invitedBy: session.user.id, status: "active" });
    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
