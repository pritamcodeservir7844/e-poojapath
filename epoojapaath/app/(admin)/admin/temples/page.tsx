import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { TempleActions } from "@/components/admin/TempleActions";
import { getAllTemplesAdmin } from "@/services/temple.service";
import { formatDateShort } from "@/lib/utils";
import type { ITemple, IUser } from "@/types";

type TempleRow = ITemple & { _id: string; owner: Partial<IUser> };

export default async function AdminTemplesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const temples = await getAllTemplesAdmin().catch(() => []) as TempleRow[];

  const columns: any[] = [
    { key: "name",     header: "Temple",   render: (t: TempleRow) => <span className="font-medium text-foreground">{t.name}</span> },
    { key: "deity",    header: "Deity"     },
    { key: "location", header: "City",     render: (t: TempleRow) => `${t.location.city}, ${t.location.state}` },
    { key: "owner",    header: "Owner",    render: (t: TempleRow) => (t.owner as Partial<IUser>)?.name || "—" },
    { key: "status",   header: "Status",   render: (t: TempleRow) => <Badge variant={t.status as any}>{t.status}</Badge> },
    { key: "featured", header: "Featured", render: (t: TempleRow) => t.featured ? "⭐ Yes" : "—" },
    { key: "createdAt",header: "Created",  render: (t: TempleRow) => formatDateShort(t.createdAt) },
    { key: "_id",      header: "Actions",  render: (t: TempleRow) => <TempleActions id={t._id.toString()} status={t.status} /> },
  ];

  return (
    <DashboardShell title="Temple Manager" subtitle={`${temples.length} temples registered`}>
      <DataTable columns={columns} data={temples as any} emptyMessage="No temples yet." />
    </DashboardShell>
  );
}
