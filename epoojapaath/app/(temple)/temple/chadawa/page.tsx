"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { devToast } from "@/lib/toast";
import type { IChadawa, IChadawaOfferingItem } from "@/types";

type Row = IChadawa & { _id: string };

const EMPTY_FORM = {
  name: "", nameHi: "", description: "", descriptionHi: "",
  price: "", deity: "", image: "", items: "", templeId: "",
};

const EMPTY_ITEM: Omit<IChadawaOfferingItem, "price"> & { price: string } = {
  name: "", nameHi: "", price: "", image: "", description: "",
};

export default function TempleChadawaPage() {
  const [temples, setTemples] = useState<{ value: string; label: string }[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [offeringItems, setOfferingItems] = useState<typeof EMPTY_ITEM[]>([]);
  const [newItem, setNewItem] = useState(EMPTY_ITEM);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

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
    fetch(`/api/temples/${tid}/chadawa`).then((r) => r.json()).then((d) => {
      if (d.success) setRows(d.data);
    });
  }

  const set = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const setItem = (k: keyof typeof EMPTY_ITEM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setNewItem((p) => ({ ...p, [k]: e.target.value }));

  function addOfferingItem() {
    if (!newItem.name || !newItem.nameHi || !newItem.price || !newItem.image) {
      devToast.error("Fill name (EN + HI), price, and image URL");
      return;
    }
    setOfferingItems((p) => [...p, { ...newItem }]);
    setNewItem(EMPTY_ITEM);
    setShowItemForm(false);
  }

  function removeOfferingItem(idx: number) {
    setOfferingItems((p) => p.filter((_, i) => i !== idx));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        temple: form.templeId,
        items: form.items.split(",").map((s) => s.trim()).filter(Boolean),
        offeringItems: offeringItems.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      };
      const res = await fetch(`/api/temples/${form.templeId}/chadawa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        devToast.success("Chadawa offering added 🌸");
        setRows((p) => [...p, data.data]);
        setShowForm(false);
        setForm({ ...EMPTY_FORM, templeId: form.templeId });
        setOfferingItems([]);
      } else devToast.error(data.error);
    } finally { setAdding(false); }
  }

  const columns: any[] = [
    {
      key: "name",
      header: "Name",
      render: (r: Row) => (
        <span>
          {r.name}
          <span className="font-sanskrit text-saffron text-xs ml-1">{r.nameHi}</span>
        </span>
      ),
    },
    { key: "deity", header: "Deity" },
    { key: "price", header: "Price", render: (r: Row) => formatCurrency(r.price) },
    { key: "items", header: "Items", render: (r: Row) => `${r.items.length} items` },
    {
      key: "offeringItems",
      header: "Offering Items",
      render: (r: Row) => (
        <span className={r.offeringItems?.length ? "text-saffron font-medium" : "text-muted-foreground"}>
          {r.offeringItems?.length ?? 0} products
        </span>
      ),
    },
  ];

  return (
    <DashboardShell
      title="Chadawa Offerings"
      subtitle="Manage divine offerings available at your temples."
      action={
        <Button onClick={() => { setShowForm(!showForm); setOfferingItems([]); }} size="sm">
          {showForm ? "Cancel" : "+ Add Offering"}
        </Button>
      }
    >
      {temples.length > 1 && (
        <Select
          className="mb-6 max-w-xs"
          options={temples}
          value={form.templeId}
          onChange={(e) => { setForm((p) => ({ ...p, templeId: e.target.value })); fetchRows(e.target.value); }}
        />
      )}

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-heading text-lg text-foreground mb-4">Add Chadawa Offering</h3>
          <form onSubmit={handleAdd} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Name (English)" required value={form.name} onChange={set("name")} placeholder="Bilva Patra Offering" />
              <Input label="Name (Hindi)" required value={form.nameHi} onChange={set("nameHi")} placeholder="बेलपत्र अर्पण" />
              <Input label="Deity" required value={form.deity} onChange={set("deity")} placeholder="Lord Shiva" />
              <Input label="Base Price (₹)" required value={form.price} onChange={set("price")} type="number" placeholder="151" />
              <Input label="Cover Image URL" required value={form.image} onChange={set("image")} placeholder="https://..." />
              <Input label="Includes (comma separated)" value={form.items} onChange={set("items")} placeholder="Bilva leaves, Gangajal" />
              <Textarea label="Description (English)" required value={form.description} onChange={set("description")} rows={2} className="md:col-span-2" />
              <Textarea label="Description (Hindi)" required value={form.descriptionHi} onChange={set("descriptionHi")} rows={2} className="md:col-span-2" />
            </div>

            {/* Offering Items Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-heading text-base text-foreground">Individual Offering Items</h4>
                  <p className="text-xs text-muted-foreground">Devotees can select and add these individually to their offering.</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowItemForm(!showItemForm)}>
                  {showItemForm ? "Cancel" : "+ Add Item"}
                </Button>
              </div>

              {/* Added items list */}
              {offeringItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {offeringItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border border-deep-gold/20 rounded-xl p-3 bg-background"
                    >
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-saffron">{item.nameHi}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">₹{item.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOfferingItem(idx)}
                        className="text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0"
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {offeringItems.length === 0 && !showItemForm && (
                <div className="border-2 border-dashed border-deep-gold/20 rounded-xl p-4 text-center text-muted-foreground text-sm">
                  No offering items added yet. Add individual items devotees can choose from.
                </div>
              )}

              {/* New item form */}
              {showItemForm && (
                <div className="border border-deep-gold/30 rounded-xl p-4 bg-saffron/5 space-y-3">
                  <p className="text-sm font-medium text-foreground">New Offering Item</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Item Name (English)" required value={newItem.name} onChange={setItem("name")} placeholder="Bilva Patra" />
                    <Input label="Item Name (Hindi)" required value={newItem.nameHi} onChange={setItem("nameHi")} placeholder="बेलपत्र" />
                    <Input label="Price (₹)" required value={newItem.price} onChange={setItem("price")} type="number" placeholder="21" />
                    <Input label="Image URL" required value={newItem.image} onChange={setItem("image")} placeholder="https://..." />
                    <Textarea label="Description (optional)" value={newItem.description} onChange={setItem("description")} rows={2} className="sm:col-span-2" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setShowItemForm(false); setNewItem(EMPTY_ITEM); }}>
                      Cancel
                    </Button>
                    <Button type="button" size="sm" onClick={addOfferingItem}>
                      Add Item
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" loading={adding} fullWidth>
              Add Chadawa Offering{offeringItems.length > 0 ? ` with ${offeringItems.length} item${offeringItems.length > 1 ? "s" : ""}` : ""}
            </Button>
          </form>
        </Card>
      )}

      <DataTable columns={columns} data={rows as any} emptyMessage="No chadawa offerings yet." />
    </DashboardShell>
  );
}
