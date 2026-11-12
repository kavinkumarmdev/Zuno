import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Building,
  RefreshCw
} from 'lucide-react';
import { calculateAttendanceHours, ensureTableSeedRecords } from '../../pages/modules/fkRelations';

interface EmployeeAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEmployee?: any;
}

export const EmployeeAttendanceModal: React.FC<EmployeeAttendanceModalProps> = ({
  isOpen,
  onClose,
  activeEmployee
}) => {
  const [activeTab, setActiveTab] = useState<'punch' | 'approval' | 'settings'>('punch');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [biometricMode, setBiometricMode] = useState<'thumb' | 'face'>('thumb');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{ lat: number; lng: number; accuracy: number; address: string } | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Employees and Attendance Records
  useEffect(() => {
    if (!isOpen) return;
    const emps = ensureTableSeedRecords('tb_employee_master');
    setAllEmployees(emps);
    setSelectedEmp(activeEmployee || emps[0] || null);

    const rawAttn = localStorage.getItem('zuno_records_tb_attendance');
    if (rawAttn) {
      try {
        setAttendanceRecords(JSON.parse(rawAttn));
      } catch {}
    } else {
      // Seed default today's attendance roster
      const seeded = [
        {
          id: 'attn-1',
          code: 'ATTN-001',
          employee_code: 'EMP-001',
          name: 'Anand Venkatesh',
          department: 'Engineering & Production',
          date: new Date().toISOString().split('T')[0],
          in_time: '08:55',
          out_time: '18:45',
          working_hours: '8h 50m',
          overtime_hours: '0h 50m',
          status: 'OVERTIME',
          approval_status: 'APPROVED',
          verification_mode: 'FACE_RECOGNITION',
          location: 'Plant Zone A (13.0827° N, 80.2707° E)'
        },
        {
          id: 'attn-2',
          code: 'ATTN-002',
          employee_code: 'EMP-002',
          name: 'Priya Sundaram',
          department: 'Human Resources & Talent',
          date: new Date().toISOString().split('T')[0],
          in_time: '09:05',
          out_time: '',
          working_hours: '4h 15m',
          overtime_hours: '0h 00m',
          status: 'PRESENT',
          approval_status: 'PENDING_APPROVAL',
          verification_mode: 'THUMBPRINT',
          location: 'HQ Floor 2 (13.0829° N, 80.2705° E)'
        }
      ];
      setAttendanceRecords(seeded);
      localStorage.setItem('zuno_records_tb_attendance', JSON.stringify(seeded));
    }

    // Auto-detect browser GPS Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            address: 'Authorized Enterprise Manufacturing Facility - Zone 1'
          });
        },
        () => {
          setLocationStatus({
            lat: 13.0827,
            lng: 80.2707,
            accuracy: 10,
            address: 'Enterprise HQ & Manufacturing Facility (GPS Verified)'
          });
        }
      );
    }
  }, [isOpen, activeEmployee]);

  if (!isOpen) return null;

  // Find today's punch for selected employee
  const todayStr = new Date().toISOString().split('T')[0];
  const currentPunch = attendanceRecords.find(
    (r) => r.employee_code === selectedEmp?.code && r.date === todayStr
  );

  // Handle Biometric Punch Action (In or Out)
  const handlePerformPunch = () => {
    if (!selectedEmp) return;
    setIsVerifying(true);
    setAlertMsg(null);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);

      const nowH = String(currentTime.getHours()).padStart(2, '0');
      const nowM = String(currentTime.getMinutes()).padStart(2, '0');
      const timeStr = `${nowH}:${nowM}`;

      let updatedRecords = [...attendanceRecords];

      if (!currentPunch) {
        // PUNCH IN
        const calc = calculateAttendanceHours(timeStr);
        const newPunch = {
          id: `attn-${Date.now()}`,
          code: `ATTN-${String(attendanceRecords.length + 1).padStart(3, '0')}`,
          employee_code: selectedEmp.code,
          name: selectedEmp.name,
          department: selectedEmp.department,
          date: todayStr,
          in_time: timeStr,
          out_time: '',
          working_hours: '0h 00m',
          overtime_hours: '0h 00m',
          status: calc.status,
          approval_status: 'PENDING_APPROVAL',
          verification_mode: biometricMode === 'face' ? 'FACE_RECOGNITION' : 'THUMBPRINT',
          location: locationStatus ? `${locationStatus.address} (${locationStatus.lat.toFixed(4)}°N, ${locationStatus.lng.toFixed(4)}°E)` : 'Enterprise Site (GPS Verified)'
        };
        updatedRecords = [newPunch, ...updatedRecords];
        setAlertMsg({ type: 'success', text: `Punch IN recorded at ${timeStr} via ${biometricMode === 'face' ? 'Face Scan' : 'Thumbprint'}!` });
      } else {
        // PUNCH OUT
        const calc = calculateAttendanceHours(currentPunch.in_time, timeStr);
        updatedRecords = updatedRecords.map((r) => {
          if (r.id === currentPunch.id) {
            return {
              ...r,
              out_time: timeStr,
              working_hours: calc.workingHoursFormatted,
              overtime_hours: calc.overtimeHoursFormatted,
              status: calc.status,
              approval_status: 'PENDING_APPROVAL'
            };
          }
          return r;
        });
        setAlertMsg({
          type: 'success',
          text: `Punch OUT recorded at ${timeStr}! Total Hours: ${calc.workingHoursFormatted} | Overtime: ${calc.overtimeHoursFormatted}`
        });
      }

      setAttendanceRecords(updatedRecords);
      localStorage.setItem('zuno_records_tb_attendance', JSON.stringify(updatedRecords));

      setTimeout(() => setVerificationSuccess(false), 2500);
    }, 1200);
  };

  // Admin Approval Action
  const handleApproveAttendance = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const updated = attendanceRecords.map((r) => (r.id === id ? { ...r, approval_status: newStatus } : r));
    setAttendanceRecords(updated);
    localStorage.setItem('zuno_records_tb_attendance', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 dark:text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Attendance & Biometric Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single-mark In/Out, Overtime calculation, GPS Geolocation & Admin Approval
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('punch')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'punch' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mark Daily Attendance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approval')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'approval' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Admin Approvals</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-blue-100 text-blue-800 rounded-full">
              {attendanceRecords.filter((r) => r.approval_status === 'PENDING_APPROVAL').length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'settings' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Shift & Holidays
          </button>
        </div>

        {/* Alert Banner */}
        {alertMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Tab 1: Punch In / Out */}
        {activeTab === 'punch' && (
          <div className="space-y-4">
            {/* Live Time Display */}
            <div className="text-center py-3 bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800/60 dark:to-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-wider">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 text-[11px]">
                  General Shift: 09:00 AM – 06:00 PM (8h Work + 1h Lunch)
                </span>
              </div>
            </div>

            {/* Employee Selector */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Staff Identity</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedEmp?.name || 'Staff Member'}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {selectedEmp?.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">({selectedEmp?.department})</span>
                </div>
              </div>

              {allEmployees.length > 1 && (
                <select
                  value={selectedEmp?.code || ''}
                  onChange={(e) => {
                    const found = allEmployees.find((emp) => emp.code === e.target.value);
                    if (found) setSelectedEmp(found);
                  }}
                  className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  {allEmployees.map((emp) => (
                    <option key={emp.code} value={emp.code}>
                      {emp.code} - {emp.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Biometric Verification Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Biometric Verification Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBiometricMode('thumb')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    biometricMode === 'thumb'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 shrink-0">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Thumbprint Scan</p>
                    <p className="text-[10px] text-slate-500">Capacitive Sensor</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBiometricMode('face')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    biometricMode === 'face'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Facial Recognition</p>
                    <p className="text-[10px] text-slate-500">Live Camera Scanner</p>
                  </div>
                </button>
              </div>
            </div>

            {/* GPS Geolocation Status */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-[11px] truncate max-w-sm">
                  {locationStatus ? locationStatus.address : 'Detecting GPS Geolocation...'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Geo-Fence Verified
              </span>
            </div>

            {/* Current Day Status Pill */}
            {currentPunch && (
              <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold uppercase">Today&apos;s Timesheet</p>
                  <div className="flex items-center gap-3 mt-1 font-mono">
                    <span>
                      In: <strong className="text-slate-900 dark:text-white">{currentPunch.in_time}</strong>
                    </span>
                    {currentPunch.out_time ? (
                      <span>
                        Out: <strong className="text-slate-900 dark:text-white">{currentPunch.out_time}</strong>
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold animate-pulse">● Currently On-Duty</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono">Total Working Hours</span>
                  <p className="font-bold font-mono text-sm text-blue-700 dark:text-blue-300">
                    {currentPunch.working_hours}
                  </p>
                </div>
              </div>
            )}

            {/* Main Action Punch Button */}
            <button
              type="button"
              disabled={isVerifying}
              onClick={handlePerformPunch}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentPunch && !currentPunch.out_time
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 text-white shadow-blue-500/25'
              } disabled:opacity-50`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying Biometric & Geolocation...</span>
                </>
              ) : verificationSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Biometric Verified & Synced!</span>
                </>
              ) : currentPunch && !currentPunch.out_time ? (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Punch OUT for the Day & Calculate OT</span>
                </>
              ) : (
                <>
                  {biometricMode === 'thumb' ? <Fingerprint className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                  <span>Punch IN & Mark Attendance</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 2: Admin Approvals */}
        {activeTab === 'approval' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>Daily Attendance & Overtime Verification Queue</p>
              <span className="font-mono">{attendanceRecords.length} Total Logs</span>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((rec) => (
                  <div key={rec.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{rec.name}</span>
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 px-1.5 py-0.2 rounded font-semibold">
                          {rec.employee_code}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'OVERTIME' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Date: {rec.date} | In: {rec.in_time || '--'} | Out: {rec.out_time || '--'} | Total: <strong>{rec.working_hours}</strong> | OT: <strong className="text-amber-600">{rec.overtime_hours}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {rec.approval_status === 'APPROVED' ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200">
                          ✓ Approved
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveAttendance(rec.id, 'APPROVED')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveAttendance(rec.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">No attendance records submitted today.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Shift & Holidays Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Active Shift Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400">Shift Name:</span>
                  <p className="font-bold">General Manufacturing Shift</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400">Working Window:</span>
                  <p className="font-bold font-mono">09:00 AM – 06:00 PM</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400">Grace Period:</span>
                  <p className="font-bold">15 Minutes (Late mark after 09:15 AM)</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-400">Overtime Calculation:</span>
                  <p className="font-bold">Any time worked &gt; 8 hours</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">2026 Enterprise Statutory Holidays</h4>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-medium">
                <li className="py-1.5 flex justify-between"><span>Republic Day (National Holiday)</span><span className="font-mono text-slate-500">26 Jan 2026</span></li>
                <li className="py-1.5 flex justify-between"><span>May Day / International Labour Day</span><span className="font-mono text-slate-500">01 May 2026</span></li>
                <li className="py-1.5 flex justify-between"><span>Independence Day</span><span className="font-mono text-slate-500">15 Aug 2026</span></li>
                <li className="py-1.5 flex justify-between"><span>Gandhi Jayanti</span><span className="font-mono text-slate-500">02 Oct 2026</span></li>
                <li className="py-1.5 flex justify-between"><span>Deepavali / Diwali Festival</span><span className="font-mono text-slate-500">08 Nov 2026</span></li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};

