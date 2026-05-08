"use client";

import { useState } from "react";
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

  if (status === "approved")  return <Button size="sm" variant="danger"  onClick={() => updateStatus("rejected")} loading={loading}>Reject</Button>;
  if (status === "rejected")  return <Button size="sm" variant="saffron" onClick={() => updateStatus("approved")} loading={loading}>Approve</Button>;
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="saffron" onClick={() => updateStatus("approved")} loading={loading}>Approve</Button>
      <Button size="sm" variant="danger"  onClick={() => updateStatus("rejected")} loading={loading}>Reject</Button>
    </div>
  );
}
