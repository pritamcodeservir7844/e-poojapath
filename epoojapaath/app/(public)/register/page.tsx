"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        devToast.blessing("Account created! 🙏 Jai Shri Ram");
        router.push("/login");
      } else devToast.error(data.error);
    } catch {
      devToast.error("Registration failed. Please try again.");
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
            <h1 className="font-heading text-3xl text-foreground">Create Account</h1>
            <p className="font-sanskrit text-saffron text-sm mt-1">🌸 Begin your devotional journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" required placeholder="Ramesh Kumar"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email Address" type="email" required placeholder="your@email.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone (Optional)" type="tel" placeholder="+91 98765 43210"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Password" type="password" required placeholder="Min 8 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? "Creating Account... 🪔" : "Create Account 🛕"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-saffron font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
