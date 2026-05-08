import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPublishedBlogs, createBlog } from "@/services/blog.service";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await auth();

  try {
    if (searchParams.get("author") === "me" && session?.user) {
      await connectDB();
      const blogs = await Blog.find({ author: session.user.id }).populate("temple", "name slug").sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: blogs });
    }
    const blogs = await getPublishedBlogs({ category: searchParams.get("category") || undefined });
    return NextResponse.json({ success: true, data: blogs });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const blog = await createBlog(body, session.user.id!);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
