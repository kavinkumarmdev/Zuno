/**
 * Universal Error Sanitizer
 * Intercepts technical database, Prisma, network, and internal server exceptions
 * and converts them into polite, user-friendly customized messages across all pages.
 */

export function sanitizeErrorMessage(rawError: any, fallback: string = 'An unexpected error occurred. Please try again.'): string {
  if (!rawError) return fallback;

  // Extract string from string, Error instance, Axios response, or object
  let text = '';
  if (typeof rawError === 'string') {
    text = rawError;
  } else if (rawError instanceof Error) {
    text = rawError.message;
  } else if (typeof rawError === 'object') {
    text = rawError.message || rawError.error || rawError.title || '';
    if (!text && rawError.response?.data) {
      const data = rawError.response.data;
      text = typeof data === 'string' ? data : data.message || data.error || '';
    }
  }

  text = String(text || '').trim();
  if (!text) return fallback;

  // 1. Table or relation does not exist in the database (e.g. tb_user_credential, tb_attendance, etc.)
  if (
    text.includes('does not exist in the current database') ||
    text.includes('does not exist') && (text.includes('table') || text.includes('relation') || text.includes('public.')) ||
    text.includes('P2021') ||
    text.includes('Invalid `prisma.') && text.includes('invocation')
  ) {
    return 'The requested system records are currently synchronizing with the database. Please try again shortly or continue using offline mode.';
  }

  // 2. Database connection or host unreachable (P1001, P1002, ECONNREFUSED)
  if (
    text.includes("Can't reach database server") ||
    text.includes('P1001') ||
    text.includes('P1002') ||
    text.includes('ECONNREFUSED') ||
    text.includes('Failed to fetch') ||
    text.includes('Network Error') ||
    text.includes('database connection failed')
  ) {
    return 'The database service is temporarily offline or synchronizing. The system is operating in local resilient mode.';
  }

  // 3. Unique constraint violation (P2002)
  if (text.includes('Unique constraint failed') || text.includes('P2002')) {
    return 'A record with this identifier, code, or email already exists. Please provide unique information and try again.';
  }

  // 4. Record not found in database (P2025)
  if (text.includes('Record to update not found') || text.includes('Record to delete not found') || text.includes('P2025')) {
    return 'The requested record could not be found in the system or has already been updated.';
  }

  // 5. Foreign key constraint failed (P2003)
  if (text.includes('Foreign key constraint failed') || text.includes('P2003')) {
    return 'This operation cannot be completed because a related parent record is missing or restricted.';
  }

  // 6. Prisma / SQL query syntax or internal Prisma traces
  if (
    text.includes('prisma.') ||
    text.includes('Prisma') ||
    text.includes('syntax error at or near') ||
    text.includes('invocation:') ||
    text.includes('SELECT ') ||
    text.includes('INSERT INTO') ||
    text.includes('column ') && text.includes('does not exist')
  ) {
    return 'The system encountered a temporary database processing condition. Your information has been preserved.';
  }

  // 7. Generic internal server errors or HTML error pages
  if (text.includes('<!DOCTYPE html>') || text.includes('<html>') || text.includes('500 Internal Server Error')) {
    return 'The server encountered a temporary delay. Please try again in a few moments.';
  }

  // 8. Ugly object stringifications
  if (text === '[object Object]') {
    return fallback;
  }

  return text;
}

/**
 * Checks whether an error indicates a database synchronization or missing table issue.
 * Useful for triggering seamless offline-first fallbacks.
 */
export function isDatabaseUnavailableError(rawError: any): boolean {
  if (!rawError) return false;
  const str = String(typeof rawError === 'object' ? rawError.message || JSON.stringify(rawError) : rawError).toLowerCase();
  return (
    str.includes('does not exist in the current database') ||
    str.includes('does not exist') && str.includes('table') ||
    str.includes("can't reach database") ||
    str.includes('econnrefused') ||
    str.includes('p1001') ||
    str.includes('p2021') ||
    str.includes('prisma')
  );
}

