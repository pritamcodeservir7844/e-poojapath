import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { changeUserRole } from "@/services/user.service";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const { role } = await req.json();
    const user     = await changeUserRole(params.id, role);
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
