"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function TempleLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
    >
      <LogOut size={17} strokeWidth={1.75} />
      Logout
    </button>
  );
}
