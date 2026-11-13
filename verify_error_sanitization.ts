import { sanitizeBackendErrorMessage } from './apps/api/src/common/filters/http-exception.filter';
import { sanitizeErrorMessage, isDatabaseUnavailableError } from './apps/web/src/utils/errorSanitizer';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, actual?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`, actual || '');
  }
}

console.log('================================================================');
console.log('TEST SUITE: BACKEND & FRONTEND DATABASE ERROR SANITIZATION');
console.log('================================================================\n');

// 1. Backend Sanitizer: Table does not exist (P2021)
console.log('--- 1. Backend Global Exception Filter Sanitization ---');

const rawPrismaTableErr = 'Invalid `prisma.tbUserCredential.findFirst()` invocation: The table `public.tb_user_credential` does not exist in the current database.';
const res1 = sanitizeBackendErrorMessage(rawPrismaTableErr, 'P2021');

assert(!res1.message.includes('prisma'), 'Backend: Error does NOT contain "prisma"', res1);
assert(!res1.message.includes('tb_user_credential'), 'Backend: Error does NOT expose internal table name "tb_user_credential"', res1);
assert(!res1.message.includes('findFirst'), 'Backend: Error does NOT expose invocation method "findFirst"', res1);
assert(res1.message.includes('synchronizing with the database'), 'Backend: Message provides polite, user-friendly explanation', res1);

// 1.2: Connection failure (P1001)
const rawConnErr = "Can't reach database server at `localhost:5432`. Please make sure your database server is running at `localhost:5432`.";
const res2 = sanitizeBackendErrorMessage(rawConnErr, 'P1001');
assert(!res2.message.includes('localhost:5432'), 'Backend: Does NOT expose host or port', res2);
assert(res2.message.includes('temporarily synchronizing') || res2.message.includes('offline storage'), 'Backend: Message explains offline resilient mode', res2);

// 1.3: Unique constraint violation (P2002)
const rawUniqueErr = 'Unique constraint failed on the fields: (`email`)';
const res3 = sanitizeBackendErrorMessage(rawUniqueErr, 'P2002');
assert(res3.message.includes('already exists'), 'Backend: Friendly unique constraint message', res3);

// -------------------------------------------------------------
// 2. Frontend Universal Sanitizer
// -------------------------------------------------------------
console.log('\n--- 2. Frontend Universal Error Sanitizer (Across All Pages) ---');

// 2.1: Raw Prisma error string
const clean1 = sanitizeErrorMessage(rawPrismaTableErr);
assert(!clean1.includes('prisma'), 'Frontend: Error does NOT contain "prisma"', clean1);
assert(!clean1.includes('tb_user_credential'), 'Frontend: Error does NOT contain table name', clean1);
assert(clean1.includes('synchronizing with the database'), 'Frontend: Gives clean synchronization message', clean1);

// 2.2: Axios-like response object
const axiosErrorObj = {
  response: {
    status: 500,
    data: {
      success: false,
      message: 'Invalid `prisma.tbAttendance.findMany()` invocation: The table `public.tb_attendance` does not exist in the current database.'
    }
  }
};
const clean2 = sanitizeErrorMessage(axiosErrorObj);
assert(!clean2.includes('prisma'), 'Frontend (Axios obj): Error does NOT contain "prisma"', clean2);
assert(!clean2.includes('tb_attendance'), 'Frontend (Axios obj): Error does NOT contain table name', clean2);

// 2.3: Raw Error instance
const errorInstance = new Error('Raw query failed. Code: 42P01. relation "public.tb_user" does not exist');
const clean3 = sanitizeErrorMessage(errorInstance);
assert(!clean3.includes('42P01'), 'Frontend (Error inst): Error does NOT contain SQL code', clean3);
assert(!clean3.includes('public.tb_user'), 'Frontend (Error inst): Error does NOT contain relation name', clean3);

// 2.4: Database unavailable helper
assert(isDatabaseUnavailableError(rawPrismaTableErr) === true, 'Helper detects table missing error');
assert(isDatabaseUnavailableError(rawConnErr) === true, 'Helper detects connection failure error');
assert(isDatabaseUnavailableError('Valid input validation error') === false, 'Helper distinguishes regular validation error');

// 2.5: Normal user-facing errors preserved intact
const normalUserError = 'Invalid username or password. Please verify your credentials.';
const cleanNormal = sanitizeErrorMessage(normalUserError);
assert(cleanNormal === normalUserError, 'Regular user-friendly errors are preserved intact');

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('================================================================');

if (totalTests === passedTests) {
  console.log('ALL ERROR SANITIZATION TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.error('TESTS FAILED!');
  process.exit(1);
}

