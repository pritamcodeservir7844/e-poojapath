import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Chadawa from "@/models/Chadawa";
import Temple from "@/models/Temple";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

// Admin: temple ke liye naya chadawa add karo (auto approved + active)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const body = await req.json();
    const item = await Chadawa.create({
      ...body,
      temple: params.id,
      status: "approved",
      isActive: true,
    });

    const temple = await Temple.findById(params.id).select("slug").lean() as { slug?: string } | null;
    revalidatePath("/chadawa");
    if (temple?.slug) revalidatePath(`/temples/${temple.slug}`);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
