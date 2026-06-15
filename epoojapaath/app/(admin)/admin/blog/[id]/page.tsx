import { BlogForm } from "@/components/admin/BlogForm";
import { getAllTemplesAdmin } from "@/services/temple.service";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getBlogById(id: string) {
  await connectDB();
  return Blog.findById(id).lean() as any;
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const [rawTemples, rawBlog] = await Promise.all([
    getAllTemplesAdmin(),
    getBlogById(params.id),
  ]);

  if (!rawBlog) {
    notFound();
  }

  const temples = rawTemples.map((t: any) => ({
    _id: t._id.toString(),
    name: t.name,
  }));

  const blog = {
    ...rawBlog,
    _id: rawBlog._id.toString(),
    author: rawBlog.author.toString(),
    temple: rawBlog.temple ? { _id: rawBlog.temple.toString() } : undefined,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BlogForm initialData={blog} temples={temples} />
    </div>
  );
}
