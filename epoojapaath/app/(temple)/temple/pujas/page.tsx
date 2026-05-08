"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { devToast } from "@/lib/toast";
import type { IPuja } from "@/types";

type PujaRow = IPuja & { _id: string };

const EMPTY = { name: "", nameHi: "", description: "", descriptionHi: "", price: "", duration: "", image: "", benefits: "", includes: "", templeId: "" };

export default function TemplePujasPage() {
  const [temples, setTemples] = useState<{ value: string; label: string }[]>([]);
  const [pujas,   setPujas]   = useState<PujaRow[]>([]);
  const [form,    setForm]    = useState(EMPTY);
  const [adding,  setAdding]  = useState(false);
  const [showForm,setShowForm]= useState(false);

  useEffect(() => {
    fetch("/api/temples?owner=me").then((r) => r.json()).then((d) => {
      if (d.success) {
        const ts = d.data.filter((t: { status: string }) => t.status === "approved");
        setTemples(ts.map((t: { _id: string; name: string }) => ({ value: t._id, label: t.name })));
        if (ts[0]) {
          setForm((p) => ({ ...p, templeId: ts[0]._id }));
          fetchPujas(ts[0]._id);
        }
      }
    });
  }, []);

  function fetchPujas(tid: string) {
    fetch(`/api/temples/${tid}/pujas`).then((r) => r.json()).then((d) => { if (d.success) setPujas(d.data); });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const payload = {
        ...form, price: Number(form.price), temple: form.templeId,
        benefits: form.benefits.split(",").map((s) => s.trim()).filter(Boolean),
        includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res  = await fetch(`/api/temples/${form.templeId}/pujas`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        devToast.success("Puja added 🙏");
        setPujas((p) => [...p, data.data]);
        setShowForm(false);
        setForm({ ...EMPTY, templeId: form.templeId });
      } else devToast.error(data.error);
    } finally { setAdding(false); }
  }

  const columns: any[] = [
    { key: "name",       header: "Name"    },
    { key: "nameHi",     header: "Hindi",  render: (p: PujaRow) => <span className="font-sanskrit text-saffron">{p.nameHi}</span> },
    { key: "price",      header: "Price",  render: (p: PujaRow) => formatCurrency(p.price) },
    { key: "duration",   header: "Duration" },
    { key: "totalBooked",header: "Booked", render: (p: PujaRow) => `${p.totalBooked}+` },
    { key: "isActive",   header: "Status", render: (p: PujaRow) => <Badge variant={p.isActive ? "approved" : "rejected"}>{p.isActive ? "Active" : "Inactive"}</Badge> },
  ];

  return (
    <DashboardShell
      title="Manage Pujas"
      subtitle="Add and manage puja services for your temples."
      action={<Button onClick={() => setShowForm(!showForm)} size="sm">{showForm ? "Cancel" : "+ Add Puja"}</Button>}
    >
      {temples.length > 1 && (
        <Select className="mb-6 max-w-xs" options={temples} value={form.templeId}
          onChange={(e) => { setForm((p) => ({ ...p, templeId: e.target.value })); fetchPujas(e.target.value); }} />
      )}

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-heading text-lg text-dark mb-4">Add New Puja</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Puja Name (English)" required value={form.name}           onChange={set("name")}           placeholder="Rudrabhishek" />
            <Input label="Puja Name (Hindi)"   required value={form.nameHi}         onChange={set("nameHi")}         placeholder="रुद्राभिषेक" />
            <Input label="Price (₹)"           required value={form.price}          onChange={set("price")} type="number" placeholder="2100" />
            <Input label="Duration"            required value={form.duration}       onChange={set("duration")}       placeholder="2 hours" />
            <Input label="Image URL"           required value={form.image}          onChange={set("image")}          placeholder="https://..." />
            <Input label="Benefits (comma separated)"  value={form.benefits}        onChange={set("benefits")}       placeholder="Health, Prosperity" />
            <Textarea label="Description (English)" required value={form.description}    onChange={set("description")} rows={2} className="md:col-span-2" />
            <Textarea label="Description (Hindi)"   required value={form.descriptionHi} onChange={set("descriptionHi")} rows={2} className="md:col-span-2" />
            <Input label="Includes (comma separated)"  value={form.includes}        onChange={set("includes")}       placeholder="Abhishek, Aarti, Prasad" className="md:col-span-2" />
            <div className="md:col-span-2">
              <Button type="submit" loading={adding} fullWidth>Add Puja</Button>
            </div>
          </form>
        </Card>
      )}

      <DataTable columns={columns} data={pujas as any} emptyMessage="No pujas added yet." />
    </DashboardShell>
  );
}
