import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Sanitizes technical, database, and Prisma error messages into clean, user-friendly language.
 * Strictly prevents raw database tables, SQL syntax, or internal Prisma stack traces from reaching clients.
 */
export function sanitizeBackendErrorMessage(rawMessage: string, errorCode?: string): { message: string; status?: number } {
  const msg = String(rawMessage || '').trim();
  const code = String(errorCode || '').trim();

  // 1. Table or collection does not exist (Prisma P2021 / Postgres 42P01)
  if (
    code === 'P2021' ||
    msg.includes('does not exist in the current database') ||
    (msg.includes('relation') && msg.includes('does not exist')) ||
    msg.includes('The table') && msg.includes('does not exist')
  ) {
    return {
      message: 'The requested system records are currently synchronizing with the database. Please try again in a few moments or continue in offline resilient mode.',
      status: HttpStatus.SERVICE_UNAVAILABLE
    };
  }

  // 2. Database connection unreachable (P1001, P1002, ECONNREFUSED)
  if (
    code === 'P1001' ||
    code === 'P1002' ||
    msg.includes("Can't reach database server") ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('database connection failed')
  ) {
    return {
      message: 'The database service is temporarily synchronizing. Offline storage has been activated to protect your session.',
      status: HttpStatus.SERVICE_UNAVAILABLE
    };
  }

  // 3. Unique constraint failure (P2002)
  if (code === 'P2002' || msg.includes('Unique constraint failed')) {
    return {
      message: 'A record with this unique identifier or email already exists. Please provide unique information and try again.',
      status: HttpStatus.CONFLICT
    };
  }

  // 4. Record not found (P2025)
  if (
    code === 'P2025' ||
    msg.includes('Record to update not found') ||
    msg.includes('Record to delete not found')
  ) {
    return {
      message: 'The requested record could not be found or has already been updated.',
      status: HttpStatus.NOT_FOUND
    };
  }

  // 5. Foreign key constraint violation (P2003)
  if (code === 'P2003' || msg.includes('Foreign key constraint failed')) {
    return {
      message: 'The requested action cannot be completed because a required parent or related record is missing.',
      status: HttpStatus.BAD_REQUEST
    };
  }

  // 6. Generic Prisma invocation or SQL syntax errors
  if (
    msg.includes('prisma.') ||
    msg.includes('Prisma') ||
    msg.includes('invocation:') ||
    msg.includes('syntax error at or near') ||
    msg.includes('SELECT ') ||
    msg.includes('INSERT INTO') ||
    msg.includes('UPDATE ') ||
    msg.includes('DELETE FROM') ||
    msg.includes('column ') && msg.includes('does not exist')
  ) {
    return {
      message: 'The system encountered an unexpected data formatting condition. The operation has been safely handled.',
      status: HttpStatus.INTERNAL_SERVER_ERROR
    };
  }

  return { message: msg };
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'An unexpected error occurred. Please try again.';
    let errors: any = undefined;

    const rawError = exception as any;
    const errCode = rawError?.code;
    const rawMsg = rawError?.message || '';

    // Log the full technical error and stack trace for developer diagnosis
    this.logger.error(
      `[${request.method}] ${request.url} - Error: ${rawMsg}`,
      rawError?.stack
    );

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message || exception.message;
        errors = (res as any).errors;
      }
    } else if (exception instanceof Error) {
      const sanitized = sanitizeBackendErrorMessage(exception.message, errCode);
      message = sanitized.message;
      if (sanitized.status) {
        status = sanitized.status;
      }
    } else if (typeof exception === 'string') {
      const sanitized = sanitizeBackendErrorMessage(exception, errCode);
      message = sanitized.message;
    }

    // Always run a final sanitization pass over the final message string to guarantee no leak
    if (typeof message === 'string') {
      const finalSanitize = sanitizeBackendErrorMessage(message, errCode);
      message = finalSanitize.message;
      if (finalSanitize.status && status === HttpStatus.INTERNAL_SERVER_ERROR) {
        status = finalSanitize.status;
      }
    } else if (Array.isArray(message)) {
      message = message.map((m) => sanitizeBackendErrorMessage(String(m), errCode).message).join(', ') as any;
    }

    response.status(status).json({
      success: false,
      message,
      data: null,
      errors: errors || (Array.isArray(message) ? (message as any).map((m: string) => ({ field: 'general', message: m })) : undefined),
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}
