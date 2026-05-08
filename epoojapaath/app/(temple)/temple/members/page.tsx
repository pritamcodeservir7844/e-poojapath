"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { devToast } from "@/lib/toast";

const PERMISSIONS = [
  { id: "manage_pujas",     label: "Manage Pujas"         },
  { id: "manage_chadawa",   label: "Manage Chadawa"       },
  { id: "view_bookings",    label: "View Bookings"        },
  { id: "update_bookings",  label: "Update Booking Status"},
  { id: "manage_blog",      label: "Manage Blog"          },
];

const ROLES = [
  { value: "manager", label: "Manager" },
  { value: "pandit",  label: "Pandit"  },
  { value: "staff",   label: "Staff"   },
];

export default function TempleMembersPage() {
  const [members, setMembers] = useState<Record<string, unknown>[]>([]);
  const [temples, setTemples] = useState<{ value: string; label: string }[]>([]);
  const [templeId, setTempleId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/temples?owner=me").then((r) => r.json()).then((d) => {
      if (d.success) setTemples(d.data.map((t: { _id: string; name: string }) => ({ value: t._id, label: t.name })));
    });
  }, []);

  useEffect(() => {
    if (!templeId) return;
    fetch(`/api/temples/${templeId}/members`).then((r) => r.json()).then((d) => {
      if (d.success) setMembers(d.data);
    });
  }, [templeId]);

  const togglePermission = (id: string) =>
    setPermissions((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!templeId) { devToast.error("Select a temple first"); return; }
    setAdding(true);
    try {
      const res = await fetch(`/api/temples/${templeId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, permissions }),
      });
      const data = await res.json();
      if (data.success) {
        devToast.success("Member invited 🙏");
        setEmail(""); setRole("staff"); setPermissions([]);
        setMembers((prev) => [...prev, data.data]);
      } else devToast.error(data.error);
    } finally { setAdding(false); }
  }

  const columns = [
    { key: "user",        header: "Member",      render: (m: Record<string, unknown>) => (m.user as { name?: string })?.name || "—" },
    { key: "role",        header: "Role",         render: (m: Record<string, unknown>) => <Badge variant="saffron">{String(m.role)}</Badge> },
    { key: "permissions", header: "Permissions",  render: (m: Record<string, unknown>) => <span className="text-xs text-muted">{(m.permissions as string[])?.length || 0} permissions</span> },
    { key: "status",      header: "Status",       render: (m: Record<string, unknown>) => <Badge variant={m.status as "pending" | "approved"}>{String(m.status)}</Badge> },
  ];

  return (
    <DashboardShell title="Team Members" subtitle="Invite and manage temple staff, pandits, and managers.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Select label="Select Temple" options={temples} placeholder="Choose a temple" value={templeId} onChange={(e) => setTempleId(e.target.value)} />
          <DataTable columns={columns} data={members} emptyMessage="No members yet. Invite someone below." />
        </div>

        <Card>
          <h3 className="font-heading text-lg text-dark mb-4">Invite Member</h3>
          <form onSubmit={addMember} className="space-y-4">
            <Input label="Email Address" required type="email" placeholder="member@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Select label="Role" options={ROLES} value={role} onChange={(e) => setRole(e.target.value)} />
            <div>
              <p className="text-sm font-medium text-dark mb-2">Permissions</p>
              <div className="space-y-2">
                {PERMISSIONS.map(({ id, label }) => (
                  <label key={id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={permissions.includes(id)} onChange={() => togglePermission(id)} className="w-4 h-4 accent-saffron" />
                    <span className="text-sm text-dark">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit" loading={adding} fullWidth>Send Invitation</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
