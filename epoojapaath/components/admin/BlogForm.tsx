"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { devToast } from "@/lib/toast";
import { Save, Send, ArrowLeft, Loader2, PenTool, Hash, Image as ImageIcon } from "lucide-react";
import type { IBlogDoc } from "@/models/Blog";

interface BlogFormProps {
  initialData?: any; // You can type this properly based on your Blog model
  temples?: { _id: string; name: string }[];
}

export function BlogForm({ initialData, temples = [] }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    titleHi: initialData?.titleHi || "",
    excerpt: initialData?.excerpt || "",
    excerptHi: initialData?.excerptHi || "",
    content: initialData?.content || "",
    contentHi: initialData?.contentHi || "",
    coverImage: initialData?.coverImage || "",
    category: initialData?.category || "devotional",
    status: initialData?.status || "draft",
    temple: initialData?.temple?._id || "",
    tags: initialData?.tags?.join(", ") || "",
    isAdminFeatured: initialData?.isAdminFeatured || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (field: "content" | "contentHi") => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.coverImage) {
      devToast.error("Title, Content and Cover Image are required");
      return;
    }

    setLoading(true);
    try {
      const tagsArray = form.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      const payload = { ...form, tags: tagsArray, temple: form.temple || undefined };

      const url = isEditing ? `/api/admin/blog/${initialData._id}` : "/api/admin/blog";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        devToast.success(isEditing ? "Blog updated successfully" : "Blog created successfully");
        router.push("/admin/blog");
        router.refresh();
      } else {
        devToast.error(data.error || "Failed to save blog");
      }
    } catch (err) {
      console.error(err);
      devToast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-20 py-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-heading text-xl text-foreground">
              {isEditing ? "Edit Blog Post" : "Write a New Blog"}
            </h1>
            <p className="text-xs text-muted-foreground">Manage devotional content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setForm((p) => ({ ...p, status: "draft" }))}
            className={`border-border hover:border-saffron/40 ${form.status === "draft" ? "border-saffron bg-saffron/10 text-saffron" : ""}`}
          >
            Save as Draft
          </Button>
          <Button type="submit" disabled={loading} className="btn-saffron min-w-[120px] shadow-lg shadow-saffron/20">
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : form.status === "published" ? (
              <><Send size={16} /> Publish Post</>
            ) : (
              <><Save size={16} /> Save Draft</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
              <PenTool size={16} className="text-saffron" />
              <h2 className="font-heading text-base">Content Details</h2>
            </div>
            
            <Input
              label="Blog Title (English)"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. The Spiritual Significance of Mahashivratri"
              required
              className="text-lg font-heading"
            />
            
            <Input
              label="Blog Title (Hindi)"
              name="titleHi"
              value={form.titleHi}
              onChange={handleChange}
              placeholder="उदा. महाशिवरात्रि का आध्यात्मिक महत्व"
              required
              className="text-lg font-sanskrit"
            />

            <Textarea
              label="Short Excerpt (English)"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="A brief summary for the blog listing page..."
              rows={2}
            />

            <Textarea
              label="Short Excerpt (Hindi)"
              name="excerptHi"
              value={form.excerptHi}
              onChange={handleChange}
              placeholder="ब्लॉग लिस्टिंग पेज के लिए एक संक्षिप्त सारांश..."
              rows={2}
              className="font-sanskrit"
            />
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
              <PenTool size={16} className="text-saffron" />
              <h2 className="font-heading text-base">Main Article Body</h2>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Article Content (English) <span className="text-red-500">*</span></label>
              <RichTextEditor
                value={form.content}
                onChange={handleEditorChange("content")}
                placeholder="Write your devotional article here..."
              />
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Article Content (Hindi) <span className="text-red-500">*</span></label>
              <RichTextEditor
                value={form.contentHi}
                onChange={handleEditorChange("contentHi")}
                placeholder="अपना भक्ति लेख यहाँ लिखें..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar Column - Meta & Media */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
              <ImageIcon size={16} className="text-saffron" />
              <h2 className="font-heading text-base">Cover Media</h2>
            </div>
            <ImageUpload
              label="Cover Image"
              value={form.coverImage}
              onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))}
              folder="epoojapaath/blogs"
              required
              previewHeight="h-48"
            />
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
              <Hash size={16} className="text-saffron" />
              <h2 className="font-heading text-base">Meta Information</h2>
            </div>

            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={[
                { value: "devotional", label: "Devotional" },
                { value: "temple-story", label: "Temple Story" },
                { value: "festival", label: "Festival" },
                { value: "astrology", label: "Astrology" },
                { value: "announcement", label: "Announcement" },
              ]}
            />

            <Select
              label="Publish Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: "draft", label: "Draft (Hidden)" },
                { value: "published", label: "Published (Live)" },
                { value: "archived", label: "Archived" },
              ]}
            />

            {temples.length > 0 && (
              <Select
                label="Related Temple (Optional)"
                name="temple"
                value={form.temple}
                onChange={handleChange}
                options={[
                  { value: "", label: "None" },
                  ...temples.map((t) => ({ value: t._id, label: t.name })),
                ]}
              />
            )}

            <Input
              label="Tags (Comma separated)"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. shiva, mahashivratri, puja"
            />

            <label className="flex items-center gap-2 text-sm cursor-pointer mt-4 p-3 border border-border rounded-xl hover:bg-muted/30 transition">
              <input
                type="checkbox"
                name="isAdminFeatured"
                checked={form.isAdminFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded text-saffron focus:ring-saffron"
              />
              <div>
                <p className="font-medium">Feature on Homepage</p>
                <p className="text-xs text-muted-foreground">Highlight this post in the featured section.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
