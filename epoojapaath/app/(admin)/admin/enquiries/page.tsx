"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { Mail, Phone, Trash2, Eye } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface IEnquiry {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      const res = await fetch("/api/admin/enquiries");
      const resData = await res.json();
      if (resData.success) {
        setEnquiries(resData.data);
      } else {
        devToast.error(resData.error || "Failed to load enquiries");
      }
    } catch {
      devToast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (resData.success) {
        devToast.blessing("Enquiry deleted successfully!");
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry(null);
        }
      } else {
        devToast.error(resData.error || "Failed to delete");
      }
    } catch {
      devToast.error("Failed to delete enquiry");
    }
  }

  const columns = [
    {
      key: "createdAt",
      header: "Date",
      render: (item: IEnquiry) => (
        <span className="text-xs whitespace-nowrap">
          {formatDateShort(item.createdAt)}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (item: IEnquiry) => (
        <span className="font-semibold text-foreground">{item.name}</span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (item: IEnquiry) => (
        <a
          href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-saffron hover:underline whitespace-nowrap flex items-center gap-1"
        >
          <Phone size={13} /> {item.phone}
        </a>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (item: IEnquiry) =>
        item.email ? (
          <a href={`mailto:${item.email}`} className="hover:underline">
            {item.email}
          </a>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (item: IEnquiry) => (
        <span className="font-medium text-foreground">{item.subject}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: IEnquiry) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1.5 h-8 px-2.5"
            onClick={() => setSelectedEnquiry(item)}
          >
            <Eye size={13} /> View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1.5 h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => handleDelete(item._id)}
          >
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      title="Contact Enquiries"
      subtitle={`${enquiries.length} submitted messages`}
    >
      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading enquiries...</p>
        ) : (
          <DataTable columns={columns} data={enquiries as any} emptyMessage="No enquiries found." />
        )}

        {/* Details View Modal/Overlay */}
        {selectedEnquiry && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg border border-border rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-border bg-saffron/5 flex items-center justify-between">
                <h3 className="font-heading text-lg text-foreground flex items-center gap-2">
                  <Mail className="text-saffron" size={20} /> Enquiry Details
                </h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-muted-foreground hover:text-foreground text-xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Sender Name</span>
                    <strong className="text-foreground">{selectedEnquiry.name}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Date & Time</span>
                    <span className="text-foreground font-medium">
                      {new Date(selectedEnquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Phone / WhatsApp</span>
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-saffron hover:underline font-semibold"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Email Address</span>
                    {selectedEnquiry.email ? (
                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className="text-foreground hover:underline font-medium"
                      >
                        {selectedEnquiry.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/50 font-medium">—</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground block mb-1">Subject</span>
                  <p className="font-heading text-foreground font-medium text-base">
                    {selectedEnquiry.subject}
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground block mb-1">Message</span>
                  <div className="bg-background rounded-xl p-4 border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {selectedEnquiry.message}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-card-bg flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedEnquiry(null)}>
                  Close
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={() => {
                    handleDelete(selectedEnquiry._id);
                  }}
                >
                  Delete Message
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
