import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getUserBookings } from "@/services/booking.service";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import Link from "next/link";
import type { IBooking } from "@/types";

export default async function UserBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await getUserBookings(session.user.id!).catch(() => []) as (IBooking & { _id: string })[];

  const columns: any[] = [
    { key: "serviceName", header: "Puja / Offering" },
    { key: "date",        header: "Date",   render: (b: IBooking & { _id: string }) => formatDateShort(b.date) },
    { key: "amount",      header: "Amount", render: (b: IBooking & { _id: string }) => formatCurrency(b.amount) },
    {
      key: "status",
      header: "Status",
      render: (b: IBooking & { _id: string }) => {
        const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };
        return <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
      },
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (b: IBooking & { _id: string }) => (
        <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge>
      ),
    },
    {
      key: "_id",
      header: "",
      render: (b: IBooking & { _id: string }) => (
        <Link href={`/user/bookings/${b._id}`} className="text-saffron text-xs hover:underline">Details →</Link>
      ),
    },
  ];

  return (
    <DashboardShell title="My Bookings" subtitle="All your puja and chadawa bookings in one place.">
      <DataTable
        columns={columns}
        data={bookings as any[]}
        emptyMessage="No bookings yet. Book your first puja! 🛕"
      />
    </DashboardShell>
  );
}
