import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleBlockUser } from "@/services/user.service";

export async function PUT(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const user = await toggleBlockUser(params.id);
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
