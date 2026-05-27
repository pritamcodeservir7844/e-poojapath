import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
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
    {
      key: "serviceName",
      header: "Puja / Offering",
      render: (b: any) => (
        <div>
          <div className="font-medium text-foreground">{b.serviceName}</div>
          <div className="text-xs text-saffron font-semibold mt-0.5">
            🛕 {typeof b.temple === "object" ? b.temple.name : "Temple"}
          </div>
          {b.selectedPackage && (
            <div className="text-xs text-muted-foreground mt-0.5">
              📦 Package: {b.selectedPackage}
            </div>
          )}
          {b.selectedChadawa && b.selectedChadawa.length > 0 && (
            <div className="text-[11px] text-muted-foreground mt-0.5">
              🌸 Offerings: {b.selectedChadawa.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}
            </div>
          )}
          {b.selectedItems && b.selectedItems.length > 0 && (
            <div className="text-[11px] text-muted-foreground mt-0.5">
              🌸 Offerings: {b.selectedItems.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}
            </div>
          )}
        </div>
      ),
    },
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
