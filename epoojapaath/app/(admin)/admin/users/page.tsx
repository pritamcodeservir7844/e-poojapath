import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { UserActions } from "@/components/admin/UserActions";
import { getAllUsersAdmin } from "@/services/user.service";
import { formatDateShort } from "@/lib/utils";
import type { IUser } from "@/types";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const users = await getAllUsersAdmin().catch(() => []) as (IUser & { _id: string })[];

  const roleBadge: Record<string, "approved" | "saffron" | "purple"> = {
    admin: "approved", temple_owner: "saffron", user: "purple",
  };

  const columns: any[] = [
    { key: "name",      header: "Name",    render: (u: IUser & { _id: string }) => <span className="font-medium text-dark">{u.name}</span> },
    { key: "email",     header: "Email"    },
    { key: "phone",     header: "Phone",   render: (u: IUser & { _id: string }) => u.phone || "—" },
    { key: "role",      header: "Role",    render: (u: IUser & { _id: string }) => <Badge variant={roleBadge[u.role] || "saffron"}>{u.role}</Badge> },
    { key: "isBlocked", header: "Status",  render: (u: IUser & { _id: string }) => <Badge variant={u.isBlocked ? "rejected" : "approved"}>{u.isBlocked ? "Blocked" : "Active"}</Badge> },
    { key: "createdAt", header: "Joined",  render: (u: IUser & { _id: string }) => formatDateShort(u.createdAt) },
    { key: "_id",       header: "Actions", render: (u: IUser & { _id: string }) => <UserActions id={u._id.toString()} isBlocked={u.isBlocked} role={u.role} /> },
  ];

  return (
    <DashboardShell title="User Manager" subtitle={`${users.length} registered users`}>
      <DataTable columns={columns} data={users as any} emptyMessage="No users yet." />
    </DashboardShell>
  );
}
