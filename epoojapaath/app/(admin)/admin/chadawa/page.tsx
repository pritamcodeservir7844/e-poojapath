"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Pencil, Trash2, Plus, X, AlertTriangle, Search,
  Flower2, IndianRupee, Filter, ExternalLink, Sparkles,
} from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { formatCurrency } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type Temple = { _id: string; name: string; slug: string; coverImage: string; location: { city: string; state: string } };
type Chadawa = {
  _id: string; name: string; nameHi: string; description: string; descriptionHi: string;
  price: number; image: string; isActive: boolean; isSpecial: boolean;
  deity: string; items: string[]; temple: Temple;
};

// ── Empty form ─────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", nameHi: "", description: "", descriptionHi: "",
  price: "", deity: "", image: "", items: "", isSpecial: false, templeId: "",
};

// ── Sub-components ──────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? "✅" : "❌"} {msg}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-heading text-lg text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ msg, onConfirm, onCancel, loading }: { msg: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4"><AlertTriangle className="text-red-500" size={22} /><h3 className="font-heading text-foreground">Confirm Delete?</h3></div>
        <p className="text-sm text-muted-foreground mb-6">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium disabled:opacity-50 transition">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminChadawaPage() {
  const [items, setItems] = useState<Chadawa[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTemple, setFilterTemple] = useState("");
  const [filterType, setFilterType] = useState<"" | "special" | "regular">("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Chadawa | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Chadawa | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  async function load() {
    setLoading(true);
    try {
      const [cRes, tRes] = await Promise.all([
        fetch("/api/admin/chadawa"),
        fetch("/api/admin/temples"),
      ]);
      const cData = await cRes.json();
      const tData = await tRes.json();
      if (cData.success) setItems(cData.data);
      if (tData.success) setTemples(tData.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  // Filter
  const filtered = items.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.nameHi?.includes(q) || c.temple?.name?.toLowerCase().includes(q) || c.deity?.toLowerCase().includes(q);
    const matchT = !filterTemple || c.temple?._id === filterTemple;
    const matchType = !filterType || (filterType === "special" ? c.isSpecial : !c.isSpecial);
    return matchQ && matchT && matchType;
  });

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditData(null);
    setShowForm(true);
  }

  function openEdit(c: Chadawa) {
    setForm({
      name: c.name, nameHi: c.nameHi, description: c.description, descriptionHi: c.descriptionHi,
      price: String(c.price), deity: c.deity, image: c.image,
      items: c.items?.join(", ") || "",
      isSpecial: c.isSpecial,
      templeId: c.temple?._id || "",
    });
    setEditData(c);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        items: form.items.split(",").map(s => s.trim()).filter(Boolean),
        isSpecial: form.isSpecial,
        temple: form.templeId || undefined,
      };
      const url = editData ? `/api/admin/chadawa/${editData._id}` : `/api/admin/temples/${form.templeId}/chadawa`;
      const method = editData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (d.success) { showToast(editData ? "Chadawa updated! 🌸" : "Chadawa add ho gayi! 🌸"); setShowForm(false); load(); }
      else showToast(d.error || "Failed", "error");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/chadawa/${confirmDelete._id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) { showToast("Chadawa deleted ✓"); setConfirmDelete(null); load(); }
      else showToast(d.error || "Failed", "error");
    } finally { setDeleting(false); }
  }

  async function toggleSpecial(c: Chadawa) {
    const res = await fetch(`/api/admin/chadawa/${c._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSpecial: !c.isSpecial }),
    });
    const d = await res.json();
    if (d.success) { showToast(`${!c.isSpecial ? "Special" : "Regular"} chadawa set kar diya`); load(); }
  }

  async function toggleActive(c: Chadawa) {
    const res = await fetch(`/api/admin/chadawa/${c._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    const d = await res.json();
    if (d.success) { showToast(`Chadawa ${!c.isActive ? "activated" : "deactivated"}`); load(); }
  }

  const specialCount = items.filter(c => c.isSpecial).length;
  const regularCount = items.filter(c => !c.isSpecial).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmDialog
          msg={`"${confirmDelete.name}" permanently delete karna chahte hain?`}
          onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} loading={deleting}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal title={editData ? `Edit: ${editData.name}` : "Naya Chadawa Add Karo 🌸"} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-5">
            {/* Temple + Type select */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editData && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Temple Select Karo <span className="text-red-400">*</span></label>
                  <select value={form.templeId} onChange={e => setForm(f => ({ ...f, templeId: e.target.value }))} required
                    className="w-full border border-border bg-card rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition">
                    <option value="">-- Temple select karo --</option>
                    {temples.map(t => <option key={t._id} value={t._id}>{t.name} ({t.location.city})</option>)}
                  </select>
                </div>
              )}

              {/* isSpecial toggle */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Chadawa Type</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setForm(f => ({ ...f, isSpecial: false }))}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${!form.isSpecial ? "border-saffron bg-saffron/10 text-saffron" : "border-border text-muted-foreground hover:border-saffron/50"}`}>
                    🌸 Regular Add-on
                  </button>
                  <button type="button" onClick={() => setForm(f => ({ ...f, isSpecial: true }))}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${form.isSpecial ? "border-purple-500 bg-purple-500/10 text-purple-400" : "border-border text-muted-foreground hover:border-purple-500/50"}`}>
                    ✨ Special Chadawa
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {form.isSpecial ? "Special chadawa standalone book ho sakti hai (Chadawa page par show hogi)" : "Regular add-on puja booking ke time select hoti hai"}
                </p>
              </div>

              <Input label="Name (English)" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Flower Basket" />
              <Input label="Name (Hindi)" required value={form.nameHi} onChange={e => setForm(f => ({ ...f, nameHi: e.target.value }))} placeholder="फूल टोकरी" />
              <Input label="Deity" required value={form.deity} onChange={e => setForm(f => ({ ...f, deity: e.target.value }))} placeholder="Maa Tripura Sundari" />
              <Input label="Price (₹)" required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="51" />
              <div className="md:col-span-2">
                <ImageUpload label="Cover Image" required value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} folder="chadawa" previewHeight="h-36" />
              </div>
              <Input label="Includes / Items (comma separated)" value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} placeholder="Red Flowers, Lotus" className="md:col-span-2" />
              <Textarea label="Description (English)" required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="md:col-span-2" />
              <Textarea label="Description (Hindi)" required rows={2} value={form.descriptionHi} onChange={e => setForm(f => ({ ...f, descriptionHi: e.target.value }))} className="md:col-span-2" />
            </div>

            <Button type="submit" loading={saving} fullWidth>
              {editData ? "Chadawa Update Karo 🌸" : "Chadawa Add Karo 🌸"}
            </Button>
          </form>
        </Modal>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Chadawa Manager 🌸</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {items.length} total · <span className="text-purple-400">{specialCount} Special</span> · <span className="text-saffron">{regularCount} Regular</span>
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-medium hover:bg-saffron/90 transition">
          <Plus size={15} /> Naya Chadawa Add Karo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Chadawa", value: items.length, icon: "🌸", color: "text-saffron" },
          { label: "Special Chadawa", value: specialCount, icon: "✨", color: "text-purple-400" },
          { label: "Regular Add-ons", value: regularCount, icon: "🪷", color: "text-green-500" },
          { label: "Temples Covered", value: new Set(items.map(i => i.temple?._id)).size, icon: "🛕", color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`font-heading text-xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chadawa, deity..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-saffron transition" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <select value={filterTemple} onChange={e => setFilterTemple(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition">
            <option value="">All Temples</option>
            {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value as typeof filterType)}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition">
            <option value="">All Types</option>
            <option value="special">✨ Special</option>
            <option value="regular">🌸 Regular</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="text-4xl animate-bounce">🌸</div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Flower2 size={40} className="mx-auto mb-3 opacity-30" />
          <p>Koi chadawa nahi mila.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c._id} className={`bg-card border rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md ${c.isSpecial ? "border-purple-500/30 hover:border-purple-500/50" : "border-border hover:border-saffron/30"}`}>
              {/* Image */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={c.image || c.temple?.coverImage || "/placeholder.jpg"} alt={c.name} fill className="object-cover" />
                {c.isSpecial && (
                  <div className="absolute top-1 left-1 bg-purple-600 text-white text-[9px] px-1 py-0.5 rounded font-bold flex items-center gap-0.5">
                    <Sparkles size={8} /> Special
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-foreground text-sm">{c.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.isActive !== false ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400"}`}>
                    {c.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-saffron/80 font-sanskrit mt-0.5">{c.nameHi}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {c.temple && (
                    <span className="text-xs text-muted-foreground">🛕 {c.temple.name}</span>
                  )}
                  <span className="text-xs text-muted-foreground">🙏 {c.deity}</span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-saffron">
                    <IndianRupee size={10} />{formatCurrency(c.price)}
                  </span>
                </div>
                {c.items?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {c.items.slice(0, 4).map((item, i) => (
                      <span key={i} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{item}</span>
                    ))}
                    {c.items.length > 4 && <span className="text-[10px] text-muted-foreground">+{c.items.length - 4} more</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {c.temple?._id && (
                  <Link href={`/admin/temples/${c.temple._id}?tab=Chadawa`} title="View in Temple"
                    className="p-2 rounded-xl text-muted-foreground hover:text-saffron hover:bg-saffron/10 transition">
                    <ExternalLink size={15} />
                  </Link>
                )}
                <button onClick={() => toggleSpecial(c)} title={c.isSpecial ? "Set as Regular" : "Set as Special"}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${c.isSpecial ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {c.isSpecial ? "✨ Special" : "🌸 Regular"}
                </button>
                <button onClick={() => toggleActive(c)} title={c.isActive !== false ? "Deactivate" : "Activate"}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${c.isActive !== false ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"}`}>
                  {c.isActive !== false ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => openEdit(c)} title="Edit"
                  className="p-2 rounded-xl text-muted-foreground hover:text-saffron hover:bg-saffron/10 transition">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setConfirmDelete(c)} title="Delete"
                  className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
