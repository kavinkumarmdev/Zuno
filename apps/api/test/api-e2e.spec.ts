import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';
import { NeonPrismaService } from '../src/database/neon-prisma.service';
import { HistoryPrismaService } from '../src/database/history-prisma.service';

describe('Zuno ERP End-to-End API Integration Suite (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NeonPrismaService)
      .useValue({
        checkHealth: jest.fn().mockResolvedValue({ status: 'HEALTHY', latencyMs: 2 }),
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        tbModule: {
          findMany: jest.fn().mockResolvedValue([]),
        },
        tbModuleCategory: {
          findMany: jest.fn().mockResolvedValue([]),
        },
        tbSubmodule: {
          findMany: jest.fn().mockResolvedValue([]),
        },
        tbModuleFeature: {
          findMany: jest.fn().mockResolvedValue([]),
        },
        tbModulePrice: {
          findMany: jest.fn().mockResolvedValue([]),
        },
        tbPaymentWebhook: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 'webhook-1' }),
        },
        tbPayment: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      })
      .overrideProvider(HistoryPrismaService)
      .useValue({
        checkHealth: jest.fn().mockResolvedValue({ status: 'HEALTHY', latencyMs: 2 }),
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('System Health & Observability (Public)', () => {
    it('GET /api/v1/health should return system status and dual-database telemetry', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('OK');
      expect(response.body.data.databases.neonOperational.provider).toBe('Neon PostgreSQL');
      expect(response.body.data.databases.neonOperational.status).toBe('HEALTHY');
      expect(response.body.data.databases.supabaseHistorical.provider).toBe('Supabase PostgreSQL');
      expect(response.body.data.databases.supabaseHistorical.status).toBe('HEALTHY');
    });
  });

  describe('Input Validation & Sanitization Boundaries', () => {
    it('POST /api/v1/auth/login should reject empty body with 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('POST /api/v1/auth/register should reject invalid payload with 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: '123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('POST /api/v1/subscriptions/webhook should reject payload missing payment ID with 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/subscriptions/webhook')
        .send({ event: 'payment.captured' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('missing payment transaction ID');
    });

    it('POST /api/v1/subscriptions/webhook should return 404 when payment transaction does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/subscriptions/webhook')
        .send({ event: 'payment.captured', paymentId: 'unknown-payment-id' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Payment transaction not found');
    });
  });

  describe('Security & Multi-Tenant Boundary Enforcement', () => {
    it('GET /api/v1/dashboard/metrics should reject unauthenticated request with 401', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/dashboard/metrics')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('bearer token');
    });

    it('GET /api/v1/tenants/current should reject unauthenticated request with 401', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/tenants/current')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('GET /api/v1/modules/data/tb_company should reject unauthenticated access to ERP tables with 401', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/modules/data/tb_company')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('GET /api/v1/audit/logs should reject unauthenticated access with 401', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/audit/logs')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

