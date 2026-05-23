"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X, BookOpen, Flower2, Pencil } from "lucide-react";

interface TempleActionsProps {
  id: string;
  status: string;
  name?: string;
}

function ConfirmDialog({ name, onConfirm, onCancel, loading }: {
  name: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={22} />
          <h3 className="font-heading text-foreground">Temple Delete Karo?</h3>
          <button onClick={onCancel} className="ml-auto text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          <strong className="text-foreground">&ldquo;{name}&rdquo;</strong> ko permanently delete karna chahte hain?
        </p>
        <p className="text-xs text-red-500 mb-6">⚠️ Iske sare Puja aur Chadawa bhi delete ho jayenge!</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition">
            {loading ? "Deleting..." : "Delete Karo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TempleActions({ id, status, name = "Temple" }: TempleActionsProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  async function updateStatus(newStatus: "approved" | "rejected") {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/temples/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) { devToast.success(`Temple ${newStatus} 🙏`); router.refresh(); }
      else devToast.error(data.error);
    } finally { setLoading(false); }
  }

  async function deleteTemple() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/temples/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        devToast.success("Temple delete ho gaya ✓");
        setShowConfirm(false);
        router.refresh();
      } else {
        devToast.error(data.error || "Delete failed");
      }
    } finally { setDeleting(false); }
  }

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          name={name}
          onConfirm={deleteTemple}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}
      <div className="flex flex-col gap-2">
        {/* Row 1: Details + Edit + Approve/Reject */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/admin/temples/${id}`} className="text-xs text-saffron hover:underline font-medium">
            Details →
          </Link>
          <Link
            href={`/admin/temples/${id}?edit=1`}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-saffron/10 text-saffron hover:bg-saffron/20 transition font-medium"
            title="Temple edit karo"
          >
            <Pencil size={11} /> Edit
          </Link>
          {status === "approved"
            ? <Button size="sm" variant="danger" onClick={() => updateStatus("rejected")} loading={loading}>Reject</Button>
            : status === "rejected"
              ? <Button size="sm" variant="saffron" onClick={() => updateStatus("approved")} loading={loading}>Approve</Button>
              : <>
                <Button size="sm" variant="saffron" onClick={() => updateStatus("approved")} loading={loading}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => updateStatus("rejected")} loading={loading}>Reject</Button>
              </>
          }
          <button onClick={() => setShowConfirm(true)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
            title="Temple Delete Karo">
            <Trash2 size={13} />
          </button>
        </div>

        {/* Row 2: Quick links to Puja & Chadawa tabs */}
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/temples/${id}?tab=Pujas`}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition font-medium"
            title="Pujas manage karo"
          >
            <BookOpen size={11} /> Pujas
          </Link>
          <Link
            href={`/admin/temples/${id}?tab=Chadawa`}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition font-medium"
            title="Chadawa manage karo"
          >
            <Flower2 size={11} /> Chadawa
          </Link>
        </div>
      </div>
    </>
  );
}
