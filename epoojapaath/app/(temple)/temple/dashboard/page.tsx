import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getOwnerTemples } from "@/services/temple.service";
import Link from "next/link";
import { Landmark, CheckCircle, Clock, BookOpen, MapPin, CalendarDays } from "lucide-react";
import type { ITemple } from "@/types";

export default async function TempleDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const temples = await getOwnerTemples(session.user.id!).catch(() => []) as (ITemple & { _id: string })[];
  const approved = temples.filter((t) => t.status === "approved").length;
  const pending  = temples.filter((t) => t.status === "pending").length;
  const total    = temples.reduce((s, t) => s + (t.totalBookings || 0), 0);

  return (
    <DashboardShell
      title="Temple Dashboard"
      subtitle={`Managing ${temples.length} temple${temples.length !== 1 ? "s" : ""}`}
      action={<Link href="/temple/register" className="btn-saffron text-sm py-2 px-5">+ Add Temple</Link>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Landmark />}     label="Total Temples"  value={temples.length} />
        <StatCard icon={<CheckCircle />}  label="Approved"        value={approved} accent="border-l-green-500" />
        <StatCard icon={<Clock />}        label="Pending Review"  value={pending}  accent="border-l-yellow-500" />
        <StatCard icon={<BookOpen />}     label="Total Bookings"  value={total}    accent="border-l-lotus-blue" />
      </div>

      <div className="card-devotional">
        <h2 className="font-heading text-xl text-foreground mb-5">Your Temples</h2>
        {temples.length === 0 ? (
          <div className="text-center py-10">
            <Landmark size={40} className="mx-auto text-saffron/40 mb-3" />
            <p className="text-muted-foreground mb-4">No temples registered yet.</p>
            <Link href="/temple/register" className="btn-saffron text-sm py-2 px-5">Register Your Temple</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {temples.map((t) => (
              <div key={t._id.toString()} className="flex items-start gap-4 p-4 bg-background rounded-xl border border-deep-gold/10 hover:border-saffron/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center shrink-0">
                  <Landmark size={18} className="text-saffron" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-foreground text-base truncate">{t.name}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {t.location?.city}, {t.location?.state}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <CalendarDays size={11} /> {t.totalBookings} bookings
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={t.status as any}>{t.status}</Badge>
                  {t.status === "approved" && (
                    <Link href={`/temple/pujas?temple=${t._id}`} className="text-saffron text-xs hover:underline">Manage →</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
