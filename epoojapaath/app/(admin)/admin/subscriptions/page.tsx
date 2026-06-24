import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import "@/models/Temple"; // Ensure Temple model is registered
import "@/models/User"; // Ensure User model is registered
import { formatCurrency, formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();
  const bookings = await Booking.find({ subscriptionParentId: { $ne: null } })
    .populate("user", "name email phone")
    .populate("temple", "name")
    .sort({ date: 1 })
    .lean();

  const subscriptionMap = new Map<string, any>();

  for (const booking of bookings) {
    const parentId = booking.subscriptionParentId!;
    if (!subscriptionMap.has(parentId)) {
      subscriptionMap.set(parentId, {
        id: parentId,
        devoteeName: booking.devoteeName,
        phone: booking.whatsappPhone || (booking.user as any)?.phone || "",
        gotra: booking.gotra,
        sankalp: booking.sankalp,
        serviceName: booking.serviceName,
        serviceNameHi: booking.serviceNameHi,
        templeName: (booking.temple as any)?.name || "Unknown Temple",
        duration: booking.subscriptionDuration || 1,
        totalAmount: booking.amount,
        createdAt: booking.createdAt,
        bookings: [],
      });
    }
    subscriptionMap.get(parentId).bookings.push(booking);
  }

  const subscriptions = Array.from(subscriptionMap.values()).map((sub) => {
    const subBookings = sub.bookings;
    const completedCount = subBookings.filter((b: any) => b.status === "completed").length;
    const startDate = subBookings[0]?.date || null;
    const nextBooking = subBookings.find((b: any) => b.status !== "completed" && b.status !== "cancelled");
    const nextBookingDate = nextBooking ? nextBooking.date : null;
    const status = completedCount === sub.duration ? "completed" : "active";

    return {
      id: sub.id,
      devoteeName: sub.devoteeName,
      phone: sub.phone,
      gotra: sub.gotra,
      sankalp: sub.sankalp,
      serviceName: sub.serviceName,
      serviceNameHi: sub.serviceNameHi,
      templeName: sub.templeName,
      duration: sub.duration,
      totalAmount: sub.totalAmount,
      completedCount,
      startDate,
      nextBookingDate,
      status,
      createdAt: sub.createdAt,
    };
  });

  subscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const columns = [
    { 
      key: "devoteeName", 
      header: "Devotee",
      render: (s: any) => (
        <div>
          <div className="font-medium text-foreground">{s.devoteeName}</div>
          {s.phone && (
            <div className="text-xs text-muted-foreground mt-0.5 font-mono">
              📞 {s.phone}
            </div>
          )}
        </div>
      ),
    },
    { key: "serviceName", header: "Puja Service" },
    { key: "templeName", header: "Temple" },
    { key: "duration", header: "Duration", render: (s: any) => `${s.duration} Months` },
    { key: "completedCount", header: "Progress", render: (s: any) => `${s.completedCount}/${s.duration} Completed` },
    { key: "totalAmount", header: "Paid Amount", render: (s: any) => formatCurrency(s.totalAmount) },
    { key: "startDate", header: "Start Date", render: (s: any) => s.startDate ? formatDateShort(s.startDate) : "—" },
    { key: "nextBookingDate", header: "Next Scheduled", render: (s: any) => s.nextBookingDate ? formatDateShort(s.nextBookingDate) : "—" },
    { 
      key: "status", 
      header: "Status", 
      render: (s: any) => (
        <Badge variant={s.status === "completed" ? "completed" : "approved"}>
          {s.status === "completed" ? "Completed" : "Active"}
        </Badge>
      ) 
    },
  ];

  return (
    <DashboardShell title="Subscriptions" subtitle={`${subscriptions.length} active multi-month subscriptions`}>
      <DataTable columns={columns} data={subscriptions} emptyMessage="No subscriptions found." />
    </DashboardShell>
  );
}
