import { Test, TestingModule } from '@nestjs/testing';
import { BusinessModulesService } from '../src/modules/business-modules.service';
import { NeonPrismaService } from '../src/database/neon-prisma.service';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';

describe('Tenant Isolation & Boundary Security Test Suite', () => {
  let service: BusinessModulesService;
  const mockNeonPrismaService = {
    tbProductMaster: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockSubscriptionsService = {
    checkModuleEntitlement: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessModulesService,
        { provide: NeonPrismaService, useValue: mockNeonPrismaService },
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
      ],
    }).compile();

    service = module.get<BusinessModulesService>(BusinessModulesService);
  });

  it('RULE 1: Tenant A query must strictly inject tenant_id in where clause and never return Tenant B records', async () => {
    const tenantA = '11111111-1111-1111-1111-111111111111';
    const tenantB = '22222222-2222-2222-2222-222222222222';

    mockNeonPrismaService.tbProductMaster.findMany.mockImplementation((args: any) => {
      // Assert that tenant_id is enforced
      expect(args.where.tenant_id).toBe(tenantA);
      return [
        { id: 'prod-1', tenant_id: tenantA, name: 'Product A' },
      ];
    });

    mockNeonPrismaService.tbProductMaster.count.mockResolvedValue(1);

    const result = await service.listRecords(tenantA, 'tb_product_master', { page: 1, limit: 10 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].tenant_id).toBe(tenantA);
  });

  it('RULE 2: Single record lookup must reject access if requested ID belongs to a different tenant', async () => {
    const tenantA = '11111111-1111-1111-1111-111111111111';
    const foreignRecordId = '99999999-9999-9999-9999-999999999999';

    mockNeonPrismaService.tbProductMaster.findFirst.mockResolvedValue(null);

    const record = await service.getRecordById(tenantA, 'tb_product_master', foreignRecordId);
    // If not found in Tenant A boundary, it must not return Tenant B data
    expect(record.tenant_id).toBe(tenantA);
  });
});

