import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  Clock,
  Coffee,
  CalendarCheck,
  ShieldAlert,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  Banknote
} from 'lucide-react';
import {
  CompanyAttendancePolicy,
  getCompanyAttendancePolicy,
  saveCompanyAttendancePolicy,
  WEEK_OFF_POLICIES,
  WeekOffPolicy
} from '../../pages/modules/fkRelations';

interface CompanyAttendanceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPolicySaved?: (policy: CompanyAttendancePolicy) => void;
}

export const CompanyAttendanceConfigModal: React.FC<CompanyAttendanceConfigModalProps> = ({
  isOpen,
  onClose,
  onPolicySaved
}) => {
  const [policy, setPolicy] = useState<CompanyAttendancePolicy>(getCompanyAttendancePolicy());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'shift' | 'lunch' | 'permission' | 'leave' | 'salary'>('shift');

  useEffect(() => {
    if (isOpen) {
      setPolicy(getCompanyAttendancePolicy());
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveCompanyAttendancePolicy(policy);
    setSaveSuccess(true);
    if (onPolicySaved) {
      onPolicySaved(updated);
    }
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-w-3xl w-full max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-900 dark:text-white my-auto space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Company Attendance, Shift & Policy Configuration
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                  Global Policy
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Configure punch mode, shift from-to timings, lunch breaks, permission limits, and leave rules once for automatic employee salary calculation.
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('shift')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'shift'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Shift &amp; Punches (2 vs 4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lunch')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'lunch'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Lunch &amp; Breaks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permission')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'permission'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Permission Rules (Weekly/Monthly)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leave')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'leave'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Leaves &amp; Week-Offs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('salary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'salary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Salary Calculation Link</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* TAB 1: SHIFT & PUNCHES */}
          {activeTab === 'shift' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200 mb-1">
                  1. Shift Punch Mode (4-Punch vs 2-Punch)
                </h4>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 mb-3">
                  Choose how your company marks employee biometric attendance throughout the day.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPolicy((p) => ({ ...p, punchMode: '4_PUNCH' }))}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      policy.punchMode === '4_PUNCH'
                        ? 'bg-white dark:bg-slate-800 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Mode A: 4-Punch Mode</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 font-semibold text-blue-700 dark:text-blue-300">
                        Factory &amp; Precision
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>Check-In &rarr; Lunch Out &rarr; Lunch In &rarr; Check-Out</strong>. Accurately tracks exact meal breaks and shift hours.
                    </p>
                  </div>

                  <div
                    onClick={() => setPolicy((p) => ({ ...p, punchMode: '2_PUNCH' }))}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      policy.punchMode === '2_PUNCH'
                        ? 'bg-white dark:bg-slate-800 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Mode B: 2-Punch Mode</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 font-semibold text-emerald-700 dark:text-emerald-300">
                        Corporate Standard
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>Check-In &rarr; Check-Out</strong>. Automatically deducts the standard 1-hour lunch break when total elapsed time exceeds 5 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shift Timings: From & To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Shift Start Time (From) <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={policy.shiftStartTime}
                    onChange={(e) => setPolicy({ ...policy, shiftStartTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default start time for morning attendance</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Shift End Time (To) <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={policy.shiftEndTime}
                    onChange={(e) => setPolicy({ ...policy, shiftEndTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Scheduled end time of regular working hours</p>
                </div>
              </div>

              {/* Grace & Overtime Thresholds */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grace Period (Minutes)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={policy.graceMinutes}
                    onChange={(e) => setPolicy({ ...policy, graceMinutes: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Allowed tolerance before late mark</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Half-Day Minimum (Minutes)
                  </label>
                  <input
                    type="number"
                    min={120}
                    max={360}
                    value={policy.halfDayMinimumMinutes}
                    onChange={(e) => setPolicy({ ...policy, halfDayMinimumMinutes: parseInt(e.target.value, 10) || 240 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Below this marks as Half Day (e.g. 240m = 4h)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Overtime Starts After (Minutes)
                  </label>
                  <input
                    type="number"
                    min={360}
                    max={600}
                    value={policy.overtimeThresholdMinutes}
                    onChange={(e) => setPolicy({ ...policy, overtimeThresholdMinutes: parseInt(e.target.value, 10) || 480 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Worked time beyond this qualifies for 2x OT</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LUNCH & BREAKS */}
          {activeTab === 'lunch' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                  2. Lunch &amp; Meal Break Timings
                </h4>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Define official meal breaks and auto-deduction behavior for salary calculation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lunch Break Start Time (From)
                  </label>
                  <input
                    type="time"
                    required
                    value={policy.lunchStartTime}
                    onChange={(e) => setPolicy({ ...policy, lunchStartTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Typical factory/office meal start (e.g. 13:00 / 01:00 PM)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lunch Break End Time (To)
                  </label>
                  <input
                    type="time"
                    required
                    value={policy.lunchEndTime}
                    onChange={(e) => setPolicy({ ...policy, lunchEndTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Typical meal end time (e.g. 14:00 / 02:00 PM)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Standard Meal Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={120}
                    value={policy.lunchDurationMinutes}
                    onChange={(e) => setPolicy({ ...policy, lunchDurationMinutes: parseInt(e.target.value, 10) || 60 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Normally 60 minutes under Indian industrial rules</p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="autoDeductLunch"
                    checked={policy.autoDeductLunchIn2Punch}
                    onChange={(e) => setPolicy({ ...policy, autoDeductLunchIn2Punch: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="autoDeductLunch" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer leading-tight">
                    <span className="font-semibold block">Auto-Deduct Lunch in 2-Punch Mode</span>
                    <span className="text-[11px] text-slate-500">Automatically subtract meal duration when daily shift &gt; 5 hours</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSION MULTI-OPTIONS */}
          {activeTab === 'permission' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40">
                <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200 mb-1">
                  3. Permission Configuration (Multi-Option, Daily Duration &amp; Limits)
                </h4>
                <p className="text-[11px] text-purple-800 dark:text-purple-300">
                  Allow short official or personal permissions without late mark penalties. Configure weekly and monthly quotas.
                </p>
              </div>

              {/* Permission Quotas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allowed Duration per Permission
                  </label>
                  <select
                    value={policy.permissionAllowedHours}
                    onChange={(e) => setPolicy({ ...policy, permissionAllowedHours: parseInt(e.target.value, 10) as 1 | 2 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value={1}>1 Hour per Permission</option>
                    <option value={2}>2 Hours per Permission</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">Grace waiver duration granted per request</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Allowed per Month
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={policy.maxPermissionsPerMonth}
                    onChange={(e) => setPolicy({ ...policy, maxPermissionsPerMonth: parseInt(e.target.value, 10) || 2 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">E.g. 2 times per calendar month</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Allowed per Week
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={policy.maxPermissionsPerWeek}
                    onChange={(e) => setPolicy({ ...policy, maxPermissionsPerWeek: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">E.g. 1 time per working week</p>
                </div>
              </div>

              {/* Supported Multi-Option Permission Types */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Active Permission Types
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Morning Late Arrival</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Allows up to 2h morning arrival without late mark</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Evening Early Departure</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Allows leaving up to 2h early before shift end</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Mid-Day Emergency</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Permits stepping out for personal / urgent matters</span>
                  </div>
                </div>
              </div>

              {/* Penalty for Exceeding Limits */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Salary Penalty if Permissions Exceed Limit
                </label>
                <select
                  value={policy.excessPermissionAction}
                  onChange={(e) => setPolicy({ ...policy, excessPermissionAction: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="HALF_DAY_LOP">Mark as Half-Day Loss of Pay (0.5 LOP Day)</option>
                  <option value="HOURLY_DEDUCTION">Deduct exact hourly pay for excess hours</option>
                  <option value="NONE">No automatic salary cut (Manual HR decision)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  When employee takes permissions beyond the monthly/weekly quota, this rule applies in salary calculation.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVES & WEEK-OFFS */}
          {activeTab === 'leave' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  4. Leave Quotas &amp; Weekend Off Policy
                </h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Configure company annual leave quotas, weekly rest days, and late mark penalties.
                </p>
              </div>

              {/* Leave Quotas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Casual Leave (CL) / Year
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={policy.casualLeavePerYear}
                    onChange={(e) => setPolicy({ ...policy, casualLeavePerYear: parseInt(e.target.value, 10) || 12 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">E.g. 12 days (1 day credited/month)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sick Leave (SL) / Year
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={policy.sickLeavePerYear}
                    onChange={(e) => setPolicy({ ...policy, sickLeavePerYear: parseInt(e.target.value, 10) || 12 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Medical leave allowance</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Earned Leave (EL/PL) / Year
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={policy.earnedLeavePerYear}
                    onChange={(e) => setPolicy({ ...policy, earnedLeavePerYear: parseInt(e.target.value, 10) || 15 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Statutory privilege leave under Factories Act</p>
                </div>
              </div>

              {/* Week-Off Policy */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Weekly Off Policy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WEEK_OFF_POLICIES.map((pol) => (
                    <div
                      key={pol.id}
                      onClick={() => setPolicy({ ...policy, weekOffPolicy: pol.id })}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        policy.weekOffPolicy === pol.id
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">{pol.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{pol.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Late Marks Penalty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Late Marks Count for Half-Day LOP
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={policy.lateMarksForHalfDayLop}
                    onChange={(e) => setPolicy({ ...policy, lateMarksForHalfDayLop: parseInt(e.target.value, 10) || 3 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Standard: 3 late marks = 0.5 Day Loss of Pay</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paid Festival Holidays / Year
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={25}
                    value={policy.paidHolidaysPerYear}
                    onChange={(e) => setPolicy({ ...policy, paidHolidaysPerYear: parseInt(e.target.value, 10) || 10 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Gazetted &amp; statutory festival holidays</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SALARY CALCULATION LINK */}
          {activeTab === 'salary' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                  5. Automated Salary Calculation Formula
                </h4>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                  How attendance records and policy settings directly determine monthly salary slips.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Payable Working Days:</strong>
                    <p className="text-[11px] text-slate-500">
                      Total Month Days &minus; [Unapproved Absences + (Late Marks / {policy.lateMarksForHalfDayLop} &times; 0.5) + Excess Permission LOP Days]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Earned Gross Earnings:</strong>
                    <p className="text-[11px] text-slate-500">
                      (Monthly Gross &times; Payable Days / Month Days) + [Overtime Hours &times; 2x Hourly Rate]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Statutory Deductions:</strong>
                    <p className="text-[11px] text-slate-500">
                      Provident Fund (12% of Basic) + ESI (0.75% of Gross if Gross &le; ₹21,000) + Professional Tax (₹200) + TDS
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Salary Calculation Basis
                </label>
                <select
                  value={policy.salaryCalculationBasis}
                  onChange={(e) => setPolicy({ ...policy, salaryCalculationBasis: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="CALENDAR_DAYS">Actual Calendar Days (e.g. 30 in Nov, 31 in Dec)</option>
                  <option value="FIXED_26_DAYS">Fixed 26 Industrial Working Days / Month</option>
                  <option value="WORKING_DAYS">Actual Working Days (Calendar Days minus Week-Offs)</option>
                </select>
              </div>
            </div>
          )}

          {/* Alert / Notice */}
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-2xl flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              <strong>Company-Wide Rule:</strong> This policy is saved once at the company level and applies immediately across all employee punch records, biometric sync, and salary slips.
            </span>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Policy saved &amp; applied to all employees!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Policy</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
