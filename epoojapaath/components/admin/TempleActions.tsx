"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface TempleActionsProps {
  id: string;
  status: string;
}

export function TempleActions({ id, status }: TempleActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateStatus(newStatus: "approved" | "rejected") {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/temples/${id}/status`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      const data = await res.json();
      if (data.success) { devToast.success(`Temple ${newStatus} 🙏`); router.refresh(); }
      else devToast.error(data.error);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/temples/${id}`} className="text-xs text-saffron hover:underline font-medium">
        Details →
      </Link>
      {status === "approved"
        ? <Button size="sm" variant="danger"  onClick={() => updateStatus("rejected")} loading={loading}>Reject</Button>
        : status === "rejected"
        ? <Button size="sm" variant="saffron" onClick={() => updateStatus("approved")} loading={loading}>Approve</Button>
        : <>
            <Button size="sm" variant="saffron" onClick={() => updateStatus("approved")} loading={loading}>Approve</Button>
            <Button size="sm" variant="danger"  onClick={() => updateStatus("rejected")} loading={loading}>Reject</Button>
          </>
      }
    </div>
  );
}
