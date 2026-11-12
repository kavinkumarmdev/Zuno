import {
  calculateAttendanceHours,
  isDateWeekOff,
  WEEK_OFF_POLICIES,
  getEmployeePermissionBalance,
  calculateStatutoryBonus,
  PermissionRecord
} from './apps/web/src/pages/modules/fkRelations';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`, details || '');
  }
}

console.log('================================================================');
console.log('TEST SUITE: SHIFT (4-PUNCH & 2-PUNCH), WEEK-OFF, PERMISSIONS, BONUS');
console.log('================================================================\n');

// -------------------------------------------------------------
// 1. Shift 4-Punch vs 2-Punch Calculations
// -------------------------------------------------------------
console.log('--- 1. Shift Punch Mode Calculations ---');

// 1.1: 4-Punch Standard Day (09:00 to 18:00 with 13:00 to 14:00 lunch)
// Working: (13:00-09:00 = 4h) + (18:00-14:00 = 4h) = 8h 00m, OT: 0h
const punch4Std = calculateAttendanceHours('09:00', '18:00', '13:00', '14:00', '4_PUNCH');
assert(punch4Std.workingHoursFormatted === '8h 00m', '4-Punch standard 8h day formatted correctly', punch4Std);
assert(punch4Std.breakHoursFormatted === '1h 00m', '4-Punch 1h break duration tracked', punch4Std);
assert(punch4Std.overtimeHoursFormatted === '0h 00m', '4-Punch no overtime on 8h shift', punch4Std);
assert(punch4Std.status === 'PRESENT', '4-Punch on-time status is PRESENT', punch4Std);

// 1.2: 4-Punch with Overtime (09:00 to 19:30 with 13:00 to 14:00 lunch)
// Working: 4h + 5h 30m = 9h 30m -> 1h 30m OT
const punch4Ot = calculateAttendanceHours('09:00', '19:30', '13:00', '14:00', '4_PUNCH');
assert(punch4Ot.workingHoursFormatted === '9h 30m', '4-Punch 9h 30m working time', punch4Ot);
assert(punch4Ot.overtimeHoursFormatted === '1h 30m', '4-Punch 1h 30m overtime computed', punch4Ot);
assert(punch4Ot.status === 'OVERTIME', '4-Punch status marked as OVERTIME', punch4Ot);

// 1.3: 4-Punch with 45 mins break (09:00 to 18:00 with 13:00 to 13:45 lunch)
// Working: 4h + 4h 15m = 8h 15m -> 15m OT
const punch4ShortBreak = calculateAttendanceHours('09:00', '18:00', '13:00', '13:45', '4_PUNCH');
assert(punch4ShortBreak.breakHoursFormatted === '0h 45m', '4-Punch exact 45m break tracked', punch4ShortBreak);
assert(punch4ShortBreak.workingHoursFormatted === '8h 15m', '4-Punch 8h 15m working', punch4ShortBreak);
assert(punch4ShortBreak.overtimeMinutes === 15, '4-Punch 15m OT computed', punch4ShortBreak);

// 1.4: 2-Punch Standard Day (09:00 to 18:00, elapsed 9h -> minus 1h lunch = 8h)
const punch2Std = calculateAttendanceHours('09:00', '18:00', undefined, undefined, '2_PUNCH');
assert(punch2Std.workingHoursFormatted === '8h 00m', '2-Punch 8h standard working time', punch2Std);
assert(punch2Std.breakHoursFormatted === '1h 00m', '2-Punch auto 1h lunch deducted for >5h work', punch2Std);
assert(punch2Std.overtimeHoursFormatted === '0h 00m', '2-Punch 0h OT on standard shift', punch2Std);

// 1.5: 2-Punch Overtime (08:50 to 19:20, elapsed 10h 30m -> minus 1h = 9h 30m -> 1h 30m OT)
const punch2Ot = calculateAttendanceHours('08:50', '19:20', undefined, undefined, '2_PUNCH');
assert(punch2Ot.workingHoursFormatted === '9h 30m', '2-Punch 9h 30m working time', punch2Ot);
assert(punch2Ot.overtimeHoursFormatted === '1h 30m', '2-Punch 1h 30m OT computed', punch2Ot);
assert(punch2Ot.status === 'OVERTIME', '2-Punch status marked OVERTIME', punch2Ot);

// 1.6: 2-Punch Half Day (< 4 hours)
const punch2Half = calculateAttendanceHours('09:00', '12:30', undefined, undefined, '2_PUNCH');
assert(punch2Half.status === 'HALF_DAY', '2-Punch under 4h marked HALF_DAY', punch2Half);

// -------------------------------------------------------------
// 2. Permission Rules (1 Hour & 2 Hours, Late-Mark Waiver)
// -------------------------------------------------------------
console.log('\n--- 2. Permission Rules & Late-Mark Waiver ---');

// 2.1: Late arrival without permission (Arrived 09:45 > 09:15 grace)
const unapprovedLate = calculateAttendanceHours('09:45', '18:00', undefined, undefined, '2_PUNCH', 0);
assert(unapprovedLate.isLate === true, 'Arrival at 09:45 is marked late without permission', unapprovedLate);
assert(unapprovedLate.status === 'LATE_MARK', 'Status is LATE_MARK without permission', unapprovedLate);

// 2.2: Late arrival with approved 1-Hour permission (09:45 arrival within 09:00 + 1h + 15m = 10:15)
const approved1hPerm = calculateAttendanceHours('09:45', '18:00', undefined, undefined, '2_PUNCH', 1);
assert(approved1hPerm.isLate === false, 'Arrival at 09:45 with 1h permission is NOT late', approved1hPerm);
assert(approved1hPerm.permissionWaived === true, 'Late mark is explicitly WAIVED', approved1hPerm);
assert(approved1hPerm.status === 'PRESENT', 'Status remains PRESENT (no salary cut)', approved1hPerm);

// 2.3: Late arrival with approved 2-Hour permission (10:45 arrival within 09:00 + 2h + 15m = 11:15)
const approved2hPerm = calculateAttendanceHours('10:45', '18:00', undefined, undefined, '2_PUNCH', 2);
assert(approved2hPerm.isLate === false, 'Arrival at 10:45 with 2h permission is NOT late', approved2hPerm);
assert(approved2hPerm.permissionWaived === true, '2h permission waived successfully', approved2hPerm);

// 2.4: Permission monthly quota balance calculation
const samplePerms: PermissionRecord[] = [
  {
    id: 'p-1',
    code: 'PERM-001',
    employee_code: 'EMP-001',
    name: 'Anand',
    department: 'Engineering',
    date: '2026-11-04',
    duration_hours: 1,
    permission_type: 'LATE_ARRIVAL',
    reason: 'Hospital visit',
    approval_status: 'APPROVED',
    approved_by: 'HR Manager',
    created_time: '2026-11-04T09:00:00Z'
  }
];

const quotaBalance1 = getEmployeePermissionBalance('EMP-001', samplePerms);
assert(quotaBalance1.usedThisMonth === 1, 'Quota shows 1 permission used this month', quotaBalance1);
assert(quotaBalance1.remainingThisMonth === 1, 'Quota shows 1 remaining out of 2', quotaBalance1);
assert(quotaBalance1.canApply === true, 'Employee can still apply for 1 more permission', quotaBalance1);

// Add second permission for same employee
const samplePerms2: PermissionRecord[] = [
  ...samplePerms,
  {
    id: 'p-2',
    code: 'PERM-002',
    employee_code: 'EMP-001',
    name: 'Anand',
    department: 'Engineering',
    date: '2026-11-10',
    duration_hours: 2,
    permission_type: 'EARLY_DEPARTURE',
    reason: 'Bank work',
    approval_status: 'APPROVED',
    approved_by: 'HR Manager',
    created_time: '2026-11-10T15:00:00Z'
  }
];

const quotaBalance2 = getEmployeePermissionBalance('EMP-001', samplePerms2);
assert(quotaBalance2.usedThisMonth === 2, 'Quota shows 2 used this month', quotaBalance2);
assert(quotaBalance2.remainingThisMonth === 0, 'Quota exhausted (0 remaining)', quotaBalance2);
assert(quotaBalance2.canApply === false, 'Cannot apply further this month', quotaBalance2);

// -------------------------------------------------------------
// 3. Week-Off Rules
// -------------------------------------------------------------
console.log('\n--- 3. Week-Off Rules & Holiday Detection ---');

// 2026 Calendar checks:
// 2026-11-01 is a Sunday
// 2026-11-07 is 1st Saturday (working in 2nd/4th Sat policy)
// 2026-11-14 is 2nd Saturday (WEEK OFF)
// 2026-11-21 is 3rd Saturday (working)
// 2026-11-28 is 4th Saturday (WEEK OFF)
// 2026-11-12 is Thursday (working day)

assert(isDateWeekOff('2026-11-01', 'SUNDAY_ONLY') === true, 'Sunday 2026-11-01 is Week Off (SUNDAY_ONLY)');
assert(isDateWeekOff('2026-11-12', 'SUNDAY_ONLY') === false, 'Thursday 2026-11-12 is working day');

// 2nd & 4th Saturday policy
assert(isDateWeekOff('2026-11-01', 'SECOND_FOURTH_SAT_SUNDAY') === true, 'Sunday is Week Off');
assert(isDateWeekOff('2026-11-07', 'SECOND_FOURTH_SAT_SUNDAY') === false, '1st Saturday 2026-11-07 is working day');
assert(isDateWeekOff('2026-11-14', 'SECOND_FOURTH_SAT_SUNDAY') === true, '2nd Saturday 2026-11-14 is Week Off');
assert(isDateWeekOff('2026-11-21', 'SECOND_FOURTH_SAT_SUNDAY') === false, '3rd Saturday 2026-11-21 is working day');
assert(isDateWeekOff('2026-11-28', 'SECOND_FOURTH_SAT_SUNDAY') === true, '4th Saturday 2026-11-28 is Week Off');

// Working on Week Off Day status check
const weekOffPunch = calculateAttendanceHours('09:00', '18:00', undefined, undefined, '2_PUNCH', 0, true);
assert(weekOffPunch.isWeekOffWork === true, 'Punch on week-off flagged as week-off work');
assert(weekOffPunch.status === 'WEEK_OFF_WORK', 'Status set to WEEK_OFF_WORK for double-wage / comp-off credit');

// -------------------------------------------------------------
// 4. Statutory Bonus Tally & Form C Audit Register (Payment of Bonus Act, 1965)
// -------------------------------------------------------------
console.log('\n--- 4. Statutory Bonus Tally & Labour Audit Register ---');

const mockEmployees = [
  {
    code: 'EMP-001',
    name: 'Anand Venkatesh',
    department: 'Engineering & Production',
    designation: 'Senior Production Engineer',
    amount: '75000',
    basic_salary: '37500',
    da: '11250',
    bank_account: '91801004928172',
    ifsc: 'SBIN0000123'
  },
  {
    code: 'EMP-002',
    name: 'Priya Sundaram',
    department: 'Human Resources & Talent',
    designation: 'HR Business Partner',
    amount: '65000',
    basic_salary: '32500',
    da: '9750',
    bank_account: '91801004928173',
    ifsc: 'HDFC0000123'
  }
];

// Test 4.1: Statutory Minimum Bonus (8.33%)
const bonus833 = calculateStatutoryBonus(mockEmployees, 8.33, '2025-2026');
assert(bonus833.summary.bonusPercentage === 8.33, 'Statutory minimum 8.33% rate applied', bonus833.summary);
assert(bonus833.summary.totalEmployees === 2, '2 employees in bonus register');
assert(bonus833.summary.statutoryCompliance.minimumBonusMet === true, 'Minimum bonus compliance verified');
assert(bonus833.summary.statutoryCompliance.withinMaximumCap === true, 'Within statutory ceiling');

// For EMP-001: monthly basic+da = 37500 + 11250 = 48750 -> Annual = 585,000
// Gross bonus @ 8.33% = round(585,000 * 0.0833) = 48,731
const emp1Bonus = bonus833.items.find((i) => i.employeeCode === 'EMP-001');
assert(emp1Bonus !== undefined, 'EMP-001 exists in bonus tally');
assert(emp1Bonus!.annualBasicDa === 585000, 'EMP-001 annual basic+da computed accurately (585,000)');
assert(emp1Bonus!.grossBonusPayable === Math.round(585000 * 0.0833), 'EMP-001 gross bonus at 8.33% is accurate');
assert(emp1Bonus!.netBonusDisbursed > 0, 'Net bonus payable is positive');

// Test 4.2: Statutory Maximum Bonus (20.0%)
const bonus20 = calculateStatutoryBonus(mockEmployees, 20.0, '2025-2026');
assert(bonus20.summary.bonusPercentage === 20.0, 'Statutory maximum 20.0% rate applied');
const emp1Bonus20 = bonus20.items.find((i) => i.employeeCode === 'EMP-001');
assert(emp1Bonus20!.grossBonusPayable === Math.round(585000 * 0.20), 'EMP-001 gross bonus at 20% is exactly 117,000');

// Test 4.3: Clamping bonus between 8.33% and 20%
const bonusClampedLow = calculateStatutoryBonus(mockEmployees, 5.0);
assert(bonusClampedLow.summary.bonusPercentage === 8.33, 'Bonus below statutory 8.33% is clamped to minimum 8.33%');

const bonusClampedHigh = calculateStatutoryBonus(mockEmployees, 35.0);
assert(bonusClampedHigh.summary.bonusPercentage === 20.0, 'Bonus above statutory 20% is clamped to maximum 20.0%');

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('================================================================');

if (totalTests === passedTests) {
  console.log('ALL WORKFLOW LOGIC VERIFIED SUCCESSFULLY WITH 100% PASS RATE!');
  process.exit(0);
} else {
  console.error('SOME TESTS FAILED!');
  process.exit(1);
}

