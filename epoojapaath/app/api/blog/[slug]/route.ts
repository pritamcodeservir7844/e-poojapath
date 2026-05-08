import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBlogBySlug, updateBlog } from "@/services/blog.service";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: blog });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const existing = await Blog.findOne({ slug: params.slug });
    if (!existing) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    const body = await req.json();
    const blog = await updateBlog(existing._id.toString(), body);
    return NextResponse.json({ success: true, data: blog });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    await Blog.findOneAndDelete({ slug: params.slug });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
