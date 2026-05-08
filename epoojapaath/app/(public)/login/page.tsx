"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
            <h1 className="font-heading text-3xl text-foreground">Welcome Back</h1>
            <p className="font-sanskrit text-saffron text-sm mt-1">ॐ नमः शिवाय</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email Address" type="email" required placeholder="your@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" required placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? "Signing in... 🪔" : "Sign In 🛕"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-saffron font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
