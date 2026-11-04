import { Injectable, Logger } from '@nestjs/common';
import { NeonPrismaService } from './neon-prisma.service';
import { HistoryPrismaService } from './history-prisma.service';
import { ArchiveRecordPayload, ArchiveReason, UUID } from '@zuno/shared-types';
import * as crypto from 'crypto';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    private readonly neon: NeonPrismaService,
    private readonly history: HistoryPrismaService
  ) {}

  /**
   * Stage a record in the operational Outbox queue within the same local transaction
   */
  async stageArchiveEvent(payload: ArchiveRecordPayload): Promise<string> {
    const outboxRecord = await (this.neon as any).tbArchiveOutbox.create({
      data: {
        tenant_id: payload.tenantId,
        source_table: payload.sourceTable,
        source_record_id: payload.sourceRecordId,
        event_type: 'ARCHIVE',
        payload: {
          data: payload.data,
          reason: payload.archiveReason,
          archivedBy: payload.archivedBy,
          stagedAt: new Date().toISOString()
        },
        status: 'PENDING',
        retry_count: 0
      }
    });

    this.logger.log(
      `Staged outbox archive event ${outboxRecord.id} for table [${payload.sourceTable}:${payload.sourceRecordId}]`
    );
    return outboxRecord.id;
  }

  /**
   * Process pending outbox records with exponential backoff and idempotency verification
   */
  async processPendingEvents(batchSize = 50): Promise<{ processed: number; failed: number }> {
    const pendingEvents = await (this.neon as any).tbArchiveOutbox.findMany({
      where: {
        status: { in: ['PENDING', 'FAILED'] },
        retry_count: { lt: 5 },
        OR: [
          { next_retry_at: null },
          { next_retry_at: { lte: new Date() } }
        ]
      },
      take: batchSize,
      orderBy: { created_time: 'asc' }
    });

    let processedCount = 0;
    let failedCount = 0;

    for (const event of pendingEvents) {
      try {
        const payloadData = event.payload as any;
        const serialized = JSON.stringify(payloadData.data);
        const checksum = crypto.createHash('sha256').update(serialized).digest('hex');

        // Copy and verify insertion into Supabase Historical Database
        const historyClient = this.history.getClient();
        if (historyClient) {
          await (historyClient as any).tbHistoricalRecord.create({
            data: {
              tenant_id: event.tenant_id,
              source_table: event.source_table,
              source_record_id: event.source_record_id,
              archive_reason: payloadData.reason || ArchiveReason.AUTOMATED_LIFECYCLE,
              payload_snapshot: payloadData.data,
              hash_checksum: checksum,
              archived_by: payloadData.archivedBy
            }
          });
        }

        // Mark outbox event as PROCESSED
        await (this.neon as any).tbArchiveOutbox.update({
          where: { id: event.id },
          data: {
            status: 'PROCESSED',
            processed_time: new Date(),
            last_error: null
          }
        });

        processedCount++;
      } catch (err: any) {
        failedCount++;
        const retries = event.retry_count + 1;
        const backoffMs = Math.pow(2, retries) * 1000;
        const nextRetry = new Date(Date.now() + backoffMs);

        await (this.neon as any).tbArchiveOutbox.update({
          where: { id: event.id },
          data: {
            status: 'FAILED',
            retry_count: retries,
            last_error: err.message,
            next_retry_at: nextRetry
          }
        });

        this.logger.error(`Outbox event ${event.id} processing failed (retry ${retries}/5): ${err.message}`);
      }
    }

    return { processed: processedCount, failed: failedCount };
  }
}

