"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { devToast } from "@/lib/toast";
import { formatDateShort } from "@/lib/utils";
import { UserPlus, Trash2 } from "lucide-react";

type Member = { _id: string; name: string; email: string; role: string; createdAt: string; isBlocked: boolean };

const ROLE_OPTIONS = [
  { value: "admin",        label: "Admin — full control" },
];

export default function AdminSettingsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [email,   setEmail]   = useState("");
  const [role,    setRole]    = useState("admin");
  const [adding,  setAdding]  = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => { fetchMembers(); }, []);

  function fetchMembers() {
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((d) => { if (d.success) setMembers(d.data); });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    try {
      const res  = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();
      if (data.success) {
        devToast.success(`${data.data.name} promoted to ${role.replace("_", " ")} 🙏`);
        setEmail("");
        fetchMembers();
      } else devToast.error(data.error);
    } finally { setAdding(false); }
  }

  async function handleRemove(memberEmail: string) {
    setRemoving(memberEmail);
    try {
      const res  = await fetch("/api/admin/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: memberEmail }),
      });
      const data = await res.json();
      if (data.success) {
        devToast.success("Member role revoked");
        fetchMembers();
      } else devToast.error(data.error);
    } finally { setRemoving(null); }
  }

  const admins  = members.filter((m) => m.role === "admin");

  return (
    <DashboardShell title="Settings" subtitle="Control platform access and member roles.">
      <div className="max-w-2xl space-y-8">

        {/* Add member */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={18} className="text-saffron" />
            <h2 className="font-heading text-lg text-foreground">Add Member</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Enter the email of a registered user to grant them a role. They must have signed up first.
          </p>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input
              label="User Email"
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select
              label="Role"
              options={ROLE_OPTIONS}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Button type="submit" loading={adding} fullWidth>
              Grant Access
            </Button>
          </form>
        </div>

        {/* Admins */}
        <MemberSection
          title="Admins"
          subtitle="Full platform control — can manage all temples, users, content."
          members={admins}
          roleBadge="saffron"
          removing={removing}
          onRemove={handleRemove}
        />


      </div>
    </DashboardShell>
  );
}

function MemberSection({
  title, subtitle, members, roleBadge, removing, onRemove,
}: {
  title: string;
  subtitle: string;
  members: Member[];
  roleBadge: "saffron" | "purple";
  removing: string | null;
  onRemove: (email: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-heading text-lg text-foreground mb-0.5">{title}</h2>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No {title.toLowerCase()} yet.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m._id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 bg-background">
              <div className="w-9 h-9 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                <span className="text-saffron font-bold text-sm">{m.name?.[0]?.toUpperCase() || "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{m.name || "—"}</p>
                  <Badge variant={roleBadge}>{m.role.replace("_", " ")}</Badge>
                  {m.isBlocked && <Badge variant="rejected">Blocked</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                <p className="text-xs text-muted-foreground/60">Since {formatDateShort(m.createdAt)}</p>
              </div>
              <button
                onClick={() => onRemove(m.email)}
                disabled={removing === m.email}
                className="text-muted-foreground hover:text-red-500 transition disabled:opacity-50 p-1.5 rounded-lg hover:bg-red-50"
                title="Revoke role"
              >
                {removing === m.email
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                  : <Trash2 size={15} />
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
