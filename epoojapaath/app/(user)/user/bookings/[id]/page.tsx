import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { getBookingById } from "@/services/booking.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import type { IBooking, ITemple } from "@/types";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const booking = await getBookingById(params.id).catch(() => null) as (IBooking & { _id: string; temple: ITemple & { _id: string } }) | null;
  if (!booking) notFound();

  if (booking.user?.toString() !== session.user.id && session.user.role !== "admin") {
    redirect("/user/bookings");
  }

  return (
    <DashboardShell
      title="Booking Details"
      subtitle={`Booking #${booking._id.toString().slice(-8).toUpperCase()}`}
      action={<Link href="/user/bookings" className="text-saffron text-sm hover:underline">← All Bookings</Link>}
    >
      <div className="max-w-2xl space-y-6">
        {/* Status Banner */}
        <div className="card-devotional flex items-center justify-between">
          <div>
            <p className="font-heading text-xl text-dark">{booking.serviceName}</p>
            <p className="text-muted text-sm mt-0.5">{formatDate(booking.date)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={({ pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" } as any)[booking.status] || "pending"}>
              {booking.status}
            </Badge>
            <Badge variant={booking.paymentStatus as any}>{booking.paymentStatus}</Badge>
          </div>
        </div>

        {/* Devotee Details */}
        <div className="card-devotional">
          <h2 className="font-heading text-lg text-dark mb-4">Devotee Information</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="font-medium text-dark mt-0.5">{booking.devoteeName}</dd>
            </div>
            {booking.gotra && (
              <div>
                <dt className="text-muted">Gotra</dt>
                <dd className="font-medium text-dark mt-0.5">{booking.gotra}</dd>
              </div>
            )}
            {booking.sankalp && (
              <div className="col-span-2">
                <dt className="text-muted">Sankalp / Intention</dt>
                <dd className="font-medium text-dark mt-0.5">{booking.sankalp}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Temple & Service */}
        <div className="card-devotional">
          <h2 className="font-heading text-lg text-dark mb-4">Service Details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted">Type</dt>
              <dd className="font-medium text-dark mt-0.5 capitalize">{booking.serviceType}</dd>
            </div>
            <div>
              <dt className="text-muted">Temple</dt>
              <dd className="font-medium text-dark mt-0.5">
                {typeof booking.temple === "object" ? (
                  <Link href={`/temples/${booking.temple.slug}`} className="text-saffron hover:underline">
                    {booking.temple.name}
                  </Link>
                ) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Date</dt>
              <dd className="font-medium text-dark mt-0.5">{formatDate(booking.date)}</dd>
            </div>
            <div>
              <dt className="text-muted">Amount Paid</dt>
              <dd className="font-heading text-saffron text-base mt-0.5">{formatCurrency(booking.amount)}</dd>
            </div>
          </dl>
        </div>

        {/* Prasad Delivery */}
        {booking.prasadDelivery && (
          <div className="card-devotional">
            <h2 className="font-heading text-lg text-dark mb-3">Prasad Delivery</h2>
            <p className="text-muted text-sm">{booking.prasadAddress || "Address not provided"}</p>
          </div>
        )}

        {/* Payment Details */}
        {booking.paymentId && (
          <div className="card-devotional">
            <h2 className="font-heading text-lg text-dark mb-4">Payment Reference</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Payment ID</dt>
                <dd className="font-mono text-dark text-xs">{booking.paymentId}</dd>
              </div>
              {booking.orderId && (
                <div className="flex justify-between">
                  <dt className="text-muted">Order ID</dt>
                  <dd className="font-mono text-dark text-xs">{booking.orderId}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Video Prasad */}
        {booking.videoUrl && (
          <div className="card-devotional">
            <h2 className="font-heading text-lg text-dark mb-3">Puja Video 🙏</h2>
            <video src={booking.videoUrl} controls className="w-full rounded-xl" />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
