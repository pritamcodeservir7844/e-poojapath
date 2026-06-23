import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getOwnerTemples } from "@/services/temple.service";
import { getTempleBookings } from "@/services/booking.service";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { IBooking, ITemple, IUser } from "@/types";
import Link from "next/link";

type BookingRow = IBooking & { _id: string; user: Partial<IUser> };

export default async function TempleBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const temples  = await getOwnerTemples(session.user.id!).catch(() => []) as (ITemple & { _id: string })[];
  const approved = temples.filter((t) => t.status === "approved");

  const allBookings = (await Promise.all(
    approved.map((t) => getTempleBookings(t._id.toString()).catch(() => []))
  )).flat() as any[];

  const columns: any[] = [
    { key: "devoteeName", header: "Devotee" },
    { 
      key: "serviceName", 
      header: "Service",
      render: (b: BookingRow) => (
        <div>
          <div className="font-medium text-foreground">{b.serviceName}</div>
          {b.selectedPackage && (
            <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
              📦 Pack: {b.selectedPackage}
            </div>
          )}
          {b.selectedChadawa && b.selectedChadawa.length > 0 && (
            <div className="text-[11px] text-saffron mt-0.5">
              🌸 Chadawa: {b.selectedChadawa.map((c: any) => `${c.name} (x${c.qty}) - ${formatCurrency(c.price || c.total)}`).join(", ")}
            </div>
          )}
          {b.selectedItems && b.selectedItems.length > 0 && (
            <div className="text-[11px] text-purple-600 mt-0.5">
              🌸 Items: {b.selectedItems.map((c: any) => `${c.name} (x${c.qty}) - ${formatCurrency(c.price * c.qty)}`).join(", ")}
            </div>
          )}
        </div>
      )
    },
    { key: "date",        header: "Date",    render: (b: BookingRow) => formatDateShort(b.date) },
    { key: "amount",      header: "Amount",  render: (b: BookingRow) => formatCurrency(b.amount) },
    { key: "status",      header: "Status",  render: (b: BookingRow) => {
      const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };
      return <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
    }},
    { key: "paymentStatus", header: "Payment", render: (b: BookingRow) => <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge> },
    {
      key: "_id",
      header: "",
      render: (b: BookingRow) => (
        <Link href={`/user/bookings/${b._id}`} className="text-saffron text-xs hover:underline">Details →</Link>
      ),
    },
  ];

  return (
    <DashboardShell title="Temple Bookings" subtitle="All bookings across your approved temples.">
      <DataTable columns={columns} data={allBookings as any} emptyMessage="No bookings yet." />
    </DashboardShell>
  );
}
