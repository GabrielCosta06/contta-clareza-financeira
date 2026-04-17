import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  className?: string;
  /** Hide this column on the mobile card layout (still shown in mobile via mobileCard if used). */
  mobileHidden?: boolean;
}

interface Props<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  caption?: string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Optional custom mobile card renderer. If omitted, falls back to a column list. */
  mobileCard?: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  rows, columns, rowKey, caption, empty, onRowClick, mobileCard, className,
}: Props<T>) {
  if (rows.length === 0 && empty) return <>{empty}</>;

  return (
    <div className={cn("rounded-lg border border-border bg-card overflow-hidden", className)}>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              {columns.map(c => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "font-medium px-4 py-3",
                    c.align === "right" ? "text-right" : "text-left",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-t transition-colors",
                  onRowClick ? "cursor-pointer hover:bg-muted/30" : "hover:bg-muted/20",
                )}
              >
                {columns.map(c => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 py-3",
                      c.align === "right" ? "text-right" : "text-left",
                      c.className,
                    )}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden divide-y divide-border">
        {rows.map(row => (
          <li
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              "p-4",
              onRowClick && "cursor-pointer active:bg-muted/40",
            )}
          >
            {mobileCard ? mobileCard(row) : (
              <dl className="space-y-1.5">
                {columns.filter(c => !c.mobileHidden).map(c => (
                  <div key={c.key} className="flex items-start justify-between gap-3 text-sm">
                    <dt className="text-xs text-muted-foreground shrink-0 pt-0.5">{c.header}</dt>
                    <dd className={cn("text-foreground min-w-0", c.align === "right" ? "text-right" : "text-left")}>
                      {c.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
