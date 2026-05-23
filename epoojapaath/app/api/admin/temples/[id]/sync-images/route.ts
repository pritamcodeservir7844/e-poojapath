import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

// Admin: temple ke pujas/chadawas ki image ko temple cover image se sync karo
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  try {
    await connectDB();
    const temple = await Temple.findById(params.id).lean();
    if (!temple) return NextResponse.json({ success: false, error: "Temple not found" }, { status: 404 });

    const coverImage = temple.coverImage;
    if (!coverImage) return NextResponse.json({ success: false, error: "Temple cover image nahi hai" }, { status: 400 });

    // Sare pujas update karo jahan image empty hai
    const pujaResult = await Puja.updateMany(
      { temple: params.id, $or: [{ image: "" }, { image: null }, { image: { $exists: false } }] },
      { $set: { image: coverImage } }
    );

    // Sare chadawas update karo jahan image empty hai
    const chadawaResult = await Chadawa.updateMany(
      { temple: params.id, $or: [{ image: "" }, { image: null }, { image: { $exists: false } }] },
      { $set: { image: coverImage } }
    );

    revalidatePath("/puja");
    revalidatePath("/chadawa");
    if (temple.slug) {
      revalidatePath(`/temples/${temple.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: `${pujaResult.modifiedCount} pujas aur ${chadawaResult.modifiedCount} chadawas update ho gaye`,
      pujas: pujaResult.modifiedCount,
      chadawas: chadawaResult.modifiedCount,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
