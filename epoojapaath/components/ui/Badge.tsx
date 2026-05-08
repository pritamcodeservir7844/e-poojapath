import { cn } from "@/lib/utils";

type BadgeVariant = "pending" | "approved" | "rejected" | "completed" | "cancelled" | "paid" | "failed" | "saffron" | "purple" | "pink" | "blue";

const styles: Record<BadgeVariant, string> = {
  pending:   "bg-yellow-100  text-yellow-800  border-yellow-300",
  approved:  "bg-green-100   text-green-800   border-green-300",
  rejected:  "bg-red-100     text-red-800     border-red-300",
  completed: "bg-blue-100    text-blue-800    border-blue-300",
  cancelled: "bg-gray-100    text-gray-600    border-gray-300",
  paid:      "bg-green-100   text-green-800   border-green-300",
  failed:    "bg-red-100     text-red-800     border-red-300",
  saffron:   "bg-saffron/10  text-saffron     border-saffron/30",
  purple:    "bg-lotus-purple/10 text-lotus-purple border-lotus-purple/30",
  pink:      "bg-lotus-pink/10   text-lotus-pink  border-lotus-pink/30",
  blue:      "bg-lotus-blue/10   text-lotus-blue  border-lotus-blue/30",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "saffron", children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center border text-xs font-semibold px-2.5 py-0.5 rounded-full", styles[variant], className)}>
      {children}
    </span>
  );
}
