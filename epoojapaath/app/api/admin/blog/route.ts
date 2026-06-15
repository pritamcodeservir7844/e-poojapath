import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { createBlog } from "@/services/blog.service";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    const blogs = await Blog.find().populate("author", "name email").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: blogs });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const blog = await createBlog(body, session.user.id as string);
    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create blog" }, { status: 500 });
  }
}
