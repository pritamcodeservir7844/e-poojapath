"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, Calendar, Search, ArrowRight, Gift, Sparkles } from "lucide-react";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { IBooking } from "@/types";

interface UserDashboardClientProps {
  initialBookings: (IBooking & { _id: string })[];
}

export function UserDashboardClient({ initialBookings }: UserDashboardClientProps) {
  const [bookings, setBookings] = useState<(IBooking & { _id: string })[]>(initialBookings);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings">("overview");

  // Filter and search states
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = useSearchParams();

  // Sync tab with URL parameter on mount and when searchParams change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "bookings") {
      setActiveTab("bookings");
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "overview" | "bookings") => {
    setActiveTab(tab);
    const newUrl = tab === "overview" ? "/user/dashboard" : "/user/dashboard?tab=bookings";
    window.history.pushState(null, "", newUrl);
  };

  // Poll bookings in background to keep data real-time
  useEffect(() => {
    let active = true;

    const interval = setInterval(async () => {
      try {
        setIsSyncing(true);
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const resData = await res.json();
        if (resData.success && active) {
          setBookings(resData.data);
        }
      } catch (err) {
        console.error("Error updating dashboard data:", err);
      } finally {
        setTimeout(() => {
          if (active) setIsSyncing(false);
        }, 800);
      }
    }, 6000); // Poll every 6 seconds

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const paid      = bookings.filter((b) => b.paymentStatus === "paid").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const pending   = bookings.filter((b) => b.status === "pending").length;

  // Filtered and searched bookings list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = filterStatus === "all" || b.status === filterStatus;
      
      const templeName = typeof b.temple === "object" ? b.temple.name : "Temple";
      const searchContent = `${b.serviceName} ${templeName} ${b.selectedPackage || ""}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  // Extract day and month for calendar card badge
  const getCalendarDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return { day, month, year };
  };

  return (
    <>
      {/* Sub-Tabs Switcher */}
      <div className="flex border-b border-deep-gold/15 mb-6">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative -mb-px border-b-2 ${
            activeTab === "overview"
              ? "border-saffron text-saffron"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard size={16} />
          Overview
        </button>
        <button
          onClick={() => handleTabChange("bookings")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative -mb-px border-b-2 ${
            activeTab === "bookings"
              ? "border-saffron text-saffron"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar size={16} />
          My Bookings
          <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ml-1 transition-colors ${
            activeTab === "bookings"
              ? "bg-saffron/15 text-saffron"
              : "bg-muted text-muted-foreground"
          }`}>
            {bookings.length}
          </span>
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* Live status synchronization indicator */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 text-xs font-medium bg-saffron/5 text-saffron px-3 py-1.5 rounded-full border border-saffron/10 shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? "bg-amber-500 animate-spin" : "bg-green-500 animate-pulse"}`} />
              <span>{isSyncing ? "Syncing..." : "Live Connection Active"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📿" label="Total Bookings"    value={bookings.length} />
            <StatCard icon="✅" label="Completed"          value={completed}       accent="border-l-green-500" />
            <StatCard icon="⏳" label="Pending"            value={pending}         accent="border-l-yellow-500" />
            <StatCard icon="💳" label="Paid Bookings"      value={paid}            accent="border-l-lotus-blue" />
          </div>

          <div className="card-devotional">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-foreground flex items-center gap-2">
                <Sparkles size={18} className="text-saffron" />
                Recent Bookings
              </h2>
              <button onClick={() => handleTabChange("bookings")} className="text-saffron text-sm hover:underline font-medium">View all →</button>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🛕</p>
                <p className="text-muted-foreground">No bookings yet.</p>
                <Link href="/puja" className="btn-saffron mt-4 inline-block text-sm py-2 px-5">Book a Puja</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((b) => {
                  const { day, month, year } = getCalendarDate(b.date);
                  const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };
                  
                  return (
                    <div key={b._id.toString()} 
                      className="p-5 bg-card hover:bg-saffron/[0.02] border border-deep-gold/15 hover:border-saffron/30 rounded-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      
                      <div className="flex items-start gap-4">
                        {/* Calendar Badge */}
                        <div className="flex flex-col items-center justify-center bg-saffron/10 border border-saffron/20 rounded-xl px-3 py-2 min-w-[60px] text-center shadow-sm">
                          <span className="text-xl font-bold text-saffron leading-none">{day}</span>
                          <span className="text-[10px] font-bold text-saffron/80 uppercase tracking-wider mt-1">{month}</span>
                          <span className="text-[9px] text-muted-foreground mt-0.5">{year}</span>
                        </div>

                        {/* Booking Details Info */}
                        <div className="space-y-1">
                          <h3 className="font-heading text-base md:text-lg text-foreground font-semibold group-hover:text-saffron transition-colors">
                            {b.serviceName}
                          </h3>
                          <p className="text-xs text-saffron font-semibold flex items-center gap-1.5">
                            <span>🛕</span>
                            <span>{typeof b.temple === "object" ? b.temple.name : "Temple"}</span>
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {b.selectedPackage && (
                              <span className="inline-flex items-center gap-1 text-[11px] bg-muted/70 text-muted-foreground px-2 py-0.5 rounded-md border border-border">
                                📦 {b.selectedPackage}
                              </span>
                            )}
                            {(b.selectedChadawa && b.selectedChadawa.length > 0) || (b.selectedItems && b.selectedItems.length > 0) ? (
                              <span className="inline-flex items-center gap-1 text-[11px] bg-saffron/5 text-saffron px-2 py-0.5 rounded-md border border-saffron/10">
                                🌸 Offerings Included
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Amount & Badges */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-deep-gold/10">
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block md:mb-0.5">Amount Paid</span>
                          <span className="text-lg font-heading font-bold text-foreground">{formatCurrency(b.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
                          <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge>
                          <Link href={`/user/bookings/${b._id}`} 
                            className="flex items-center justify-center p-2 rounded-xl bg-saffron/5 text-saffron hover:bg-saffron hover:text-white border border-saffron/10 hover:border-saffron transition-all ml-1"
                            title="View details"
                          >
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card-devotional">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="font-heading text-xl text-foreground flex items-center gap-2">
              <Gift size={18} className="text-saffron" />
              All Bookings
            </h2>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-deep-gold/20 rounded-full px-4 py-2 pl-9 text-xs text-foreground focus:outline-none focus:border-saffron transition-all shadow-sm"
                />
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={12} />
              </div>

              {/* Status Selector */}
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold capitalize transition-all border ${
                      filterStatus === status
                        ? "bg-saffron text-white border-saffron shadow-sm"
                        : "bg-background text-muted-foreground border-deep-gold/15 hover:border-saffron/30 hover:text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-deep-gold/20 rounded-2xl bg-saffron/[0.01]">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-muted-foreground text-sm">No bookings matched your filters.</p>
              {(searchQuery || filterStatus !== "all") && (
                <button 
                  onClick={() => { setFilterStatus("all"); setSearchQuery(""); }} 
                  className="text-saffron text-xs font-semibold hover:underline mt-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const { day, month, year } = getCalendarDate(b.date);
                const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };

                return (
                  <div key={b._id.toString()} 
                    className="p-5 bg-background hover:bg-saffron/[0.02] border border-deep-gold/15 hover:border-saffron/30 rounded-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    
                    <div className="flex items-start gap-4">
                      {/* Calendar Badge */}
                      <div className="flex flex-col items-center justify-center bg-saffron/10 border border-saffron/20 rounded-xl px-3 py-2.5 min-w-[64px] text-center shadow-sm">
                        <span className="text-xl font-bold text-saffron leading-none">{day}</span>
                        <span className="text-[10px] font-bold text-saffron/80 uppercase tracking-wider mt-1">{month}</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">{year}</span>
                      </div>

                      {/* Info columns */}
                      <div className="space-y-1">
                        <h3 className="font-heading text-base md:text-lg text-foreground font-semibold group-hover:text-saffron transition-colors">
                          {b.serviceName}
                        </h3>
                        <p className="text-xs text-saffron font-semibold flex items-center gap-1.5">
                          <span>🛕</span>
                          <span>{typeof b.temple === "object" ? b.temple.name : "Temple"}</span>
                        </p>
                        
                        {/* Package and Chadawa details */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {b.selectedPackage && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-muted/70 text-muted-foreground px-2 py-0.5 rounded-md border border-border">
                              📦 Package: {b.selectedPackage}
                            </span>
                          )}
                          {b.selectedChadawa && b.selectedChadawa.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-lotus-blue/5 text-lotus-blue px-2 py-0.5 rounded-md border border-lotus-blue/10">
                              🌸 Offerings: {b.selectedChadawa.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}
                            </span>
                          )}
                          {b.selectedItems && b.selectedItems.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-lotus-blue/5 text-lotus-blue px-2 py-0.5 rounded-md border border-lotus-blue/10">
                              🌸 Offerings: {b.selectedItems.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-deep-gold/10">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block md:mb-0.5">Amount Paid</span>
                        <span className="text-lg font-heading font-bold text-foreground">{formatCurrency(b.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
                        <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge>
                        <Link href={`/user/bookings/${b._id}`} 
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-saffron text-white hover:bg-saffron-dark text-xs font-semibold transition-all ml-1 shadow-sm shadow-saffron/10 hover:shadow-md"
                        >
                          Details <ArrowRight size={12} className="ml-0.5" />
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
