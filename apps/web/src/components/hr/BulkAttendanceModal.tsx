import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Search,
  CheckSquare,
  Square,
  Coffee,
  Sparkles,
  Sliders,
  Filter,
  Check,
  ChevronRight
} from 'lucide-react';
import {
  ensureTableSeedRecords,
  calculateAttendanceHours,
  getCompanyAttendancePolicy,
  CompanyAttendancePolicy
} from '../../pages/modules/fkRelations';

interface BulkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttendanceSaved?: (savedCount: number) => void;
}

interface EmployeeAttendanceRow {
  employeeId: string;
  code: string;
  name: string;
  department: string;
  selected: boolean;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'WEEK_OFF_WORK';
  inTime: string;
  lunchOut: string;
  lunchIn: string;
  outTime: string;
  calculatedHours: string;
  overtimeHours: string;
  isLate: boolean;
  remarks: string;
}

export const BulkAttendanceModal: React.FC<BulkAttendanceModalProps> = ({
  isOpen,
  onClose,
  onAttendanceSaved
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [policy, setPolicy] = useState<CompanyAttendancePolicy>(getCompanyAttendancePolicy());
  const [rows, setRows] = useState<EmployeeAttendanceRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize or re-load employee attendance records for selectedDate
  useEffect(() => {
    if (!isOpen) return;

    const currentPolicy = getCompanyAttendancePolicy();
    setPolicy(currentPolicy);

    const employees = ensureTableSeedRecords('tb_employee_master');
    const rawAttn = localStorage.getItem('zuno_records_tb_attendance');
    const existingAttn: any[] = rawAttn ? JSON.parse(rawAttn) : [];

    const shiftIn = currentPolicy.shiftStartTime || '09:00';
    const shiftOut = currentPolicy.shiftEndTime || '18:00';
    const lunchOut = currentPolicy.lunchStartTime || '13:00';
    const lunchIn = currentPolicy.lunchEndTime || '14:00';

    const initializedRows: EmployeeAttendanceRow[] = employees.map((emp: any) => {
      const existing = existingAttn.find(
        (a: any) => (a.code === emp.code || a.employee_code === emp.code) && a.date === selectedDate
      );

      const inTime = existing?.in_time ?? shiftIn;
      const lOut = existing?.lunch_out ?? lunchOut;
      const lIn = existing?.lunch_in ?? lunchIn;
      const outTime = existing?.out_time ?? shiftOut;
      const status = existing?.status ?? 'PRESENT';

      const metrics = calculateAttendanceHours(
        inTime,
        outTime,
        lOut,
        lIn,
        currentPolicy.punchMode,
        0,
        false,
        currentPolicy
      );

      return {
        employeeId: emp.id || emp.code,
        code: emp.code,
        name: emp.name,
        department: emp.department || 'Operations',
        selected: false,
        status: status,
        inTime: inTime,
        lunchOut: lOut,
        lunchIn: lIn,
        outTime: outTime,
        calculatedHours: metrics.workingHoursFormatted,
        overtimeHours: metrics.overtimeHoursFormatted,
        isLate: metrics.isLate,
        remarks: existing?.description || existing?.remarks || ''
      };
    });

    setRows(initializedRows);
    setSaveSuccess(false);
  }, [isOpen, selectedDate]);

  // Recalculate metrics for a single row
  const updateRowField = (code: string, updates: Partial<EmployeeAttendanceRow>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.code !== code) return r;
        const updated = { ...r, ...updates };

        if (updated.status === 'ABSENT' || updated.status === 'ON_LEAVE') {
          updated.inTime = '';
          updated.lunchOut = '';
          updated.lunchIn = '';
          updated.outTime = '';
          updated.calculatedHours = '0h 00m';
          updated.overtimeHours = '0h 00m';
          updated.isLate = false;
        } else if (updated.inTime) {
          const metrics = calculateAttendanceHours(
            updated.inTime,
            updated.outTime,
            updated.lunchOut,
            updated.lunchIn,
            policy.punchMode,
            0,
            false,
            policy
          );
          updated.calculatedHours = metrics.workingHoursFormatted;
          updated.overtimeHours = metrics.overtimeHoursFormatted;
          updated.isLate = metrics.isLate;
        }

        return updated;
      })
    );
  };

  // Bulk actions on selected rows
  const handleSelectAll = (checked: boolean) => {
    setRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const handleBulkSetStatus = (newStatus: EmployeeAttendanceRow['status']) => {
    const shiftIn = policy.shiftStartTime || '09:00';
    const shiftOut = policy.shiftEndTime || '18:00';
    const lunchOut = policy.lunchStartTime || '13:00';
    const lunchIn = policy.lunchEndTime || '14:00';

    setRows((prev) =>
      prev.map((r) => {
        if (!r.selected) return r;
        const isPres = newStatus === 'PRESENT' || newStatus === 'HALF_DAY';
        const inT = isPres ? shiftIn : '';
        const outT = newStatus === 'HALF_DAY' ? '13:00' : isPres ? shiftOut : '';
        const lOut = newStatus === 'PRESENT' ? lunchOut : '';
        const lIn = newStatus === 'PRESENT' ? lunchIn : '';

        const metrics = calculateAttendanceHours(
          inT,
          outT,
          lOut,
          lIn,
          policy.punchMode,
          0,
          false,
          policy
        );

        return {
          ...r,
          status: newStatus,
          inTime: inT,
          lunchOut: lOut,
          lunchIn: lIn,
          outTime: outT,
          calculatedHours: metrics.workingHoursFormatted,
          overtimeHours: metrics.overtimeHoursFormatted,
          isLate: metrics.isLate
        };
      })
    );
  };

  // Save all attendance records
  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      const rawAttn = localStorage.getItem('zuno_records_tb_attendance');
      const allAttn: any[] = rawAttn ? JSON.parse(rawAttn) : [];

      // Filter out existing records for this selectedDate for all listed employees
      const employeeCodes = new Set(rows.map((r) => r.code));
      const filtered = allAttn.filter(
        (a) => !(a.date === selectedDate && employeeCodes.has(a.code || a.employee_code))
      );

      // Create new records
      const newRecords = rows.map((r) => ({
        id: `attn-${Date.now()}-${r.code}-${Math.random().toString(36).substring(2, 6)}`,
        code: r.code,
        employee_code: r.code,
        name: r.name,
        department: r.department,
        date: selectedDate,
        status: r.status,
        in_time: r.inTime,
        lunch_out: r.lunchOut,
        lunch_in: r.lunchIn,
        out_time: r.outTime,
        working_hours: r.calculatedHours,
        overtime_hours: r.overtimeHours.replace('h', '').replace('m', '').trim(),
        is_late: r.isLate,
        description: r.remarks || `Admin bulk marked ${r.status}`,
        shift: `${policy.punchMode === '4_PUNCH' ? '4-Punch' : '2-Punch'} General (${policy.shiftStartTime} - ${policy.shiftEndTime})`,
        punch_mode: policy.punchMode,
        created_time: new Date().toISOString()
      }));

      const finalRecords = [...newRecords, ...filtered];
      localStorage.setItem('zuno_records_tb_attendance', JSON.stringify(finalRecords));

      setSaveSuccess(true);
      if (onAttendanceSaved) {
        onAttendanceSaved(newRecords.length);
      }

      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (departmentFilter !== 'ALL' && r.department !== departmentFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
      }
      return true;
    });
  }, [rows, departmentFilter, searchQuery]);

  const selectedCount = rows.filter((r) => r.selected).length;
  const presentCount = rows.filter((r) => r.status === 'PRESENT').length;
  const absentCount = rows.filter((r) => r.status === 'ABSENT').length;
  const halfDayCount = rows.filter((r) => r.status === 'HALF_DAY').length;
  const leaveCount = rows.filter((r) => r.status === 'ON_LEAVE').length;

  const departments = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return Array.from(set);
  }, [rows]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-w-6xl w-full max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-900 dark:text-white my-auto space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Multi-Employee Daily Attendance Sheet
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200">
                  {policy.punchMode === '4_PUNCH' ? '4-Punch Mode' : '2-Punch Mode'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Mark, edit, and bulk-fill attendance for multiple employees at the same time for instant salary calculation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selector & Filters */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Attendance Date:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs"
            />
            <button
              type="button"
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-[11px] font-semibold cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs w-44"
              />
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectAll(selectedCount !== filteredRows.length)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer hover:bg-slate-50 text-[11px]"
            >
              {selectedCount === filteredRows.length && filteredRows.length > 0 ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Select All ({selectedCount}/{filteredRows.length})</span>
            </button>

            {selectedCount > 0 && (
              <span className="text-[11px] text-indigo-900 dark:text-indigo-200 font-medium">
                Apply to {selectedCount} selected:
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => handleBulkSetStatus('PRESENT')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-[11px] cursor-pointer shadow-xs transition-all flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Mark Present (Fill Shift)</span>
            </button>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => handleBulkSetStatus('HALF_DAY')}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-semibold text-[11px] cursor-pointer shadow-xs transition-all"
            >
              Mark Half-Day
            </button>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => handleBulkSetStatus('ABSENT')}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold text-[11px] cursor-pointer shadow-xs transition-all"
            >
              Mark Absent
            </button>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => handleBulkSetStatus('ON_LEAVE')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-[11px] cursor-pointer shadow-xs transition-all"
            >
              Mark On Leave
            </button>
          </div>
        </div>

        {/* Multi-Employee Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[52vh] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sticky top-0 z-10 select-none">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="p-2.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedCount === filteredRows.length && filteredRows.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="p-2.5 min-w-[160px]">Employee Details</th>
                <th className="p-2.5 w-32">Status</th>
                <th className="p-2.5 w-24">In Time</th>
                {policy.punchMode === '4_PUNCH' && (
                  <>
                    <th className="p-2.5 w-24">Lunch Out</th>
                    <th className="p-2.5 w-24">Lunch In</th>
                  </>
                )}
                <th className="p-2.5 w-24">Out Time</th>
                <th className="p-2.5 w-24 text-center">Hours / OT</th>
                <th className="p-2.5 min-w-[140px]">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredRows.map((row) => (
                <tr
                  key={row.code}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    row.selected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <td className="p-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={(e) => updateRowField(row.code, { selected: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer"
                    />
                  </td>

                  <td className="p-2.5 font-sans">
                    <div className="font-bold text-slate-900 dark:text-white leading-tight">
                      {row.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <span>{row.code}</span>
                      <span>&bull;</span>
                      <span>{row.department}</span>
                    </div>
                  </td>

                  <td className="p-2.5 font-sans">
                    <select
                      value={row.status}
                      onChange={(e) => updateRowField(row.code, { status: e.target.value as any })}
                      className={`w-full px-2 py-1 rounded-lg text-xs font-bold border ${
                        row.status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                          : row.status === 'ABSENT'
                          ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                          : row.status === 'HALF_DAY'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      <option value="PRESENT">PRESENT</option>
                      <option value="HALF_DAY">HALF DAY</option>
                      <option value="ABSENT">ABSENT</option>
                      <option value="ON_LEAVE">ON LEAVE</option>
                      <option value="WEEK_OFF_WORK">WEEK-OFF WORK</option>
                    </select>
                  </td>

                  <td className="p-2.5">
                    <input
                      type="time"
                      disabled={row.status === 'ABSENT' || row.status === 'ON_LEAVE'}
                      value={row.inTime}
                      onChange={(e) => updateRowField(row.code, { inTime: e.target.value })}
                      className="w-full px-1.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-center disabled:opacity-30"
                    />
                  </td>

                  {policy.punchMode === '4_PUNCH' && (
                    <>
                      <td className="p-2.5">
                        <input
                          type="time"
                          disabled={row.status !== 'PRESENT'}
                          value={row.lunchOut}
                          onChange={(e) => updateRowField(row.code, { lunchOut: e.target.value })}
                          className="w-full px-1.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-center disabled:opacity-30"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="time"
                          disabled={row.status !== 'PRESENT'}
                          value={row.lunchIn}
                          onChange={(e) => updateRowField(row.code, { lunchIn: e.target.value })}
                          className="w-full px-1.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-center disabled:opacity-30"
                        />
                      </td>
                    </>
                  )}

                  <td className="p-2.5">
                    <input
                      type="time"
                      disabled={row.status === 'ABSENT' || row.status === 'ON_LEAVE'}
                      value={row.outTime}
                      onChange={(e) => updateRowField(row.code, { outTime: e.target.value })}
                      className="w-full px-1.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-center disabled:opacity-30"
                    />
                  </td>

                  <td className="p-2.5 text-center font-sans">
                    <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">
                      {row.calculatedHours}
                    </span>
                    {row.isLate && (
                      <span className="text-[10px] text-amber-600 font-bold block">Late Mark</span>
                    )}
                  </td>

                  <td className="p-2.5 font-sans">
                    <input
                      type="text"
                      placeholder="Notes..."
                      value={row.remarks}
                      onChange={(e) => updateRowField(row.code, { remarks: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer & Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Total: <strong>{rows.length}</strong></span>
            <span className="text-emerald-600">Present: <strong>{presentCount}</strong></span>
            <span className="text-amber-600">Half-Day: <strong>{halfDayCount}</strong></span>
            <span className="text-rose-600">Absent: <strong>{absentCount}</strong></span>
            <span className="text-blue-600">Leave: <strong>{leaveCount}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Attendance saved successfully!
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving All...' : `Save All Attendance (${rows.length} Employees)`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
