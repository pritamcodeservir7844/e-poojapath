import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import { getAllTemplesAdmin, createTemple } from "@/services/temple.service";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

// Admin: all temples list
export async function GET(_: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const temples = await getAllTemplesAdmin();
    return NextResponse.json({ success: true, data: temples });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

// Admin: temple create karo (auto approved)
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const body = await req.json();
    const slug = slugify(body.name as string);
    const exists = await Temple.findOne({ slug });
    const finalSlug = exists ? `${slug}-${Date.now()}` : slug;
    const temple = await Temple.create({
      ...body,
      slug: finalSlug,
      owner: session.user.id,
      status: "approved",
    });
    return NextResponse.json({ success: true, data: temple }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
