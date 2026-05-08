import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card-bg border-l-4 border-l-saffron rounded-2xl p-6 shadow-[0_4px_20px_rgba(212,130,10,0.10)]",
        hover && "hover:shadow-[0_8px_30px_rgba(212,130,10,0.20)] transition-all duration-300 cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  accent?: string;
}

export function StatCard({ icon, label, value, accent = "border-l-saffron" }: StatCardProps) {
  return (
    <div className={cn("bg-card-bg border-l-4 rounded-2xl p-6 shadow-[0_4px_20px_rgba(212,130,10,0.10)]", accent)}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-heading text-2xl text-foreground">{value}</div>
      <div className="text-muted-foreground text-sm mt-0.5">{label}</div>
    </div>
  );
}
