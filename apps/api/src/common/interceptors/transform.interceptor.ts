import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@zuno/shared-types';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // Check if data already has standard format
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
          return {
            ...data,
            timestamp: new Date().toISOString()
          };
        }

        // Check if payload has pagination metadata
        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          return {
            success: true,
            data: data.items,
            meta: data.meta,
            timestamp: new Date().toISOString()
          };
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString()
        };
      })
    );
  }
}

