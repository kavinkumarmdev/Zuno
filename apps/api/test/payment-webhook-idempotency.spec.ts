import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';
import { NeonPrismaService } from '../src/database/neon-prisma.service';

describe('Payment Webhook Idempotency & Entitlement Suite', () => {
  let service: SubscriptionsService;

  const mockNeonPrisma = {
    tbPaymentWebhook: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    tbPayment: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    tbSubscription: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    tbSubscriptionItem: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    tbSubscriptionEntitlement: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    tbModule: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: NeonPrismaService, useValue: mockNeonPrisma },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('RULE 7: Payment webhook replay must be detected as duplicate and never re-trigger payment processing', async () => {
    const eventId = 'evt_razorpay_99214';

    // Mock that the webhook event was already received and recorded in tb_payment_webhook
    mockNeonPrisma.tbPaymentWebhook.findFirst.mockResolvedValue({
      id: 'webhook-rec-1',
      document_number: eventId,
      status: 'PROCESSED',
    });

    const result = await service.processPaymentWebhook(eventId, 'pay-1', 'captured', 'sig-abc');

    expect(result.idempotent).toBe(true);
    expect(result.status).toBe('PROCESSED');
    // Ensure no new webhook row or payment update was created
    expect(mockNeonPrisma.tbPaymentWebhook.create).not.toHaveBeenCalled();
    expect(mockNeonPrisma.tbPayment.update).not.toHaveBeenCalled();
  });

  it('RULE 2 & 4: Inactive or unsubscribed module access must be denied by central entitlement engine', async () => {
    const tenantId = 'tenant-uuid-1';
    mockNeonPrisma.tbModule.findFirst.mockResolvedValue({ id: 'mod-mfg', module_code: 'MOD_MANUFACTURING' });

    // Mock active subscription that is EXPIRED
    mockNeonPrisma.tbSubscription.findFirst.mockResolvedValue(null);

    const hasAccess = await service.checkModuleEntitlement(tenantId, 'MOD_MANUFACTURING');
    expect(hasAccess).toBe(false);
  });
});

