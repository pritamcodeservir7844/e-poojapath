"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { devToast } from "@/lib/toast";
import type { IChadawa } from "@/types";

type Row = IChadawa & { _id: string };
const EMPTY = { name: "", nameHi: "", description: "", descriptionHi: "", price: "", deity: "", image: "", items: "", templeId: "" };

export default function TempleChadawaPage() {
  const [temples, setTemples] = useState<{ value: string; label: string }[]>([]);
  const [rows,    setRows]    = useState<Row[]>([]);
  const [form,    setForm]    = useState(EMPTY);
  const [adding,  setAdding]  = useState(false);
  const [showForm,setShowForm]= useState(false);

  useEffect(() => {
    fetch("/api/temples?owner=me").then((r) => r.json()).then((d) => {
      if (d.success) {
        const ts = d.data.filter((t: { status: string }) => t.status === "approved");
        setTemples(ts.map((t: { _id: string; name: string }) => ({ value: t._id, label: t.name })));
        if (ts[0]) { setForm((p) => ({ ...p, templeId: ts[0]._id })); fetchRows(ts[0]._id); }
      }
    });
  }, []);

  function fetchRows(tid: string) {
    fetch(`/api/temples/${tid}/chadawa`).then((r) => r.json()).then((d) => { if (d.success) setRows(d.data); });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const payload = { ...form, price: Number(form.price), temple: form.templeId, items: form.items.split(",").map((s) => s.trim()).filter(Boolean) };
      const res  = await fetch(`/api/temples/${form.templeId}/chadawa`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        devToast.success("Chadawa offering added 🌸");
        setRows((p) => [...p, data.data]);
        setShowForm(false);
        setForm({ ...EMPTY, templeId: form.templeId });
      } else devToast.error(data.error);
    } finally { setAdding(false); }
  }

  const columns = [
    { key: "name",  header: "Name",  render: (r: Row) => <span>{r.name} <span className="font-sanskrit text-saffron text-xs ml-1">{r.nameHi}</span></span> },
    { key: "deity", header: "Deity" },
    { key: "price", header: "Price", render: (r: Row) => formatCurrency(r.price) },
    { key: "items", header: "Items", render: (r: Row) => `${r.items.length} items` },
  ];

  return (
    <DashboardShell
      title="Chadawa Offerings"
      subtitle="Manage divine offerings available at your temples."
      action={<Button onClick={() => setShowForm(!showForm)} size="sm">{showForm ? "Cancel" : "+ Add Offering"}</Button>}
    >
      {temples.length > 1 && (
        <Select className="mb-6 max-w-xs" options={temples} value={form.templeId}
          onChange={(e) => { setForm((p) => ({ ...p, templeId: e.target.value })); fetchRows(e.target.value); }} />
      )}

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-heading text-lg text-dark mb-4">Add Chadawa Offering</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name (English)"  required value={form.name}           onChange={set("name")}           placeholder="Bilva Patra Offering" />
            <Input label="Name (Hindi)"    required value={form.nameHi}         onChange={set("nameHi")}         placeholder="बेलपत्र अर्पण" />
            <Input label="Deity"           required value={form.deity}          onChange={set("deity")}          placeholder="Lord Shiva" />
            <Input label="Price (₹)"       required value={form.price}          onChange={set("price")} type="number" placeholder="151" />
            <Input label="Image URL"       required value={form.image}          onChange={set("image")}          placeholder="https://..." />
            <Input label="Items (comma separated)"  value={form.items}          onChange={set("items")}          placeholder="Bilva leaves, Gangajal" />
            <Textarea label="Description (English)" required value={form.description}    onChange={set("description")} rows={2} className="md:col-span-2" />
            <Textarea label="Description (Hindi)"   required value={form.descriptionHi} onChange={set("descriptionHi")} rows={2} className="md:col-span-2" />
            <div className="md:col-span-2"><Button type="submit" loading={adding} fullWidth>Add Offering</Button></div>
          </form>
        </Card>
      )}

      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} emptyMessage="No chadawa offerings yet." />
    </DashboardShell>
  );
}
