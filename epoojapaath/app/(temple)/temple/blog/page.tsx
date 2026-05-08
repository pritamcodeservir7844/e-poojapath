"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { devToast } from "@/lib/toast";
import { formatDateShort } from "@/lib/utils";
import type { IBlog } from "@/types";

type BlogRow = IBlog & { _id: string };

const CATEGORIES = [
  { value: "devotional",   label: "Devotional"   },
  { value: "temple-story", label: "Temple Story" },
  { value: "festival",     label: "Festival"     },
  { value: "astrology",    label: "Astrology"    },
  { value: "announcement", label: "Announcement" },
];

const EMPTY = { title: "", titleHi: "", excerpt: "", excerptHi: "", content: "", contentHi: "", coverImage: "", category: "devotional", tags: "", templeId: "", status: "draft" };

export default function TempleBlogPage() {
  const [temples, setTemples] = useState<{ value: string; label: string }[]>([]);
  const [blogs,   setBlogs]   = useState<BlogRow[]>([]);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [showForm,setShowForm]= useState(false);

  useEffect(() => {
    fetch("/api/temples?owner=me").then((r) => r.json()).then((d) => {
      if (d.success) {
        const ts = d.data.filter((t: { status: string }) => t.status === "approved");
        setTemples(ts.map((t: { _id: string; name: string }) => ({ value: t._id, label: t.name })));
        if (ts[0]) { setForm((p) => ({ ...p, templeId: ts[0]._id })); fetchBlogs(); }
      }
    });
  }, []);

  function fetchBlogs() {
    fetch("/api/blog?author=me").then((r) => r.json()).then((d) => { if (d.success) setBlogs(d.data); });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, temple: form.templeId, tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean) };
      const res  = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        devToast.success("Blog saved 📝");
        setBlogs((p) => [...p, data.data]);
        setShowForm(false);
        setForm({ ...EMPTY, templeId: form.templeId });
      } else devToast.error(data.error);
    } finally { setSaving(false); }
  }

  const columns = [
    { key: "title",       header: "Title"    },
    { key: "category",    header: "Category", render: (b: BlogRow) => <Badge variant="saffron" className="capitalize">{b.category.replace("-", " ")}</Badge> },
    { key: "status",      header: "Status",   render: (b: BlogRow) => <Badge variant={b.status === "published" ? "approved" : "pending"}>{b.status}</Badge> },
    { key: "publishedAt", header: "Published",render: (b: BlogRow) => b.publishedAt ? formatDateShort(b.publishedAt) : "—" },
    { key: "_id",         header: "",         render: (b: BlogRow) => <a href={`/blog/${b.slug}`} className="text-saffron text-xs hover:underline" target="_blank">View →</a> },
  ];

  return (
    <DashboardShell
      title="Temple Blog"
      subtitle="Write and manage blog posts for your temple."
      action={<Button onClick={() => setShowForm(!showForm)} size="sm">{showForm ? "Cancel" : "+ New Post"}</Button>}
    >
      {showForm && (
        <Card className="mb-6">
          <h3 className="font-heading text-lg text-dark mb-4">New Blog Post</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title (English)"  required value={form.title}       onChange={set("title")}       placeholder="Post title" />
            <Input label="Title (Hindi)"    required value={form.titleHi}     onChange={set("titleHi")}     placeholder="पोस्ट शीर्षक" />
            <Input label="Excerpt (English)"required value={form.excerpt}     onChange={set("excerpt")}     placeholder="Short summary" />
            <Input label="Excerpt (Hindi)"  required value={form.excerptHi}   onChange={set("excerptHi")}   placeholder="संक्षिप्त विवरण" />
            <Select label="Category" options={CATEGORIES} value={form.category} onChange={set("category") as (e: React.ChangeEvent<HTMLSelectElement>) => void} className="md:col-span-2 max-w-xs" />
            {temples.length > 0 && (
              <Select label="Temple" options={temples} value={form.templeId} onChange={set("templeId") as (e: React.ChangeEvent<HTMLSelectElement>) => void} />
            )}
            <Select label="Status" options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Publish Now" }]} value={form.status} onChange={set("status") as (e: React.ChangeEvent<HTMLSelectElement>) => void} />
            <Input label="Cover Image URL" required value={form.coverImage} onChange={set("coverImage")} placeholder="https://..." className="md:col-span-2" />
            <Input label="Tags (comma separated)"   value={form.tags}       onChange={set("tags")}       placeholder="shiva, festival" className="md:col-span-2" />
            <Textarea label="Content (English)" required value={form.content}    onChange={set("content")}    rows={5} className="md:col-span-2" placeholder="Full article content (HTML allowed)" />
            <Textarea label="Content (Hindi)"   required value={form.contentHi} onChange={set("contentHi")} rows={5} className="md:col-span-2" placeholder="हिंदी में पूरा लेख" />
            <div className="md:col-span-2"><Button type="submit" loading={saving} fullWidth>Save Post</Button></div>
          </form>
        </Card>
      )}
      <DataTable columns={columns} data={blogs as unknown as Record<string, unknown>[]} emptyMessage="No blog posts yet." />
    </DashboardShell>
  );
}
