import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({ columns, data, emptyMessage = "No data found" }: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="text-center text-muted-foreground py-10">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-deep-gold/20">
      <table className="w-full text-sm">
        <thead className="bg-saffron/5 border-b border-deep-gold/20">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn("px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-deep-gold/10">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-saffron/5 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3 text-muted-foreground", col.className)}>
                  {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
