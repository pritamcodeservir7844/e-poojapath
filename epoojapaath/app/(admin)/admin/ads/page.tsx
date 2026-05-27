"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { devToast } from "@/lib/toast";
import { formatDateShort } from "@/lib/utils";
import type { IAd } from "@/types";

type AdRow = IAd & { _id: string };

const PLACEMENTS = [
  { value: "hero",               label: "Hero Banner"         },
  { value: "sidebar",            label: "Sidebar"             },
  { value: "footer",             label: "Footer"              },
  { value: "between-sections",   label: "Between Sections"    },
];

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getEmptyForm = () => ({
  title: "",
  imageUrl: "",
  linkUrl: "",
  placement: "hero",
  startDate: getTodayString(),
  endDate: "",
});

export default function AdminAdsPage() {
  const [ads,     setAds]     = useState<AdRow[]>([]);
  const [form,    setForm]    = useState(getEmptyForm);
  const [saving,  setSaving]  = useState(false);
  const [showForm,setShowForm]= useState(false);
  const [imageSourceType, setImageSourceType] = useState<"upload" | "url">("upload");

  useEffect(() => {
    fetch("/api/admin/ads").then((r) => r.json()).then((d) => { if (d.success) setAds(d.data); });
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) {
      devToast.error("Ad image is required");
      return;
    }
    setSaving(true);
    try {
      const res  = await fetch("/api/admin/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        devToast.success("Ad created 📢");
        setAds((p) => [...p, data.data]);
        setShowForm(false);
        setForm(getEmptyForm());
      } else devToast.error(data.error);
    } finally { setSaving(false); }
  }

  async function toggleAd(id: string, isActive: boolean) {
    const res  = await fetch(`/api/admin/ads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
    const data = await res.json();
    if (data.success) { devToast.success("Ad updated"); setAds((p) => p.map((a) => a._id.toString() === id ? { ...a, isActive: !isActive } : a)); }
    else devToast.error(data.error);
  }

  async function deleteAd(id: string) {
    if (!confirm("Delete this ad?")) return;
    const res  = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { devToast.success("Ad deleted"); setAds((p) => p.filter((a) => a._id.toString() !== id)); }
    else devToast.error(data.error);
  }

  const columns: any[] = [
    { key: "title",     header: "Title" },
    { key: "placement", header: "Placement", render: (a: AdRow) => <Badge variant="blue">{a.placement}</Badge> },
    { key: "isActive",  header: "Status",    render: (a: AdRow) => <Badge variant={a.isActive ? "approved" : "rejected"}>{a.isActive ? "Active" : "Inactive"}</Badge> },
    { key: "clicks",    header: "Clicks",    render: (a: AdRow) => `${a.clicks || 0}` },
    { key: "impressions",header:"Impressions",render: (a: AdRow) => `${a.impressions || 0}` },
    { key: "endDate",   header: "Expires",   render: (a: AdRow) => formatDateShort(a.endDate) },
    { key: "_id",       header: "Actions",   render: (a: AdRow) => (
      <div className="flex gap-1.5">
        <Button size="sm" variant={a.isActive ? "danger" : "saffron"} onClick={() => toggleAd(a._id.toString(), a.isActive)}>
          {a.isActive ? "Pause" : "Activate"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => deleteAd(a._id.toString())}>Del</Button>
      </div>
    )},
  ];

  return (
    <DashboardShell
      title="Ads Manager"
      subtitle="Create and manage ad banners across the platform."
      action={<Button onClick={() => setShowForm(!showForm)} size="sm">{showForm ? "Cancel" : "+ New Ad"}</Button>}
    >
      {showForm && (
        <Card className="mb-6">
          <h3 className="font-heading text-lg text-foreground mb-4">Create Ad</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ad Title"       required value={form.title}    onChange={set("title")}    placeholder="Ad title" />
            <Select label="Placement"     options={PLACEMENTS} value={form.placement} onChange={set("placement") as (e: React.ChangeEvent<HTMLSelectElement>) => void} />
            
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">Ad Image *</label>
              <div className="flex gap-4 border-b border-border/50 pb-2">
                <button
                  type="button"
                  onClick={() => setImageSourceType("upload")}
                  className={`text-xs font-bold pb-1 transition-all ${imageSourceType === "upload" ? "border-b-2 border-saffron text-saffron" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Upload Image File
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceType("url")}
                  className={`text-xs font-bold pb-1 transition-all ${imageSourceType === "url" ? "border-b-2 border-saffron text-saffron" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Paste External URL
                </button>
              </div>
              {imageSourceType === "upload" ? (
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                  folder="ads"
                />
              ) : (
                <Input
                  required
                  value={form.imageUrl}
                  onChange={set("imageUrl")}
                  placeholder="https://... (External Image URL)"
                />
              )}
            </div>

            <Input label="Link URL"       required value={form.linkUrl}  onChange={set("linkUrl")}  placeholder="https://..." className="md:col-span-2" />
            <Input label="Start Date"     required value={form.startDate} onChange={set("startDate")} type="date" />
            <Input label="End Date"       required value={form.endDate}   onChange={set("endDate")}   type="date" />
            <div className="md:col-span-2"><Button type="submit" loading={saving} fullWidth>Create Ad</Button></div>
          </form>
        </Card>
      )}
      <DataTable columns={columns} data={ads as any} emptyMessage="No ads created yet." />
    </DashboardShell>
  );
}
