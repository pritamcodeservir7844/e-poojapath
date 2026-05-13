"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { Home } from "lucide-react";

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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #FFF0F8 50%, #EEF2FF 100%)" }}
    >
      {/* Lotus glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #EC9DD4, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #94AAEE, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-start mb-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-saffron transition-colors">
            <Home size={15} />
            Back to Home
          </Link>
        </div>
        <div className="card-devotional shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-2xl px-3 py-2 shadow-sm mb-4">
              <Image src="/epoojalogo.png" alt="ePoojapaath" width={80} height={80} className="object-contain h-16 w-auto" />
            </div>
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
