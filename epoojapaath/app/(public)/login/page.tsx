"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { devToast } from "@/lib/toast";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error === "BLOCKED") {
        devToast.error("Your account has been blocked. Contact support@epoojapaath.com");
      } else if (result?.error) {
        devToast.error("Invalid email or password");
      } else {
        devToast.blessing("Welcome back! Jai Shri Ram 🙏");
        router.push("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-devotional">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="ePoojapaath" width={64} height={64} className="mx-auto rounded-full mb-4 ring-2 ring-saffron" />
            <h1 className="font-heading text-3xl text-dark">Welcome Back</h1>
            <p className="font-sanskrit text-saffron text-sm mt-1">ॐ नमः शिवाय</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email Address</label>
              <input type="email" required className="input-devotional w-full" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Password</label>
              <input type="password" required className="input-devotional w-full" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-saffron w-full py-3 text-base disabled:opacity-60">
              {loading ? "Signing in... 🪔" : "Sign In 🛕"}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-saffron font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
