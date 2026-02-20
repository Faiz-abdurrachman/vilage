import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';
import { cn } from '@/lib/utils';

function DataTable({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Cari...',
  searchValue = '',
  actions,
  toolbar,
}) {
  const colCount = columns.length + (actions ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search & Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onSearch !== undefined && (
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        )}
        {toolbar && <div className="flex items-center gap-2 flex-wrap">{toolbar}</div>}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: colCount }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className={cn('h-4 bg-slate-100 rounded-full', j === 0 ? 'w-6' : j === 1 ? 'w-28' : 'w-20')} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !data?.length ? (
                <tr>
                  <td colSpan={colCount} className="px-4 py-12">
                    <EmptyState title="Tidak ada data" description="Belum ada data yang tersedia." />
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={row.id || rowIndex}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn(
                          'px-4 py-3.5 text-slate-700 transition-all',
                          colIndex === 0 && 'border-l-[3px] border-l-transparent group-hover:border-l-blue-400',
                          col.mono && 'font-mono text-xs',
                          col.className,
                        )}
                      >
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? <span className="text-slate-300">—</span>)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (pagination.totalPages > 1 || pagination.total > 0) && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              {pagination.total > 0
                ? `Menampilkan ${Math.min(((pagination.page - 1) * pagination.limit) + 1, pagination.total)}–${Math.min(pagination.page * pagination.limit, pagination.total)} dari ${pagination.total} data`
                : 'Tidak ada data'
              }
            </p>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors',
                        pagination.page === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {page}
                    </button>
                  );
                })}

                {pagination.totalPages > 5 && (
                  <span className="px-1 text-slate-400 text-xs">...</span>
                )}

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
