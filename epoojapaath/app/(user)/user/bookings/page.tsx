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

  // Group subscription bookings
  const groupedList: any[] = [];
  const subMap = new Map<string, any[]>();

  for (const b of bookings) {
    if (b.subscriptionParentId) {
      if (!subMap.has(b.subscriptionParentId)) {
        subMap.set(b.subscriptionParentId, []);
      }
      subMap.get(b.subscriptionParentId)!.push(b);
    } else {
      groupedList.push(b);
    }
  }

  for (const [parentId, list] of Array.from(subMap.entries())) {
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = list[0];
    const last = list[list.length - 1];

    groupedList.push({
      ...first,
      isSubGroup: true,
      subStartDate: first.date,
      subEndDate: last.date,
      allSubBookings: list,
    });
  }

  // Sort by date descending
  groupedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const columns: any[] = [
    {
      key: "serviceName",
      header: "Puja / Offering",
      render: (b: any) => (
        <div>
          <div className="font-medium text-foreground flex items-center gap-2">
            {b.serviceName}
            {b.isSubGroup && (
              <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                {b.subscriptionDuration} Months Sub
              </span>
            )}
          </div>
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
              🌸 Offerings: {b.selectedChadawa.map((c: any) => `${c.name} (x${c.qty}) - ${formatCurrency(c.price || c.total)}`).join(", ")}
            </div>
          )}
          {b.selectedItems && b.selectedItems.length > 0 && (
            <div className="text-[11px] text-muted-foreground mt-0.5">
              🌸 Offerings: {b.selectedItems.map((c: any) => `${c.name} (x${c.qty}) - ${formatCurrency(c.price * c.qty)}`).join(", ")}
            </div>
          )}
        </div>
      ),
    },
    { 
      key: "date", 
      header: "Date", 
      render: (b: any) => b.isSubGroup 
        ? `${formatDateShort(b.subStartDate)} - ${formatDateShort(b.subEndDate)}` 
        : formatDateShort(b.date) 
    },
    { key: "amount", header: "Amount", render: (b: any) => formatCurrency(b.amount) },
    {
      key: "status",
      header: "Status",
      render: (b: any) => {
        const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };
        if (b.isSubGroup) {
          const completedCount = b.allSubBookings.filter((x: any) => x.status === "completed").length;
          const status = completedCount === b.subscriptionDuration ? "completed" : "pending";
          return (
            <div className="flex flex-col gap-1">
              <Badge variant={statusMap[status] || "pending"}>{status === "completed" ? "completed" : "active"}</Badge>
              <span className="text-[10px] text-muted-foreground">{completedCount}/{b.subscriptionDuration} Completed</span>
            </div>
          );
        }
        return <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
      },
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (b: any) => (
        <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge>
      ),
    },
    {
      key: "_id",
      header: "",
      render: (b: any) => (
        <Link href={`/user/bookings/${b._id}?isSub=true`} className="text-saffron text-xs hover:underline">Details →</Link>
      ),
    },
  ];

  return (
    <DashboardShell title="My Bookings" subtitle="All your puja and chadawa bookings in one place.">
      <DataTable
        columns={columns}
        data={groupedList}
        emptyMessage="No bookings yet. Book your first puja! 🛕"
      />
    </DashboardShell>
  );
}
