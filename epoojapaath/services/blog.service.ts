import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { slugify } from "@/lib/utils";

export async function getPublishedBlogs(filters: { category?: string; search?: string } = {}) {
  await connectDB();
  const query: Record<string, unknown> = { status: "published" };
  if (filters.category && filters.category !== "all") query.category = filters.category;
  if (filters.search) query.$text = { $search: filters.search };
  return Blog.find(query)
    .populate("author", "name avatar")
    .populate("temple", "name slug")
    .sort({ publishedAt: -1 })
    .lean();
}

export async function getBlogBySlug(slug: string) {
  await connectDB();
  const blog = await Blog.findOne({ slug, status: "published" })
    .populate("author", "name avatar")
    .populate("temple", "name slug");
  if (blog) await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
  return blog?.toObject();
}

export async function getFeaturedBlogs() {
  await connectDB();
  return Blog.find({ status: "published", isAdminFeatured: true })
    .populate("author", "name avatar")
    .limit(3)
    .sort({ publishedAt: -1 })
    .lean();
}

export async function createBlog(data: Record<string, unknown>, authorId: string) {
  await connectDB();
  const slug = slugify(data.title as string);
  const exists = await Blog.findOne({ slug });
  const finalSlug = exists ? `${slug}-${Date.now()}` : slug;
  return Blog.create({
    ...data,
    slug: finalSlug,
    author: authorId,
    publishedAt: data.status === "published" ? new Date() : undefined,
  });
}

export async function updateBlog(id: string, data: Record<string, unknown>) {
  await connectDB();
  if (data.status === "published") {
    const existing = await Blog.findById(id);
    if (existing && existing.status !== "published") {
      (data as Record<string, unknown>).publishedAt = new Date();
    }
  }
  return Blog.findByIdAndUpdate(id, data, { new: true });
}

export async function getTempleBlogsBySlug(templeId: string) {
  await connectDB();
  return Blog.find({ temple: templeId, status: "published" })
    .populate("author", "name avatar")
    .sort({ publishedAt: -1 })
    .lean();
}
