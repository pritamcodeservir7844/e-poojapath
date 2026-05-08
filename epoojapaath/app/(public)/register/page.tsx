"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
            <h1 className="font-heading text-3xl text-dark">Create Account</h1>
            <p className="font-sanskrit text-saffron text-sm mt-1">🌸 Begin your devotional journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { key: "name",     label: "Full Name",     type: "text",     placeholder: "Ramesh Kumar" },
              { key: "email",    label: "Email Address", type: "email",    placeholder: "your@email.com" },
              { key: "phone",    label: "Phone (Optional)", type: "tel",   placeholder: "+91 98765 43210" },
              { key: "password", label: "Password",       type: "password", placeholder: "Min 8 characters" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-dark mb-1">{label}</label>
                <input type={type} placeholder={placeholder}
                  className="input-devotional w-full"
                  required={key !== "phone"}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-saffron w-full py-3 text-base disabled:opacity-60">
              {loading ? "Creating Account... 🪔" : "Create Account 🛕"}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-saffron font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
