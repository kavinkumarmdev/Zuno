import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NeonPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NeonPrismaService.name);
  private isDbConnected = false;

  constructor(configService: ConfigService) {
    const dbUrl =
      configService.get<string>('DATABASE_URL') ||
      configService.get<string>('NEON_DATABASE_URL') ||
      process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/zuno_erp?schema=public';

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: ['error', 'warn'],
    });
  }

  get isConnected(): boolean {
    return this.isDbConnected;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isDbConnected = true;
      this.logger.log('Connected to Neon Operational PostgreSQL database successfully');
    } catch (err: any) {
      this.isDbConnected = false;
      this.logger.warn(`Neon DB connection deferred or offline for local build: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from Neon Operational database');
  }

  /**
   * Health verification check for Neon DB
   */
  async checkHealth(): Promise<{ status: string; latencyMs: number }> {
    const start = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'HEALTHY', latencyMs: Date.now() - start };
    } catch (err: any) {
      return { status: 'UNHEALTHY', latencyMs: Date.now() - start };
    }
  }
}

