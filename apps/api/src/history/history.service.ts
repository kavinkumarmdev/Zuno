import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { HistoryPrismaService } from '../database/history-prisma.service';
import { OutboxService } from '../database/outbox.service';
import { ArchiveRecordPayload, ArchiveReason } from '@zuno/shared-types';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    private readonly historyPrisma: HistoryPrismaService,
    private readonly outboxService: OutboxService
  ) {}

  /**
   * Request an archival transaction through the operational outbox queue
   */
  async queueRecordForArchival(payload: ArchiveRecordPayload): Promise<{ outboxId: string; status: string }> {
    const outboxId = await this.outboxService.stageArchiveEvent(payload);
    return {
      outboxId,
      status: 'QUEUED_IN_OUTBOX'
    };
  }

  /**
   * Trigger the background worker run immediately
   */
  async runSyncWorker(): Promise<{ processed: number; failed: number }> {
    return this.outboxService.processPendingEvents();
  }

  /**
   * Read-only search across cold Supabase historical records for tenant
   */
  async searchHistoricalRecords(tenantId: string, params: { sourceTable?: string; fiscalYear?: string; limit?: number }) {
    const client = this.historyPrisma.getClient();
    if (!client) {
      return {
        records: [],
        message: 'Supabase Historical Database is operating in disconnected mode'
      };
    }

    const where: any = { tenant_id: tenantId };
    if (params.sourceTable) where.source_table = params.sourceTable;
    if (params.fiscalYear) where.fiscal_year = params.fiscalYear;

    const records = await (client as any).tbHistoricalRecord.findMany({
      where,
      orderBy: { archived_at: 'desc' },
      take: params.limit || 50
    });

    return {
      records,
      count: records.length,
      storageEngine: 'Supabase Cold Storage'
    };
  }
}

