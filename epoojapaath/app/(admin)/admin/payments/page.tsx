"use client";

import { useEffect, useState } from "react";
import {
  IndianRupee, CheckCircle, AlertCircle, Clock, RotateCcw,
  Search, MessageSquare, Phone, Copy, Check, Eye, HelpCircle,
  ExternalLink, Undo2, ArrowUpRight
} from "lucide-react";
import { format } from "date-fns";

interface PaymentItem {
  _id: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  booking?: {
    _id: string;
    serviceName: string;
    serviceType: string;
    date: string;
    devoteeName: string;
    whatsappPhone?: string;
  };
  orderId: string;
  paymentId?: string;
  amount: number;
  paymentMethod?: string;
  status: "pending" | "success" | "failed" | "refunded" | "cancelled";
  errorMessage?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // States for Refund Modal
  const [refundingItem, setRefundingItem] = useState<PaymentItem | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundLoading, setRefundLoading] = useState(false);

  // States for Failed Details Dialog
  const [failedItem, setFailedItem] = useState<PaymentItem | null>(null);

  async function fetchPayments() {
    setLoading(true);
    try {
      const url = `/api/admin/payments?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      } else {
        setError(data.error || "Failed to load payments");
      }
    } catch {
      setError("An error occurred while fetching payments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  // Statistics calculation
  const stats = {
    totalVolume: payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0),
    totalCount: payments.length,
    successCount: payments.filter((p) => p.status === "success").length,
    failedCount: payments.filter((p) => p.status === "failed").length,
    pendingCount: payments.filter((p) => p.status === "pending").length,
    refundedCount: payments.filter((p) => p.status === "refunded").length,
  };

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    const userName = p.user?.name?.toLowerCase() || "";
    const devoteeName = p.booking?.devoteeName?.toLowerCase() || "";
    const email = p.user?.email?.toLowerCase() || "";
    const orderId = p.orderId?.toLowerCase() || "";
    const paymentId = p.paymentId?.toLowerCase() || "";
    const serviceName = p.booking?.serviceName?.toLowerCase() || "";

    return (
      userName.includes(term) ||
      devoteeName.includes(term) ||
      email.includes(term) ||
      orderId.includes(term) ||
      paymentId.includes(term) ||
      serviceName.includes(term)
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundingItem) return;
    setRefundLoading(true);
    try {
      const res = await fetch("/api/admin/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: refundingItem.paymentId,
          amount: refundAmount ? parseFloat(refundAmount) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Refund successfully processed!");
        setRefundingItem(null);
        setRefundAmount("");
        fetchPayments();
      } else {
        alert("Refund failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error processing refund: " + err.message);
    } finally {
      setRefundLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "refunded":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  // Generate standard whatsapp follow up text
  const getWhatsAppLink = (item: PaymentItem) => {
    const phone = item.booking?.whatsappPhone || item.user?.phone || "";
    if (!phone) return "";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    // Ensure country code 91 if it has 10 digits
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = `Namaste ${item.booking?.devoteeName || item.user?.name || "Devotee"}, your payment of ₹${item.amount} for "${item.booking?.serviceName || "Poojan"}" on ePoojapaath was not completed. If you faced any issue, you can retry your booking here: ${window.location.origin}/user/bookings\n\nFor any support, please let us know.`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-foreground flex items-center gap-2">
            <IndianRupee className="text-saffron h-8 w-8" /> Payment Operations
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor client billing, process manual refunds, and manage failed transactions.
          </p>
        </div>
        <button
          onClick={fetchPayments}
          className="btn-devotional flex items-center gap-1.5 self-start md:self-auto bg-saffron/10 border border-saffron/30 text-saffron px-4 py-2 rounded-xl text-sm font-semibold hover:bg-saffron/20 transition-all duration-200"
        >
          Refresh Data
        </button>
      </div>

      {/* ── Statistics Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-saffron/10 text-saffron rounded-xl">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Volume</p>
            <h3 className="text-xl md:text-2xl font-bold font-heading mt-1 text-foreground">
              ₹{stats.totalVolume.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Success Rate</p>
            <h3 className="text-xl md:text-2xl font-bold font-heading mt-1 text-foreground">
              {stats.totalCount > 0 ? Math.round((stats.successCount / stats.totalCount) * 100) : 0}%
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({stats.successCount} of {stats.totalCount})
              </span>
            </h3>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Failed Orders</p>
            <h3 className="text-xl md:text-2xl font-bold font-heading mt-1 text-foreground">
              {stats.failedCount}
            </h3>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <RotateCcw size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Refunded Transactions</p>
            <h3 className="text-xl md:text-2xl font-bold font-heading mt-1 text-foreground">
              {stats.refundedCount}
            </h3>
          </div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          {["all", "success", "failed", "pending", "refunded"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold capitalize border transition-all duration-200 ${
                statusFilter === status
                  ? "bg-saffron text-white border-saffron shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
          <input
            type="text"
            placeholder="Search Order, User, Devotee, Service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
          />
        </div>
      </div>

      {/* ── Data List ── */}
      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">{error}</div>}

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Devotee / User</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Order ID & Payment ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Transaction Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-saffron mb-2"></div>
                    <p>Loading transactions...</p>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No transactions matching your selection.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/15 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">
                        {item.booking?.devoteeName || item.user?.name || "Guest User"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.user?.email || "No email"}</div>
                      {(item.booking?.whatsappPhone || item.user?.phone) && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone size={10} className="text-muted-foreground/60" />
                          {item.booking?.whatsappPhone || item.user?.phone}
                        </div>
                      )}
                    </td>

                    {/* Service Type & Name */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{item.booking?.serviceName || "Poojan"}</span>
                      {item.booking?.serviceType && (
                        <span className="ml-1.5 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-saffron/10 text-saffron">
                          {item.booking.serviceType}
                        </span>
                      )}
                    </td>

                    {/* Order ID & Payment ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs font-medium text-foreground">{item.orderId}</span>
                        <button
                          onClick={() => handleCopy(item.orderId, `${item._id}_order`)}
                          className="text-muted-foreground hover:text-saffron p-1 transition"
                          title="Copy Order ID"
                        >
                          {copiedId === `${item._id}_order` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                      {item.paymentId && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-xs text-muted-foreground font-mono">{item.paymentId}</span>
                          <button
                            onClick={() => handleCopy(item.paymentId!, `${item._id}_pay`)}
                            className="text-muted-foreground hover:text-saffron p-1 transition"
                            title="Copy Payment ID"
                          >
                            {copiedId === `${item._id}_pay` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold font-heading text-base text-foreground">
                      ₹{item.amount}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Transaction Date */}
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Gateway response viewer */}
                        {item.gatewayResponse && (
                          <button
                            onClick={() => setSelectedResponse(item.gatewayResponse)}
                            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                            title="View Raw Gateway Response"
                          >
                            <Eye size={14} />
                          </button>
                        )}

                        {/* Refund trigger */}
                        {item.status === "success" && item.paymentId && (
                          <button
                            onClick={() => {
                              setRefundingItem(item);
                              setRefundAmount(item.amount.toString());
                            }}
                            className="px-3 py-1.5 rounded-lg border border-purple-500/30 text-purple-500 hover:bg-purple-500/10 text-xs font-semibold flex items-center gap-1 transition"
                            title="Manual Refund"
                          >
                            <Undo2 size={12} /> Refund
                          </button>
                        )}

                        {/* Failed checkout support */}
                        {item.status === "failed" && (
                          <button
                            onClick={() => setFailedItem(item)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <AlertCircle size={12} /> Manage Fail
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── JSON Gateway Response Modal ── */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h3 className="font-heading text-lg text-foreground">Razorpay Gateway Raw JSON</h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold bg-muted px-2 py-1 rounded"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto mt-4 p-4 bg-muted/30 border border-border rounded-xl font-mono text-xs text-foreground">
              <pre>{JSON.stringify(selectedResponse, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ── Refund Modal ── */}
      {refundingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleRefundSubmit}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-heading text-lg text-foreground flex items-center gap-2">
                <RotateCcw className="text-purple-500" size={20} /> Process Refund
              </h3>
              <button
                type="button"
                onClick={() => setRefundingItem(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                Refund money to patient/customer for Razorpay Payment:
              </p>
              <div className="bg-muted/40 p-3 rounded-xl space-y-1">
                <p>
                  <strong>Customer:</strong> {refundingItem.booking?.devoteeName || refundingItem.user?.name}
                </p>
                <p>
                  <strong>Service:</strong> {refundingItem.booking?.serviceName}
                </p>
                <p>
                  <strong>Payment ID:</strong> {refundingItem.paymentId}
                </p>
                <p>
                  <strong>Full Paid:</strong> ₹{refundingItem.amount}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Refund Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                max={refundingItem.amount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-saffron/40"
              />
              <p className="text-[10px] text-muted-foreground">
                Leave as is for a full refund. Max allowed: ₹{refundingItem.amount}
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setRefundingItem(null)}
                className="px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-muted/40 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={refundLoading}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
              >
                {refundLoading ? "Processing..." : "Confirm Refund"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Failed Transaction Manager Modal ── */}
      {failedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-heading text-lg text-foreground flex items-center gap-2 text-red-500">
                <AlertCircle size={20} /> Failed Transaction Operations
              </h3>
              <button
                onClick={() => setFailedItem(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Problem details */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Error Description</p>
                <p className="text-sm font-medium text-foreground">
                  {failedItem.errorMessage || "No error reason returned from Razorpay"}
                </p>
              </div>

              {/* Transaction Context */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/40 p-4 rounded-xl">
                <div>
                  <p className="text-muted-foreground">Devotee Name</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {failedItem.booking?.devoteeName || failedItem.user?.name || "Devotee"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Amount</p>
                  <p className="font-semibold text-foreground mt-0.5">₹{failedItem.amount}</p>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-muted-foreground">Razorpay Order ID</p>
                  <p className="font-mono text-foreground mt-0.5">{failedItem.orderId}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact & Recovery Options</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* WhatsApp Support Link */}
                  {getWhatsAppLink(failedItem) ? (
                    <a
                      href={getWhatsAppLink(failedItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <MessageSquare size={14} /> Send WhatsApp Alert
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-muted text-muted-foreground rounded-xl text-xs font-semibold cursor-not-allowed"
                    >
                      WhatsApp Unavail.
                    </button>
                  )}

                  {/* Direct Phone Call */}
                  {failedItem.booking?.whatsappPhone || failedItem.user?.phone ? (
                    <a
                      href={`tel:${failedItem.booking?.whatsappPhone || failedItem.user?.phone}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-saffron hover:opacity-90 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Phone size={14} /> Call Customer
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-muted text-muted-foreground rounded-xl text-xs font-semibold cursor-not-allowed"
                    >
                      Phone Unavail.
                    </button>
                  )}
                </div>

                {/* Resend Link button */}
                <button
                  onClick={() => {
                    const retryUrl = `${window.location.origin}/user/bookings`;
                    handleCopy(retryUrl, `retry_${failedItem._id}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border hover:bg-muted/40 text-foreground rounded-xl text-xs font-semibold transition"
                >
                  {copiedId === `retry_${failedItem._id}` ? (
                    <>
                      <Check size={14} className="text-green-500" /> Retry Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Retry Checkout URL
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setFailedItem(null)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
