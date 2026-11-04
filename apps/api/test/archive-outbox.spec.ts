import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { OutboxService } from '../src/database/outbox.service';
import { NeonPrismaService } from '../src/database/neon-prisma.service';
import { HistoryPrismaService } from '../src/database/history-prisma.service';
import { ArchiveReason } from '@zuno/shared-types';

describe('Two-Database Outbox Pattern & Sync Suite', () => {
  let service: OutboxService;

  const mockNeonPrisma = {
    tbArchiveOutbox: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockHistoryPrisma = {
    getClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboxService,
        { provide: NeonPrismaService, useValue: mockNeonPrisma },
        { provide: HistoryPrismaService, useValue: mockHistoryPrisma },
      ],
    }).compile();

    service = module.get<OutboxService>(OutboxService);
  });

  it('RULE 5: Stage archive event into local transactional outbox without immediate remote purge', async () => {
    mockNeonPrisma.tbArchiveOutbox.create.mockResolvedValue({
      id: 'outbox-uuid-1',
      status: 'PENDING',
    });

    const outboxId = await service.stageArchiveEvent({
      tenantId: 'tenant-1',
      sourceTable: 'tb_sales_invoice',
      sourceRecordId: 'inv-101',
      archiveReason: ArchiveReason.STATUTORY_RETENTION,
      data: { amount: 5000 },
    });

    expect(outboxId).toBe('outbox-uuid-1');
    expect(mockNeonPrisma.tbArchiveOutbox.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'PENDING',
          retry_count: 0,
        }),
      })
    );
  });

  it('RULE 6: Failed archive synchronization triggers exponential backoff retry and preserves operational record', async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    mockNeonPrisma.tbArchiveOutbox.findMany.mockResolvedValue([
      {
        id: 'outbox-uuid-1',
        tenant_id: 'tenant-1',
        source_table: 'tb_sales_invoice',
        source_record_id: 'inv-101',
        retry_count: 1,
        payload: { data: { amount: 5000 } },
      },
    ]);

    // Simulate Supabase Historical connection error
    mockHistoryPrisma.getClient.mockReturnValue({
      tbHistoricalRecord: {
        create: jest.fn().mockRejectedValue(new Error('Network timeout connecting to Supabase')),
      },
    });

    const result = await service.processPendingEvents(10);
    expect(result.failed).toBe(1);
    expect(result.processed).toBe(0);

    expect(mockNeonPrisma.tbArchiveOutbox.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'FAILED',
          retry_count: 2,
        }),
      })
    );
  });
});

