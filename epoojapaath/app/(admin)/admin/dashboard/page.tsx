import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Blog from "@/models/Blog";
import { formatCurrency } from "@/lib/utils";

async function getStats() {
  await connectDB();
  const [temples, users, bookings, blogs] = await Promise.all([
    Temple.countDocuments(),
    User.countDocuments(),
    Booking.countDocuments(),
    Blog.countDocuments({ status: "published" }),
  ]);
  const revenue = await Booking.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return { temples, users, bookings, blogs, revenue: revenue[0]?.total || 0 };
}

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const stats = await getStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="font-heading text-3xl text-dark mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-8">Welcome back, {session.user.name} 🙏</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: "Total Temples",    value: stats.temples,              icon: "🛕", color: "bg-saffron/10   border-l-saffron"   },
          { label: "Total Users",      value: stats.users,                icon: "👤", color: "bg-lotus-blue/10 border-l-lotus-blue" },
          { label: "Total Bookings",   value: stats.bookings,             icon: "📿", color: "bg-lotus-purple/10 border-l-lotus-purple" },
          { label: "Total Revenue",    value: formatCurrency(stats.revenue), icon: "₹", color: "bg-green-50 border-l-green-500" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`card-devotional border-l-4 ${color}`}>
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-heading text-2xl text-dark">{value}</div>
            <div className="text-muted text-sm">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-devotional">
          <h2 className="font-heading text-xl text-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Manage Temples", href: "/admin/temples",  icon: "🛕" },
              { label: "Manage Users",   href: "/admin/users",    icon: "👥" },
              { label: "View Bookings",  href: "/admin/bookings", icon: "📋" },
              { label: "Manage Ads",     href: "/admin/ads",      icon: "📢" },
            ].map(({ label, href, icon }) => (
              <a key={href} href={href}
                className="flex items-center gap-3 p-3 bg-cream hover:bg-saffron/5 rounded-xl border border-deep-gold/20 hover:border-saffron/30 transition-all">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-dark">{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="card-devotional">
          <h2 className="font-heading text-xl text-dark mb-4">Platform Status</h2>
          <div className="space-y-3">
            {[
              { label: "Published Blogs",   value: stats.blogs,    status: "active" },
              { label: "Pending Temples",   value: "—",            status: "pending" },
              { label: "Active Campaigns",  value: "—",            status: "active" },
            ].map(({ label, value, status }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-deep-gold/10">
                <span className="text-sm text-dark">{label}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="text-sm font-medium text-dark">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
