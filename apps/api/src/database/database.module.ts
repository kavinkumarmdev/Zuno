import { Module, Global } from '@nestjs/common';
import { NeonPrismaService } from './neon-prisma.service';
import { HistoryPrismaService } from './history-prisma.service';
import { OutboxService } from './outbox.service';

@Global()
@Module({
  providers: [NeonPrismaService, HistoryPrismaService, OutboxService],
  exports: [NeonPrismaService, HistoryPrismaService, OutboxService],
})
export class DatabaseModule {}

