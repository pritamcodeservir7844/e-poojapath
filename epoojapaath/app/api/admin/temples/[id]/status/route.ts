import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateTempleStatus } from "@/services/temple.service";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const { status } = await req.json();
    const temple = await updateTempleStatus(params.id, status);
    return NextResponse.json({ success: true, data: temple });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
