import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getAllBookingsAdmin } from "@/services/booking.service";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { IBooking, IUser, ITemple } from "@/types";
import Link from "next/link";

type BookingRow = IBooking & { _id: string; user: Partial<IUser>; temple: Partial<ITemple> };

interface PageProps {
  searchParams: { status?: string; serviceType?: string };
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const bookings = await getAllBookingsAdmin({
    status:      searchParams.status,
    serviceType: searchParams.serviceType,
  }).catch(() => []) as BookingRow[];

  const columns: any[] = [
    { key: "devoteeName", header: "Devotee" },
    { key: "serviceName", header: "Service"  },
    { key: "temple",      header: "Temple",   render: (b: BookingRow) => (b.temple as Partial<ITemple>)?.name || "—" },
    { key: "date",        header: "Date",     render: (b: BookingRow) => formatDateShort(b.date) },
    { key: "amount",      header: "Amount",   render: (b: BookingRow) => formatCurrency(b.amount) },
    { key: "dakshina",    header: "Dakshina", render: (b: BookingRow) => b.dakshina ? formatCurrency(b.dakshina) : "—" },
    { key: "serviceType", header: "Type",     render: (b: BookingRow) => <Badge variant={b.serviceType === "puja" ? "saffron" : "purple"}>{b.serviceType}</Badge> },
    { key: "status",      header: "Status",   render: (b: BookingRow) => {
      const statusMap: Record<string, any> = {
        pending: "pending",
        confirmed: "approved",
        completed: "completed",
        cancelled: "cancelled"
      };
      return <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
    }},
    { key: "paymentStatus",header:"Payment",  render: (b: BookingRow) => <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge> },
    {
      key: "_id",
      header: "",
      render: (b: BookingRow) => (
        <Link href={`/user/bookings/${b._id}`} className="text-saffron text-xs hover:underline">Details →</Link>
      ),
    },
  ];

  return (
    <DashboardShell title="All Bookings" subtitle={`${bookings.length} bookings total`}>
      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <Select name="status" defaultValue={searchParams.status} className="py-2 text-sm w-40"
          placeholder="All Status"
          options={["pending","confirmed","completed","cancelled"].map((s) => ({ value: s, label: s }))} />
        <Select name="serviceType" defaultValue={searchParams.serviceType} className="py-2 text-sm w-40"
          placeholder="All Types"
          options={[{ value: "puja", label: "Puja" }, { value: "chadawa", label: "Chadawa" }]} />
        <Button type="submit" size="sm">Filter</Button>
        {(searchParams.status || searchParams.serviceType) && (
          <a href="/admin/bookings" className="btn-outline-gold py-2 px-4 text-sm">Clear</a>
        )}
      </form>
      <DataTable columns={columns} data={bookings as any} emptyMessage="No bookings found." />
    </DashboardShell>
  );
}
