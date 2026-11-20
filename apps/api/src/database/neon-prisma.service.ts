import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

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
      log: ['warn'],
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

      // Auto-migrate: check if public.tb_tenant exists, and apply initial schema if database is unmigrated
      try {
        const check: any = await this.$queryRawUnsafe(`
          SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tb_tenant' LIMIT 1;
        `);

        if (!check || check.length === 0) {
          this.logger.log('Database tables not yet initialized. Auto-applying 243 approved catalogue tables...');
          await this.applyInitialSchema();
        } else {
          this.logger.log('Verified Neon PostgreSQL database tables.');
        }
      } catch (checkErr: any) {
        this.logger.debug(`Table check notice: ${checkErr.message}`);
      }
    } catch (err: any) {
      this.isDbConnected = false;
      this.logger.warn(`Neon DB connection deferred or offline for local build: ${err.message}`);
    }
  }

  private async applyInitialSchema() {
    const candidatePaths = [
      path.resolve(process.cwd(), 'database/main/migrations/001_initial_neon_243_tables.sql'),
      path.resolve(process.cwd(), '../../database/main/migrations/001_initial_neon_243_tables.sql'),
      path.resolve(__dirname, '../../../../database/main/migrations/001_initial_neon_243_tables.sql'),
    ];
    const sqlPath = candidatePaths.find((p) => fs.existsSync(p));
    if (sqlPath) {
      try {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        await this.$executeRawUnsafe(sql);
        this.logger.log('✅ Successfully applied 243 approved catalogue tables to Neon PostgreSQL database!');
      } catch (err: any) {
        this.logger.error(`Failed to apply initial database schema: ${err.message}`);
      }
    } else {
      this.logger.warn('001_initial_neon_243_tables.sql migration file not found in search paths.');
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

