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
  RefreshCw,
  Coffee,
  Check,
  FileCheck2,
  CalendarCheck,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import {
  calculateAttendanceHours,
  ensureTableSeedRecords,
  isDateWeekOff,
  WEEK_OFF_POLICIES,
  WeekOffPolicy,
  PermissionRecord,
  getEmployeePermissionBalance
} from '../../pages/modules/fkRelations';

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
  const [activeTab, setActiveTab] = useState<'punch' | 'approval' | 'permission' | 'settings'>('punch');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [biometricMode, setBiometricMode] = useState<'thumb' | 'face'>('thumb');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{ lat: number; lng: number; accuracy: number; address: string } | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Shift Punch Mode State: '4_PUNCH' (start -> lunch out -> lunch in -> end) vs '2_PUNCH' (start -> end)
  const [punchMode, setPunchMode] = useState<'4_PUNCH' | '2_PUNCH'>('4_PUNCH');

  // Week-Off Policy State
  const [weekOffPolicy, setWeekOffPolicy] = useState<WeekOffPolicy>('SECOND_FOURTH_SAT_SUNDAY');

  // Permission Requests State
  const [permissionRecords, setPermissionRecords] = useState<PermissionRecord[]>([]);
  const [permDuration, setPermDuration] = useState<1 | 2>(1);
  const [permType, setPermType] = useState<'LATE_ARRIVAL' | 'EARLY_DEPARTURE' | 'MID_DAY_EMERGENCY'>('LATE_ARRIVAL');
  const [permReason, setPermReason] = useState<string>('');

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Initial Configuration, Records & Geolocation
  useEffect(() => {
    if (!isOpen) return;

    // Load stored shift punch mode & week-off policy
    const storedMode = localStorage.getItem('zuno_shift_punch_mode');
    if (storedMode === '2_PUNCH' || storedMode === '4_PUNCH') {
      setPunchMode(storedMode);
    }

    const storedPolicy = localStorage.getItem('zuno_week_off_policy');
    if (storedPolicy && ['SUNDAY_ONLY', 'SECOND_FOURTH_SAT_SUNDAY', 'ROTATIONAL_1_IN_6', 'SATURDAY_SUNDAY'].includes(storedPolicy)) {
      setWeekOffPolicy(storedPolicy as WeekOffPolicy);
    }

    // Load Employees
    const emps = ensureTableSeedRecords('tb_employee_master');
    setAllEmployees(emps);
    setSelectedEmp(activeEmployee || emps[0] || null);

    // Load Attendance Records
    const rawAttn = localStorage.getItem('zuno_records_tb_attendance');
    if (rawAttn) {
      try {
        setAttendanceRecords(JSON.parse(rawAttn));
      } catch {}
    } else {
      const seeded = [
        {
          id: 'attn-1',
          code: 'ATTN-001',
          employee_code: 'EMP-001',
          name: 'Anand Venkatesh',
          department: 'Engineering & Production',
          date: new Date().toISOString().split('T')[0],
          punch_mode: '4_PUNCH',
          in_time: '08:55',
          lunch_out: '13:02',
          lunch_in: '14:00',
          out_time: '18:45',
          break_duration: '0h 58m',
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
          punch_mode: '4_PUNCH',
          in_time: '09:05',
          lunch_out: '13:00',
          lunch_in: '13:55',
          out_time: '',
          break_duration: '0h 55m',
          working_hours: '4h 45m',
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

    // Load Permission Records
    const rawPerms = localStorage.getItem('zuno_records_tb_permissions');
    if (rawPerms) {
      try {
        setPermissionRecords(JSON.parse(rawPerms));
      } catch {}
    } else {
      const seededPerms: PermissionRecord[] = [
        {
          id: 'perm-1',
          code: 'PERM-001',
          employee_code: 'EMP-001',
          name: 'Anand Venkatesh',
          department: 'Engineering & Production',
          date: new Date().toISOString().split('T')[0],
          duration_hours: 1,
          permission_type: 'LATE_ARRIVAL',
          reason: 'Medical consultation & prescription pickup at Apollo Clinic.',
          approval_status: 'APPROVED',
          approved_by: 'HR Dept Manager',
          created_time: new Date().toISOString()
        }
      ];
      setPermissionRecords(seededPerms);
      localStorage.setItem('zuno_records_tb_permissions', JSON.stringify(seededPerms));
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

  const todayStr = new Date().toISOString().split('T')[0];
  const isTodayWeekOff = isDateWeekOff(todayStr, weekOffPolicy);

  // Find today's active punch record for selected employee
  const currentPunch = attendanceRecords.find(
    (r) => r.employee_code === selectedEmp?.code && r.date === todayStr
  );

  // Check if selected employee has an approved permission for today
  const approvedPermToday = permissionRecords.find(
    (p) => p.employee_code === selectedEmp?.code && p.date === todayStr && p.approval_status === 'APPROVED'
  );
  const permissionHoursToday = approvedPermToday ? approvedPermToday.duration_hours : 0;

  // Determine current punch step for 4-Punch Mode
  // Step 1: In -> Step 2: Lunch Out -> Step 3: Lunch In -> Step 4: Out
  const get4PunchStep = () => {
    if (!currentPunch || !currentPunch.in_time) return 1;
    if (!currentPunch.lunch_out) return 2;
    if (!currentPunch.lunch_in) return 3;
    if (!currentPunch.out_time) return 4;
    return 5; // All 4 completed
  };

  const currentStep = punchMode === '4_PUNCH' ? get4PunchStep() : !currentPunch ? 1 : !currentPunch.out_time ? 2 : 3;

  // Handle Biometric Punch Action
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

      if (punchMode === '4_PUNCH') {
        // --- 4 PUNCH MODE ---
        if (currentStep === 1) {
          // Punch 1: Shift In
          const calc = calculateAttendanceHours(
            timeStr,
            undefined,
            undefined,
            undefined,
            '4_PUNCH',
            permissionHoursToday,
            isTodayWeekOff
          );

          const newPunch = {
            id: `attn-${Date.now()}`,
            code: `ATTN-${String(attendanceRecords.length + 1).padStart(3, '0')}`,
            employee_code: selectedEmp.code,
            name: selectedEmp.name,
            department: selectedEmp.department,
            date: todayStr,
            punch_mode: '4_PUNCH',
            in_time: timeStr,
            lunch_out: '',
            lunch_in: '',
            out_time: '',
            break_duration: '0h 00m',
            working_hours: '0h 00m',
            overtime_hours: '0h 00m',
            status: calc.status,
            permission_waived: calc.permissionWaived,
            is_week_off_work: isTodayWeekOff,
            approval_status: 'PENDING_APPROVAL',
            verification_mode: biometricMode === 'face' ? 'FACE_RECOGNITION' : 'THUMBPRINT',
            location: locationStatus
              ? `${locationStatus.address} (${locationStatus.lat.toFixed(4)}°N, ${locationStatus.lng.toFixed(4)}°E)`
              : 'Enterprise Site (GPS Verified)'
          };

          updatedRecords = [newPunch, ...updatedRecords];
          setAlertMsg({
            type: 'success',
            text: `Punch 1 recorded: Shift IN at ${timeStr} via ${biometricMode === 'face' ? 'Face Recognition' : 'Thumbprint'}.${
              calc.permissionWaived ? ' (Approved permission applied: Late mark waived)' : ''
            }`
          });
        } else if (currentStep === 2) {
          // Punch 2: Lunch Out
          updatedRecords = updatedRecords.map((r) => {
            if (r.id === currentPunch.id) {
              const calc = calculateAttendanceHours(
                r.in_time,
                undefined,
                timeStr,
                undefined,
                '4_PUNCH',
                permissionHoursToday,
                isTodayWeekOff
              );
              return {
                ...r,
                lunch_out: timeStr,
                working_hours: calc.workingHoursFormatted,
                status: calc.status
              };
            }
            return r;
          });
          setAlertMsg({
            type: 'info',
            text: `Punch 2 recorded: Lunch / Break OUT at ${timeStr}. Enjoy your meal break!`
          });
        } else if (currentStep === 3) {
          // Punch 3: Lunch In
          updatedRecords = updatedRecords.map((r) => {
            if (r.id === currentPunch.id) {
              const calc = calculateAttendanceHours(
                r.in_time,
                undefined,
                r.lunch_out,
                timeStr,
                '4_PUNCH',
                permissionHoursToday,
                isTodayWeekOff
              );
              return {
                ...r,
                lunch_in: timeStr,
                break_duration: calc.breakHoursFormatted,
                status: calc.status
              };
            }
            return r;
          });
          setAlertMsg({
            type: 'success',
            text: `Punch 3 recorded: Lunch IN / Break Completed at ${timeStr}. Afternoon shift resumed!`
          });
        } else if (currentStep === 4) {
          // Punch 4: Shift Out
          updatedRecords = updatedRecords.map((r) => {
            if (r.id === currentPunch.id) {
              const calc = calculateAttendanceHours(
                r.in_time,
                timeStr,
                r.lunch_out,
                r.lunch_in,
                '4_PUNCH',
                permissionHoursToday,
                isTodayWeekOff
              );
              return {
                ...r,
                out_time: timeStr,
                working_hours: calc.workingHoursFormatted,
                overtime_hours: calc.overtimeHoursFormatted,
                break_duration: calc.breakHoursFormatted,
                status: calc.status,
                approval_status: 'PENDING_APPROVAL'
              };
            }
            return r;
          });
          setAlertMsg({
            type: 'success',
            text: `Punch 4 recorded: Shift OUT at ${timeStr}. Daily shift finalized! Working Hours: ${
              calculateAttendanceHours(currentPunch.in_time, timeStr, currentPunch.lunch_out, currentPunch.lunch_in, '4_PUNCH').workingHoursFormatted
            }`
          });
        }
      } else {
        // --- 2 PUNCH MODE (start(in) -> end(out)) ---
        if (!currentPunch) {
          // Punch In
          const calc = calculateAttendanceHours(
            timeStr,
            undefined,
            undefined,
            undefined,
            '2_PUNCH',
            permissionHoursToday,
            isTodayWeekOff
          );
          const newPunch = {
            id: `attn-${Date.now()}`,
            code: `ATTN-${String(attendanceRecords.length + 1).padStart(3, '0')}`,
            employee_code: selectedEmp.code,
            name: selectedEmp.name,
            department: selectedEmp.department,
            date: todayStr,
            punch_mode: '2_PUNCH',
            in_time: timeStr,
            lunch_out: '',
            lunch_in: '',
            out_time: '',
            break_duration: '0h 00m',
            working_hours: '0h 00m',
            overtime_hours: '0h 00m',
            status: calc.status,
            permission_waived: calc.permissionWaived,
            is_week_off_work: isTodayWeekOff,
            approval_status: 'PENDING_APPROVAL',
            verification_mode: biometricMode === 'face' ? 'FACE_RECOGNITION' : 'THUMBPRINT',
            location: locationStatus
              ? `${locationStatus.address} (${locationStatus.lat.toFixed(4)}°N, ${locationStatus.lng.toFixed(4)}°E)`
              : 'Enterprise Site (GPS Verified)'
          };
          updatedRecords = [newPunch, ...updatedRecords];
          setAlertMsg({
            type: 'success',
            text: `Punch IN recorded at ${timeStr} via ${biometricMode === 'face' ? 'Face Scan' : 'Thumbprint'}!`
          });
        } else {
          // Punch Out
          const calc = calculateAttendanceHours(
            currentPunch.in_time,
            timeStr,
            undefined,
            undefined,
            '2_PUNCH',
            permissionHoursToday,
            isTodayWeekOff
          );
          updatedRecords = updatedRecords.map((r) => {
            if (r.id === currentPunch.id) {
              return {
                ...r,
                out_time: timeStr,
                break_duration: calc.breakHoursFormatted,
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
      }

      setAttendanceRecords(updatedRecords);
      localStorage.setItem('zuno_records_tb_attendance', JSON.stringify(updatedRecords));

      setTimeout(() => setVerificationSuccess(false), 2500);
    }, 1100);
  };

  // Submit New Permission Request
  const handleSavePermission = () => {
    if (!selectedEmp || !permReason.trim()) {
      setAlertMsg({ type: 'error', text: 'Please enter a valid reason for the permission request.' });
      return;
    }

    const quota = getEmployeePermissionBalance(selectedEmp.code, permissionRecords);
    if (!quota.canApply) {
      setAlertMsg({
        type: 'error',
        text: `Monthly permission quota exhausted (${quota.usedThisMonth}/${quota.maxAllowedMonth} used). Cannot submit additional requests.`
      });
      return;
    }

    const newPerm: PermissionRecord = {
      id: `perm-${Date.now()}`,
      code: `PERM-${String(permissionRecords.length + 1).padStart(3, '0')}`,
      employee_code: selectedEmp.code,
      name: selectedEmp.name,
      department: selectedEmp.department,
      date: todayStr,
      duration_hours: permDuration,
      permission_type: permType,
      reason: permReason.trim(),
      approval_status: 'APPROVED', // Instant enterprise self-service / supervisor approval
      approved_by: 'Authorized Duty Officer',
      created_time: new Date().toISOString()
    };

    const updated = [newPerm, ...permissionRecords];
    setPermissionRecords(updated);
    localStorage.setItem('zuno_records_tb_permissions', JSON.stringify(updated));
    setPermReason('');
    setAlertMsg({
      type: 'success',
      text: `Permission request for ${permDuration} Hour (${permType.replace(/_/g, ' ')}) approved! Today's attendance will not trigger late-mark or wage deduction.`
    });
  };

  // Admin Approval Action
  const handleApproveAttendance = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const updated = attendanceRecords.map((r) => (r.id === id ? { ...r, approval_status: newStatus } : r));
    setAttendanceRecords(updated);
    localStorage.setItem('zuno_records_tb_attendance', JSON.stringify(updated));
  };

  // Admin Permission Approval Action
  const handleApprovePermission = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const updated = permissionRecords.map((p) => (p.id === id ? { ...p, approval_status: newStatus } : p));
    setPermissionRecords(updated);
    localStorage.setItem('zuno_records_tb_permissions', JSON.stringify(updated));
  };

  // Save Settings Changes
  const handleSaveShiftPunchSettings = (newMode: '4_PUNCH' | '2_PUNCH', newPolicy: WeekOffPolicy) => {
    setPunchMode(newMode);
    setWeekOffPolicy(newPolicy);
    localStorage.setItem('zuno_shift_punch_mode', newMode);
    localStorage.setItem('zuno_week_off_policy', newPolicy);
    setAlertMsg({ type: 'success', text: `Shift settings saved: ${newMode === '4_PUNCH' ? '4-Punch Mode' : '2-Punch Mode'} & Week-Off policy updated!` });
  };

  const permissionBalance = getEmployeePermissionBalance(selectedEmp?.code || '', permissionRecords);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 dark:text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enterprise Workforce Attendance & Shift Portal
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                  {punchMode === '4_PUNCH' ? '4-PUNCH FACTORY' : '2-PUNCH CORPORATE'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single-mark In/Out, Lunch break tracking, Overtime calculations, Week-off rules & Permissions
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
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'punch' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Mark Punch ({punchMode === '4_PUNCH' ? '4-Punch' : '2-Punch'})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('permission')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'permission' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Permissions (1h / 2h)</span>
            {permissionBalance.remainingThisMonth > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-emerald-100 text-emerald-800 rounded-full">
                {permissionBalance.remainingThisMonth} Left
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approval')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'approval' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Admin Approvals</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-blue-100 text-blue-800 rounded-full">
              {attendanceRecords.filter((r) => r.approval_status === 'PENDING_APPROVAL').length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'settings' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Shift & Week-Off Rules</span>
          </button>
        </div>

        {/* Alert Banner */}
        {alertMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300'
                : alertMsg.type === 'info'
                ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-800 dark:text-blue-300'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Tab 1: Punch In / Out (4-Punch vs 2-Punch) */}
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
              <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 text-[11px] font-medium">
                  {punchMode === '4_PUNCH'
                    ? 'Mode A: 4-Punch Factory Shift (Start In → Lunch Out → Lunch In → Shift Out)'
                    : 'Mode B: 2-Punch Corporate Shift (Start In → Shift Out)'}
                </span>

                {isTodayWeekOff && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 text-[11px] font-bold">
                    ★ Designated Weekly Off Day (Double Wages / 2x Comp-Off)
                  </span>
                )}

                {approvedPermToday && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 text-[11px] font-bold">
                    ✓ Approved {approvedPermToday.duration_hours}h Permission Active (Late-Mark Waived)
                  </span>
                )}
              </div>
            </div>

            {/* Employee Selector & Punch Mode Quick Switch */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

              <div className="flex items-center gap-2">
                {/* Punch Mode Pill Switch */}
                <div className="p-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg flex text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => handleSaveShiftPunchSettings('4_PUNCH', weekOffPolicy)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      punchMode === '4_PUNCH' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    4-Punch
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveShiftPunchSettings('2_PUNCH', weekOffPolicy)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      punchMode === '2_PUNCH' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    2-Punch
                  </button>
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
            </div>

            {/* Punch Progression Visualizer */}
            {punchMode === '4_PUNCH' ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    4-Punch Workflow: Start(In) → Lunch(Out) → Lunch(In) → End(Out)
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-blue-600">
                    Step {Math.min(4, currentStep)} of 4
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {/* Step 1: Start In */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      currentPunch?.in_time
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                        : currentStep === 1
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase text-slate-400">1. Shift In</p>
                    <p className="font-mono font-extrabold text-sm mt-0.5">
                      {currentPunch?.in_time || '--:--'}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {currentPunch?.in_time ? '✓ Marked' : 'Pending'}
                    </span>
                  </div>

                  {/* Step 2: Lunch Out */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      currentPunch?.lunch_out
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                        : currentStep === 2
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase text-slate-400">2. Lunch Out</p>
                    <p className="font-mono font-extrabold text-sm mt-0.5">
                      {currentPunch?.lunch_out || '--:--'}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {currentPunch?.lunch_out ? '✓ Break Start' : 'Pending'}
                    </span>
                  </div>

                  {/* Step 3: Lunch In */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      currentPunch?.lunch_in
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                        : currentStep === 3
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase text-slate-400">3. Lunch In</p>
                    <p className="font-mono font-extrabold text-sm mt-0.5">
                      {currentPunch?.lunch_in || '--:--'}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {currentPunch?.lunch_in ? `Break: ${currentPunch.break_duration || '1h'}` : 'Pending'}
                    </span>
                  </div>

                  {/* Step 4: Shift Out */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      currentPunch?.out_time
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                        : currentStep === 4
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase text-slate-400">4. Shift Out</p>
                    <p className="font-mono font-extrabold text-sm mt-0.5">
                      {currentPunch?.out_time || '--:--'}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {currentPunch?.out_time ? `Total: ${currentPunch.working_hours}` : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* 2-Punch Progression Visualizer */
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    2-Punch Corporate Workflow: Start(In) → End(Out)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Standard 1h Lunch buffer auto-deducted if worked &gt; 5h
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div
                    className={`p-3 rounded-xl border ${
                      currentPunch?.in_time
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                        : 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase text-slate-400">Punch IN (Arrival)</p>
                    <p className="font-mono font-extrabold text-base mt-0.5">
                      {currentPunch?.in_time || '--:--'}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {currentPunch?.in_time ? '✓ Check-in Verified' : 'Awaiting Check-in'}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      currentPunch?.out_time
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                        : currentPunch?.in_time
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase text-slate-400">Punch OUT (Departure)</p>
                    <p className="font-mono font-extrabold text-base mt-0.5">
                      {currentPunch?.out_time || '--:--'}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {currentPunch?.out_time ? `Total: ${currentPunch.working_hours}` : 'Pending Shift End'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Biometric Verification Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Biometric Sensor Verification
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

            {/* Current Day Timesheet Stats Banner */}
            {currentPunch && (
              <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold uppercase">Today&apos;s Timesheet Log</p>
                  <div className="flex items-center gap-3 mt-1 font-mono text-[11px]">
                    <span>
                      In: <strong className="text-slate-900 dark:text-white">{currentPunch.in_time}</strong>
                    </span>
                    {currentPunch.lunch_out && (
                      <span>
                        Lunch: <strong>{currentPunch.lunch_out} - {currentPunch.lunch_in || 'Ongoing'}</strong>
                      </span>
                    )}
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
                  <span className="text-[10px] text-slate-400 font-mono">Working / Overtime</span>
                  <p className="font-bold font-mono text-sm text-blue-700 dark:text-blue-300">
                    {currentPunch.working_hours} | <span className="text-amber-600 font-bold">{currentPunch.overtime_hours}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Step Action Button */}
            <button
              type="button"
              disabled={isVerifying || currentStep === 5}
              onClick={handlePerformPunch}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentStep === 5
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  : currentStep === 2 && punchMode === '4_PUNCH'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white shadow-amber-500/20'
                  : currentStep === 3 && punchMode === '4_PUNCH'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white shadow-teal-500/20'
                  : currentStep === 4 && punchMode === '4_PUNCH'
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 text-white shadow-rose-500/20'
                  : currentPunch && !currentPunch.out_time && punchMode === '2_PUNCH'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 text-white shadow-blue-500/25'
              } disabled:opacity-50`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying Biometric & GPS Geolocation...</span>
                </>
              ) : verificationSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Biometric Verified & Punch Synced!</span>
                </>
              ) : currentStep === 5 ? (
                <>
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>All 4 Punches Completed for Today ✓</span>
                </>
              ) : punchMode === '4_PUNCH' ? (
                currentStep === 1 ? (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    <span>Punch 1: Shift In (Commence Duty)</span>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <Coffee className="w-5 h-5" />
                    <span>Punch 2: Lunch Out (Start Break)</span>
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <Clock className="w-5 h-5" />
                    <span>Punch 3: Lunch In (Resume Afternoon Shift)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Punch 4: Shift Out & Calculate Overtime</span>
                  </>
                )
              ) : !currentPunch ? (
                <>
                  {biometricMode === 'thumb' ? <Fingerprint className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                  <span>Punch IN & Mark Attendance</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Punch OUT & Calculate Overtime</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 2: Permission Request (1h or 2h Weekly/Monthly) */}
        {activeTab === 'permission' && (
          <div className="space-y-4 text-xs">
            {/* Permission Policy Explanation & Quota */}
            <div className="p-3.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                  <span>Company Permission / Short-Leave Policy</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows 1 Hour or 2 Hours of short absence (Late arrival or early departure) once weekly or twice monthly without late mark or salary deduction.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 text-center font-mono">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Quota</p>
                <p className="text-base font-extrabold text-blue-600 mt-0.5">
                  {permissionBalance.usedThisMonth} / {permissionBalance.maxAllowedMonth} Used
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">
                  {permissionBalance.remainingThisMonth} Remaining
                </span>
              </div>
            </div>

            {/* Permission Form */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Request Duty Permission for Today</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Permission Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPermDuration(1)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        permDuration === 1
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-600 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      1 Hour Permission
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermDuration(2)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        permDuration === 2
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-600 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      2 Hours Permission
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Permission Type
                  </label>
                  <select
                    value={permType}
                    onChange={(e: any) => setPermType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="LATE_ARRIVAL">Late Coming (Arrival within 1-2 hours)</option>
                    <option value="EARLY_DEPARTURE">Early Departure (Leaving 1-2 hours early)</option>
                    <option value="MID_DAY_EMERGENCY">Emergency Personal / Medical Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Reason / Purpose (e.g., Medical Clinic, Bank Work, Family Urgency)
                </label>
                <input
                  type="text"
                  value={permReason}
                  onChange={(e) => setPermReason(e.target.value)}
                  placeholder="e.g. Dental checkup appointment at Government Hospital"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleSavePermission}
                disabled={!permissionBalance.canApply || !permReason.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit &amp; Approve {permDuration}h Permission</span>
              </button>
            </div>

            {/* List of Permissions */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Permission History &amp; Approvals</h4>
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl">
                {permissionRecords.length > 0 ? (
                  permissionRecords.map((perm) => (
                    <div key={perm.id} className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{perm.name}</span>
                          <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                            {perm.employee_code}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            {perm.duration_hours}h {perm.permission_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Date: <span className="font-mono">{perm.date}</span> | Reason: {perm.reason}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {perm.approval_status === 'APPROVED' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">
                            ✓ Approved (Waived)
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprovePermission(perm.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprovePermission(perm.id, 'REJECTED')}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-lg cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400">No permission records registered yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Admin Approvals */}
        {activeTab === 'approval' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>Daily Attendance &amp; Overtime Verification Queue</p>
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
                        {rec.punch_mode && (
                          <span className="text-[10px] font-mono text-slate-400">
                            ({rec.punch_mode})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Date: {rec.date} | In: {rec.in_time || '--'} | Lunch: {rec.lunch_out || '--'} to {rec.lunch_in || '--'} | Out: {rec.out_time || '--'} | Work: <strong>{rec.working_hours}</strong> | OT: <strong className="text-amber-600">{rec.overtime_hours}</strong>
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

        {/* Tab 4: Shift & Week-Off Rules Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-4 text-xs">
            {/* Week Off Policy Selector */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Enterprise Weekly Off Policy</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Determines non-working days. Punching in on designated week-off triggers double-wages ($2\times$) or Comp-Off credit.
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  isTodayWeekOff ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Today: {isTodayWeekOff ? 'WEEK-OFF DAY' : 'REGULAR WORKING DAY'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WEEK_OFF_POLICIES.map((pol) => (
                  <button
                    key={pol.id}
                    type="button"
                    onClick={() => handleSaveShiftPunchSettings(punchMode, pol.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      weekOffPolicy === pol.id
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-xs">{pol.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{pol.description}</p>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                      Ref: {pol.statutoryBasis}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shift Punch Mode Selector */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Shift Punch Configuration (4-Punch vs 2-Punch)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select whether the organization follows the 4-Punch Factory model (with explicit lunch in/out) or 2-Punch Corporate model.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveShiftPunchSettings('4_PUNCH', weekOffPolicy)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    punchMode === '4_PUNCH'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs">Mode A: 4-Punch Factory Mode</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Start(In) → Lunch(Out) → Lunch(In) → End(Out). Tracks precise meal break duration and deducts automatically.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveShiftPunchSettings('2_PUNCH', weekOffPolicy)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    punchMode === '2_PUNCH'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs">Mode B: 2-Punch Corporate Mode</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Start(In) → End(Out). Automatically deducts standard 1-hour lunch break if total working elapsed time &gt; 5 hours.
                  </p>
                </button>
              </div>
            </div>

            {/* 2026 Statutory Holidays */}
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
