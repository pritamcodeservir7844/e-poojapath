import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { BlogAdminActions } from "@/components/admin/BlogAdminActions";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { formatDateShort } from "@/lib/utils";
import type { IBlog, IUser } from "@/types";

type BlogRow = IBlog & { _id: string; author: Partial<IUser> };

async function getAllBlogs() {
  await connectDB();
  return Blog.find().populate("author", "name").sort({ createdAt: -1 }).lean();
}

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const blogs = await getAllBlogs().catch(() => []) as BlogRow[];

  const columns: any[] = [
    { key: "title",          header: "Title",    render: (b: BlogRow) => <span className="font-medium text-foreground line-clamp-1">{b.title}</span> },
    { key: "author",         header: "Author",   render: (b: BlogRow) => (b.author as Partial<IUser>)?.name || "—" },
    { key: "category",       header: "Category", render: (b: BlogRow) => <Badge variant="saffron" className="capitalize">{b.category.replace("-", " ")}</Badge> },
    { key: "status",         header: "Status",   render: (b: BlogRow) => <Badge variant={b.status === "published" ? "approved" : "pending"}>{b.status}</Badge> },
    { key: "isAdminFeatured",header: "Featured", render: (b: BlogRow) => b.isAdminFeatured ? "⭐" : "—" },
    { key: "views",          header: "Views",    render: (b: BlogRow) => `${b.views || 0}` },
    { key: "publishedAt",    header: "Published",render: (b: BlogRow) => b.publishedAt ? formatDateShort(b.publishedAt) : "Draft" },
    { key: "_id",            header: "Actions",  render: (b: BlogRow) => <BlogAdminActions id={b._id.toString()} isFeatured={b.isAdminFeatured} status={b.status} /> },
  ];

  return (
    <DashboardShell title="Blog Manager" subtitle={`${blogs.length} articles across all authors`}>
      <DataTable columns={columns} data={blogs as any} emptyMessage="No blog posts yet." />
    </DashboardShell>
  );
}
