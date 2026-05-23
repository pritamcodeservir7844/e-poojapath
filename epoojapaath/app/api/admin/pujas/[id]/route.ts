import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Puja from "@/models/Puja";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const body = await req.json();
    const puja = await Puja.findByIdAndUpdate(params.id, body, { new: true });
    if (!puja) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    revalidatePath("/puja");
    revalidatePath(`/puja/${params.id}`);
    return NextResponse.json({ success: true, data: puja });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const puja = await Puja.findByIdAndDelete(params.id);
    if (!puja) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    revalidatePath("/puja");
    return NextResponse.json({ success: true, message: "Puja deleted successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
