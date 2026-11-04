import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload, ArchiveReason } from '@zuno/shared-types';

@ApiTags('Historical Database (Supabase)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('records')
  @ApiOperation({ summary: 'Search cold historical and statutory records from Supabase database' })
  async getHistoricalRecords(
    @CurrentTenant() tenantId: string,
    @Query('sourceTable') sourceTable?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('limit') limit?: number
  ) {
    return this.historyService.searchHistoricalRecords(tenantId, { sourceTable, fiscalYear, limit: limit ? Number(limit) : 50 });
  }

  @Post('archive')
  @ApiOperation({ summary: 'Stage an operational record into Outbox for historical archiving' })
  async archiveRecord(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: { sourceTable: string; sourceRecordId: string; archiveReason: ArchiveReason; data: any }
  ) {
    return this.historyService.queueRecordForArchival({
      tenantId,
      sourceTable: body.sourceTable,
      sourceRecordId: body.sourceRecordId,
      archiveReason: body.archiveReason || ArchiveReason.STATUTORY_RETENTION,
      data: body.data,
      archivedBy: user.sub
    });
  }

  @Post('sync-worker/trigger')
  @ApiOperation({ summary: 'Execute outbox queue processor (simulates background worker sync to Supabase)' })
  async triggerWorker() {
    return this.historyService.runSyncWorker();
  }
}

