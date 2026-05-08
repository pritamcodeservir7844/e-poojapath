import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getOwnerTemples } from "@/services/temple.service";
import { getTempleBookings } from "@/services/booking.service";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { IBooking, ITemple, IUser } from "@/types";

type BookingRow = IBooking & { _id: string; user: Partial<IUser> };

export default async function TempleBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const temples  = await getOwnerTemples(session.user.id!).catch(() => []) as (ITemple & { _id: string })[];
  const approved = temples.filter((t) => t.status === "approved");

  const allBookings = (await Promise.all(
    approved.map((t) => getTempleBookings(t._id.toString()).catch(() => []))
  )).flat() as BookingRow[];

  const columns = [
    { key: "devoteeName", header: "Devotee" },
    { key: "serviceName", header: "Service"  },
    { key: "date",        header: "Date",    render: (b: BookingRow) => formatDateShort(b.date) },
    { key: "amount",      header: "Amount",  render: (b: BookingRow) => formatCurrency(b.amount) },
    { key: "status",      header: "Status",  render: (b: BookingRow) => <Badge variant={b.status as "pending" | "confirmed" | "completed" | "cancelled"}>{b.status}</Badge> },
    { key: "paymentStatus", header: "Payment", render: (b: BookingRow) => <Badge variant={b.paymentStatus as "pending" | "paid" | "failed"}>{b.paymentStatus}</Badge> },
  ];

  return (
    <DashboardShell title="Temple Bookings" subtitle="All bookings across your approved temples.">
      <DataTable columns={columns} data={allBookings as unknown as Record<string, unknown>[]} emptyMessage="No bookings yet." />
    </DashboardShell>
  );
}
