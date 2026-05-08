"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface BlogAdminActionsProps {
  id: string;
  isFeatured: boolean;
  status: string;
}

export function BlogAdminActions({ id, isFeatured, status }: BlogAdminActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleFeature() {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/blog/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isAdminFeatured: !isFeatured }) });
      const data = await res.json();
      if (data.success) { devToast.success(isFeatured ? "Removed from featured" : "Featured on homepage ⭐"); router.refresh(); }
      else devToast.error(data.error);
    } finally { setLoading(false); }
  }

  async function deleteBlog() {
    if (!confirm("Delete this blog post?")) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { devToast.success("Blog deleted"); router.refresh(); }
      else devToast.error(data.error);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex gap-1.5">
      <Button size="sm" variant="ghost"  onClick={toggleFeature} loading={loading}>{isFeatured ? "Unfeature" : "⭐ Feature"}</Button>
      {status !== "archived" && (
        <Button size="sm" variant="danger" onClick={deleteBlog} loading={loading}>Delete</Button>
      )}
    </div>
  );
}
