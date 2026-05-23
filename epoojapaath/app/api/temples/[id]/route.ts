import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTempleById, updateTemple } from "@/services/temple.service";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const temple = await getTempleById(params.id);
    if (!temple) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: temple });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const temple = await updateTemple(params.id, body);
    return NextResponse.json({ success: true, data: temple });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
