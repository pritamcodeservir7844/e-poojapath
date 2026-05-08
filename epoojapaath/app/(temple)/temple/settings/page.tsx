"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { devToast } from "@/lib/toast";

export default function TempleSettingsPage() {
  const [temples,  setTemples]  = useState<{ value: string; label: string }[]>([]);
  const [templeId, setTempleId] = useState("");
  const [form,     setForm]     = useState({ contactPhone: "", contactEmail: "", website: "", timings: "", description: "" });
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    fetch("/api/temples?owner=me").then((r) => r.json()).then((d) => {
      if (d.success) setTemples(d.data.map((t: { _id: string; name: string }) => ({ value: t._id, label: t.name })));
    });
  }, []);

  useEffect(() => {
    if (!templeId) return;
    fetch(`/api/temples/${templeId}`).then((r) => r.json()).then((d) => {
      if (d.success) {
        const { contactPhone, contactEmail, website, timings, description } = d.data;
        setForm({ contactPhone: contactPhone || "", contactEmail: contactEmail || "", website: website || "", timings: timings || "", description: description || "" });
      }
    });
  }, [templeId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!templeId) { devToast.error("Select a temple first"); return; }
    setLoading(true);
    try {
      const res  = await fetch(`/api/temples/${templeId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) devToast.success("Settings saved 🙏");
      else devToast.error(data.error);
    } finally { setLoading(false); }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <DashboardShell title="Temple Settings" subtitle="Update contact details, timings, and description.">
      <div className="max-w-xl space-y-6">
        <Select label="Select Temple" options={temples} placeholder="Choose a temple" value={templeId} onChange={(e) => setTempleId(e.target.value)} />
        {templeId && (
          <Card>
            <form onSubmit={handleSave} className="space-y-5">
              <Input label="Contact Phone" required value={form.contactPhone} onChange={set("contactPhone")} placeholder="+91 XXXXX XXXXX" />
              <Input label="Contact Email" required value={form.contactEmail} onChange={set("contactEmail")} type="email" />
              <Input label="Website (optional)"   value={form.website}       onChange={set("website")}       placeholder="https://..." />
              <Input label="Timings"       required value={form.timings}      onChange={set("timings")}       placeholder="e.g. 6 AM – 9 PM" />
              <Textarea label="Description" required value={form.description} onChange={set("description")} rows={4} />
              <Button type="submit" loading={loading} fullWidth>Save Settings</Button>
            </form>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
