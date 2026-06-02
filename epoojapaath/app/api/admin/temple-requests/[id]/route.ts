import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import TempleRequest from "@/models/TempleRequest";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

// Update status of a request
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ["pending", "contacted", "completed", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updatedRequest = await TempleRequest.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update status" },
      { status: 500 }
    );
  }
}

// Delete a request
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const deletedRequest = await TempleRequest.findByIdAndDelete(params.id);

    if (!deletedRequest) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Request deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete request" },
      { status: 500 }
    );
  }
}
