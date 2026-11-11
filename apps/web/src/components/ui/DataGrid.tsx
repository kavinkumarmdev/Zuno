import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Download,
  Filter,
  SlidersHorizontal,
  CheckSquare,
  Square,
  RefreshCw,
  Plus,
  Trash2,
  FileSpreadsheet,
  Pencil,
  RotateCcw,
  Archive
} from 'lucide-react';
import { STATUS_BADGE_STYLES } from '@zuno/ui';

export interface ColumnDef<T = any> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataGridProps<T = any> {
  title: string;
  subtitle?: string;
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange?: (query: string) => void;
  onSortChange?: (field: string, order: 'asc' | 'desc') => void;
  onRefresh?: () => void;
  onAddNew?: () => void;
  bulkActions?: Array<{ label: string; action: (selectedIds: string[]) => void; icon?: React.ReactNode }>;
  addNewLabel?: string;
  onEdit?: (row: T) => void;
  canEdit?: boolean;
  onSoftDelete?: (row: T) => void;
  onRestore?: (row: T) => void;
  canDelete?: boolean;
  showArchived?: boolean;
  onToggleArchived?: (show: boolean) => void;
  archivedCount?: number;
}

export function DataGrid<T extends { id: string }>({
  title,
  subtitle,
  columns,
  data,
  total,
  page,
  limit,
  isLoading = false,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onSortChange,
  onRefresh,
  onAddNew,
  bulkActions,
  addNewLabel = 'Create New',
  onEdit,
  canEdit = true,
  onSoftDelete,
  onRestore,
  canDelete = true,
  showArchived = false,
  onToggleArchived,
  archivedCount = 0,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [recordToDelete, setRecordToDelete] = useState<T | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.key))
  );
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const columnPickerRef = useRef<HTMLDivElement>(null);

  // Auto-close column picker on outside click / tap / scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (columnPickerRef.current && !columnPickerRef.current.contains(event.target as Node)) {
        setShowColumnPicker(false);
      }
    };
    if (showColumnPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showColumnPicker]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSort = (field: string) => {
    const nextOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(nextOrder);
    onSortChange?.(field, nextOrder);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    const activeCols = columns.filter((c) => visibleColumns.has(c.key));
    const headerRow = activeCols.map((c) => `"${c.header}"`).join(',');
    const bodyRows = data.map((row: any) =>
      activeCols
        .map((c) => {
          const val = row[c.key];
          return `"${val !== undefined && val !== null ? String(val).replace(/"/g, '""') : ''}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...bodyRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedColumns = columns.filter((c) => visibleColumns.has(c.key));

  return (
    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/40 dark:bg-slate-950/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
              {total} Records
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-auto sm:min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in grid..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 shadow-2xs"
            />
          </div>

          {/* Column Visibility Toggle */}
          <div className="relative" ref={columnPickerRef}>
            <button
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 px-3 cursor-pointer shadow-2xs"
              title="Select columns"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
            {showColumnPicker && (
              <>
                <div
                  className="fixed inset-0 z-30 bg-transparent"
                  onClick={() => setShowColumnPicker(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 py-1">Toggle Columns</p>
                  {columns.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors font-medium">
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(c.key)}
                        onChange={(e) => {
                          const next = new Set(visibleColumns);
                          if (e.target.checked) next.add(c.key);
                          else if (next.size > 1) next.delete(c.key);
                          setVisibleColumns(next);
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                      />
                      <span className="text-slate-700 dark:text-slate-300 truncate">{c.header}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 px-3 cursor-pointer shadow-2xs"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Toggle Archived / Soft-Deleted Records */}
          {onToggleArchived && (
            <button
              onClick={() => onToggleArchived(!showArchived)}
              className={`p-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 px-3 transition-all cursor-pointer shadow-2xs ${
                showArchived
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle archived/soft-deleted records"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{showArchived ? 'Active Records' : `Archived (${archivedCount})`}</span>
            </button>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Refresh dataset"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Add New Button */}
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{addNewLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Row Banner */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/40 px-4 py-2 border-b border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300">
          <span>{selectedIds.size} row(s) selected</span>
          <div className="flex items-center gap-2">
            {bulkActions?.map((b, i) => (
              <button
                key={i}
                onClick={() => b.action(Array.from(selectedIds))}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded font-medium hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center gap-1"
              >
                {b.icon}
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-950/70 border-b border-slate-200/90 dark:border-slate-800 text-[11px] font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <th className="p-3 w-10 text-center">
                <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                  {selectedIds.size === data.length && data.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {displayedColumns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3 select-none ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800' : ''}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown className={`w-3 h-3 ${sortField === col.key ? 'text-blue-600' : 'text-slate-300'}`} />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onSoftDelete) && (canEdit !== false || canDelete !== false) && (
                <th className="p-3 w-32 text-center select-none text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, r) => (
                <tr key={r} className="animate-pulse">
                  <td className="p-3 text-center"><div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded mx-auto" /></td>
                  {displayedColumns.map((_, c) => (
                    <td key={c} className="p-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    </td>
                  ))}
                  {(onEdit || onSoftDelete) && (canEdit !== false || canDelete !== false) && (
                    <td className="p-3 text-center">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mx-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={displayedColumns.length + 1 + ((onEdit || onSoftDelete) && (canEdit !== false || canDelete !== false) ? 1 : 0)} className="p-12 text-center text-slate-400 dark:text-slate-500">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="font-medium text-sm">No records found</p>
                  <p className="text-xs mt-1">Try adjusting your filters or create a new entry.</p>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button onClick={() => toggleSelectRow(row.id)} className="text-slate-400 hover:text-slate-600">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    {displayedColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`p-3 text-slate-700 dark:text-slate-300 ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.render ? (
                          col.render(row)
                        ) : col.key === 'status' ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border shadow-2xs ${
                              String((row as any).status).toUpperCase() === 'ACTIVE'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                : String((row as any).status).toUpperCase() === 'PENDING'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                : String((row as any).status).toUpperCase() === 'ARCHIVED' || (row as any).is_deleted
                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              String((row as any).status).toUpperCase() === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' :
                              String((row as any).status).toUpperCase() === 'PENDING' ? 'bg-amber-500' :
                              String((row as any).status).toUpperCase() === 'ARCHIVED' ? 'bg-rose-500' : 'bg-blue-500'
                            }`} />
                            <span>{(row as any).status || 'ACTIVE'}</span>
                          </span>
                        ) : (
                          (row as any)[col.key] ?? '-'
                        )}
                      </td>
                    ))}
                    {(onEdit || onSoftDelete) && (canEdit !== false || canDelete !== false) && (
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {(row as any).is_deleted || (row as any).status === 'ARCHIVED' ? (
                            onRestore && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRestore(row);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                title="Restore Archived Record"
                              >
                                <RotateCcw className="w-3 h-3 shrink-0" />
                                <span>Restore</span>
                              </button>
                            )
                          ) : (
                            <>
                              {onEdit && canEdit !== false && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(row);
                                  }}
                                  className="px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200/80 dark:border-blue-800 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                  title="Edit Record"
                                >
                                  <Pencil className="w-3 h-3 shrink-0" />
                                  <span>Edit</span>
                                </button>
                              )}
                              {onSoftDelete && canDelete !== false && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRecordToDelete(row);
                                  }}
                                  className="px-2 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200/80 dark:border-rose-800 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                  title="Soft Delete Record"
                                >
                                  <Trash2 className="w-3 h-3 shrink-0" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:px-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="hidden xs:inline">Rows:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <span className="text-[11px] font-mono">
            Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} entries
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2.5 py-1 font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            {page} / {totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Soft Delete Confirmation Modal */}
      {recordToDelete && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setRecordToDelete(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Soft Delete Record
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to soft delete record <strong className="text-slate-800 dark:text-slate-200">{(recordToDelete as any).name || (recordToDelete as any).code || 'this entry'}</strong>?
                </p>
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Archive className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Record will be hidden from active lists and marked as <strong>ARCHIVED</strong>, preserving database history and audit compliance.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSoftDelete && recordToDelete) {
                    onSoftDelete(recordToDelete);
                  }
                  setRecordToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Soft Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

