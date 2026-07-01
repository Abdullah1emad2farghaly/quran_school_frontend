import React from "react";
import { MoreVertical } from "lucide-react";
import { TableSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import { useI18n } from "../../../i18n/I18nContext";

/**
 * columns: [{ key, label, render?: (row) => node, className? }]
 * rows: array of data objects (already paginated by caller)
 */
export default function DataTable({
  columns,
  rows,
  loading,
  emptyTitle,
  emptyBody,
  emptyAction,
  onRowClick,
  pagination,
  onPageChange,
  rowKey = "id",
}) {
  const { t } = useI18n();
  const showEmpty = !loading && rows.length === 0;
  return (
    <div className="bg-paper-raised border border-line rounded-2xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-line-soft/60 border-b border-line">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase tracking-wide whitespace-nowrap ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={6} cols={columns.length} />
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-line-soft last:border-0 transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-line-soft/50" : ""
                  }`}
                >
                  {columns.map((col) => (
                    
                    <td key={col.key} className={`px-4 py-3.5 align-middle ${col.cellClassName || ""}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* {showEmpty && (
        <EmptyState title={emptyTitle || t.common.noResults} body={emptyBody || t.common.noResultsBody} actionLabel={emptyAction?.label} onAction={emptyAction?.onClick} />
      )} */}

      {!showEmpty && !loading && pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export function RowActions({ items }) {
  // items: [{ label, icon, onClick, danger?: boolean }]
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-faint hover:bg-line-soft hover:text-ink transition"
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute end-0 mt-1 w-44 bg-paper-raised border border-line rounded-xl shadow-raised py-1.5 z-20 animate-fadeIn">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-start transition ${
                item.danger ? "text-rose hover:bg-rose-soft" : "text-ink-soft hover:bg-line-soft hover:text-ink"
              }`}
            >
              {item.icon && <item.icon size={15} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
