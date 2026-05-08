import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { getUserBookings } from "@/services/booking.service";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import Link from "next/link";
import type { IBooking } from "@/types";

export default async function UserDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await getUserBookings(session.user.id!).catch(() => []) as (IBooking & { _id: string })[];
  const paid      = bookings.filter((b) => b.paymentStatus === "paid").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const pending   = bookings.filter((b) => b.status === "pending").length;

  return (
    <DashboardShell
      title={`Welcome, ${session.user.name} 🙏`}
      subtitle="Your devotional dashboard — track bookings and divine connections."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📿" label="Total Bookings"    value={bookings.length} />
        <StatCard icon="✅" label="Completed"          value={completed}       accent="border-l-green-500" />
        <StatCard icon="⏳" label="Pending"            value={pending}         accent="border-l-yellow-500" />
        <StatCard icon="💳" label="Paid Bookings"      value={paid}            accent="border-l-lotus-blue" />
      </div>

      <div className="card-devotional">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl text-dark">Recent Bookings</h2>
          <Link href="/user/bookings" className="text-saffron text-sm hover:underline">View all →</Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🛕</p>
            <p className="text-muted">No bookings yet.</p>
            <Link href="/puja" className="btn-saffron mt-4 inline-block text-sm py-2 px-5">Book a Puja</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <Link key={b._id.toString()} href={`/user/bookings/${b._id}`}
                className="flex items-center justify-between p-3 bg-cream hover:bg-saffron/5 rounded-xl border border-deep-gold/10 hover:border-saffron/20 transition-all">
                <div>
                  <p className="font-medium text-dark text-sm">{b.serviceName}</p>
                  <p className="text-xs text-muted">{formatDateShort(b.date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-saffron font-medium text-sm">{formatCurrency(b.amount)}</span>
                  <Badge variant={({ pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" } as any)[b.status] || "pending"}>{b.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
