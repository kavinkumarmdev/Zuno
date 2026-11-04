import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HistoryPrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HistoryPrismaService.name);
  private client: PrismaClient | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const historyUrl = this.configService.get<string>('SUPABASE_HISTORY_DATABASE_URL') || process.env.SUPABASE_HISTORY_DATABASE_URL;
    if (historyUrl) {
      try {
        this.client = new PrismaClient({
          datasources: {
            db: { url: historyUrl }
          },
          log: ['error', 'warn']
        });
        await this.client.$connect();
        this.logger.log('Connected to Supabase Historical PostgreSQL database successfully');
      } catch (err: any) {
        this.logger.warn(`Supabase History DB connection deferred: ${err.message}`);
      }
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.$disconnect();
      this.logger.log('Disconnected from Supabase Historical database');
    }
  }

  getClient(): PrismaClient | null {
    return this.client;
  }

  /**
   * Health verification check for History DB
   */
  async checkHealth(): Promise<{ status: string; latencyMs: number }> {
    if (!this.client) {
      return { status: 'DISCONNECTED', latencyMs: 0 };
    }
    const start = Date.now();
    try {
      await this.client.$queryRaw`SELECT 1`;
      return { status: 'HEALTHY', latencyMs: Date.now() - start };
    } catch (err: any) {
      return { status: 'UNHEALTHY', latencyMs: Date.now() - start };
    }
  }
}

