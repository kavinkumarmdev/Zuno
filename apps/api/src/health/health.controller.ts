import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NeonPrismaService } from '../database/neon-prisma.service';
import { HistoryPrismaService } from '../database/history-prisma.service';
import { Public } from '../common/decorators/require-permission.decorator';

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly neonPrisma: NeonPrismaService,
    private readonly historyPrisma: HistoryPrismaService
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Comprehensive system health check including Neon and Supabase connections' })
  async getHealth() {
    const neonHealth = await this.neonPrisma.checkHealth();
    const historyHealth = await this.historyPrisma.checkHealth();

    const isHealthy = neonHealth.status !== 'UNHEALTHY';

    return {
      status: isHealthy ? 'OK' : 'DEGRADED',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      databases: {
        neonOperational: {
          role: 'Primary Source of Truth (Operational Transactions)',
          provider: 'Neon PostgreSQL',
          status: neonHealth.status,
          latencyMs: neonHealth.latencyMs
        },
        supabaseHistorical: {
          role: 'Cold Archival & Statutory Audit Ledger',
          provider: 'Supabase PostgreSQL',
          status: historyHealth.status,
          latencyMs: historyHealth.latencyMs
        }
      }
    };
  }
}

