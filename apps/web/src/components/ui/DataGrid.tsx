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
  FileSpreadsheet
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
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.key))
  );
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const columnPickerRef = useRef<HTMLDivElement>(null);

  // Auto-close column picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnPickerRef.current && !columnPickerRef.current.contains(event.target as Node)) {
        setShowColumnPicker(false);
      }
    };
    if (showColumnPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-auto sm:min-w-[220px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter records..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Column Visibility Toggle */}
          <div className="relative" ref={columnPickerRef}>
            <button
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm flex items-center gap-1.5 px-3"
              title="Select columns"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Columns</span>
            </button>
            {showColumnPicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 z-20">
                <p className="text-xs font-medium text-slate-500 px-2 py-1">Toggle Columns</p>
                {columns.map((c) => (
                  <label key={c.key} className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(c.key)}
                      onChange={(e) => {
                        const next = new Set(visibleColumns);
                        if (e.target.checked) next.add(c.key);
                        else if (next.size > 1) next.delete(c.key);
                        setVisibleColumns(next);
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">{c.header}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm flex items-center gap-1.5 px-3"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

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
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
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
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={displayedColumns.length + 1} className="p-12 text-center text-slate-400 dark:text-slate-500">
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
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                              STATUS_BADGE_STYLES[(row as any).status]
                                ? `${STATUS_BADGE_STYLES[(row as any).status].bg} ${STATUS_BADGE_STYLES[(row as any).status].text} ${STATUS_BADGE_STYLES[(row as any).status].border}`
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {(row as any).status}
                          </span>
                        ) : (
                          (row as any)[col.key] ?? '-'
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>
            Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} entries
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

