import { Button } from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon = "🛕", title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-6xl mb-4 animate-float">{icon}</div>
      <h3 className="font-heading text-2xl text-foreground mb-2">{title}</h3>
      {description && <p className="text-muted-foreground max-w-sm mx-auto mb-6">{description}</p>}
      {actionLabel && actionHref && (
        <a href={actionHref}>
          <Button variant="saffron">{actionLabel}</Button>
        </a>
      )}
    </div>
  );
}
