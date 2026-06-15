import { BlogForm } from "@/components/admin/BlogForm";
import { getAllTemplesAdmin } from "@/services/temple.service";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const rawTemples = await getAllTemplesAdmin();
  const temples = rawTemples.map((t: any) => ({
    _id: t._id.toString(),
    name: t.name,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BlogForm temples={temples} />
    </div>
  );
}
