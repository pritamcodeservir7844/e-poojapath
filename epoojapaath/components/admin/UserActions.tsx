"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface UserActionsProps {
  id: string;
  isBlocked: boolean;
  role: string;
}

export function UserActions({ id, isBlocked, role }: UserActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleBlock() {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/users/${id}/block`, { method: "PUT" });
      const data = await res.json();
      if (data.success) { devToast.success(isBlocked ? "User unblocked" : "User blocked"); router.refresh(); }
      else devToast.error(data.error);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      <Button size="sm" variant={isBlocked ? "saffron" : "danger"} onClick={toggleBlock} loading={loading}>
        {isBlocked ? "Unblock" : "Block"}
      </Button>
    </div>
  );
}
