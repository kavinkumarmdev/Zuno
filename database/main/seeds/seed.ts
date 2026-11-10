import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ZUNO ERP Master Database Seeding...');

  const passwordHash = await bcrypt.hash('Kavin@987', 10);

  // 1. Seed Platform Super Administrator
  const platformAdmin = await (prisma as any).tbPlatformAdmin.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      admin_code: 'ZUNO-SUPERADMIN',
      admin_name: 'Platform Operations Admin',
      email: 'admin@zunoerp.com',
      mobile: '+919999900000',
      password_hash: passwordHash,
      admin_role: 'SUPER_ADMIN',
      admin_status: 'ACTIVE'
    }
  });
  console.log('✅ Seeded Platform Admin: admin@zunoerp.com');

  // 2. Seed 19 Modules & SaaS Categories
  const categoryFoundation = await (prisma as any).tbModuleCategory.upsert({
    where: { id: '10000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '10000000-0000-0000-0000-000000000001',
      code: 'CORE',
      name: 'Core Operations & Supply Chain',
      description: 'Foundational ERP modules for manufacturing, trading, inventory and distribution'
    }
  });

  const modulesList = [
    { code: 'MOD_COMPANY', name: 'Company Management', icon: 'Building2', order: 1 },
    { code: 'MOD_SAAS', name: 'SaaS Platform & Subscription', icon: 'CreditCard', order: 2 },
    { code: 'MOD_ADMIN', name: 'Administration & Management', icon: 'ShieldCheck', order: 3 },
    { code: 'MOD_PRODUCT', name: 'Product & Material Management', icon: 'Package', order: 4 },
    { code: 'MOD_HR', name: 'HR & Employee Management', icon: 'Users', order: 5 },
    { code: 'MOD_CRM', name: 'Customer & Supplier Management', icon: 'Briefcase', order: 6 },
    { code: 'MOD_PROPERTY', name: 'Land & Building Management', icon: 'Landmark', order: 7 },
    { code: 'MOD_ASSETS', name: 'Assets & Maintenance', icon: 'Wrench', order: 8 },
    { code: 'MOD_PURCHASE', name: 'Purchase Management', icon: 'ShoppingCart', order: 9 },
    { code: 'MOD_INVENTORY', name: 'Inventory & Warehouse', icon: 'Boxes', order: 10 },
    { code: 'MOD_SALES', name: 'Sales Management', icon: 'TrendingUp', order: 11 },
    { code: 'MOD_ATTENDANCE', name: 'Attendance & Leave', icon: 'Clock', order: 12 },
    { code: 'MOD_MANUFACTURING', name: 'Production & Manufacturing', icon: 'Factory', order: 13 },
    { code: 'MOD_ACCOUNTING', name: 'Banking & Accounting', icon: 'Wallet', order: 14 },
    { code: 'MOD_PAYROLL', name: 'Payroll & Benefits', icon: 'BadgePercent', order: 15 },
    { code: 'MOD_COMPLIANCE', name: 'Licence & Compliance', icon: 'FileCheck', order: 16 },
    { code: 'MOD_STATUTORY', name: 'Government Integration & Statutory', icon: 'Scale', order: 17 },
    { code: 'MOD_INVESTMENT', name: 'Investment & Finance', icon: 'PiggyBank', order: 18 },
    { code: 'MOD_REPORTS', name: 'Reports & MIS', icon: 'BarChart3', order: 19 }
  ];

  for (const m of modulesList) {
    const createdMod = await (prisma as any).tbModule.upsert({
      where: { id: `20000000-0000-0000-0000-${String(m.order).padStart(12, '0')}` },
      update: {},
      create: {
        id: `20000000-0000-0000-0000-${String(m.order).padStart(12, '0')}`,
        category_id: categoryFoundation.id,
        module_code: m.code,
        module_name: m.name,
        description: `Full enterprise capabilities for ${m.name}`,
        icon_name: m.icon,
        display_order: m.order,
        is_selectable: true,
        is_active: true
      }
    });

    // Add pricing
    await (prisma as any).tbModulePrice.create({
      data: {
        module_id: createdMod.id,
        price_name: `${m.name} Standard Monthly`,
        billing_cycle: 'MONTHLY',
        currency_code: 'INR',
        fixed_amount: 1499.00,
        price_version: 1,
        is_active: true
      }
    }).catch(() => {});
  }
  console.log(`✅ Seeded all 19 approved ERP Modules & Pricing matrices`);

  // 3. Seed Demo Tenant & Owner
  const demoTenant = await (prisma as any).tbTenant.upsert({
    where: { id: '30000000-0000-0000-0000-000000000001' },
    update: {
      tenant_code: 'KAVIN-CORP',
      tenant_name: 'Kavin Global Enterprises Ltd',
    },
    create: {
      id: '30000000-0000-0000-0000-000000000001',
      tenant_code: 'KAVIN-CORP',
      tenant_name: 'Kavin Global Enterprises Ltd',
      account_status: 'ACTIVE',
      registration_source: 'ADMIN'
    }
  });

  const demoCompany = await (prisma as any).tbCompany.upsert({
    where: { id: '40000000-0000-0000-0000-000000000001' },
    update: {
      company_code: 'KAVIN-HQ',
      company_name: 'Kavin Industries Private Limited',
      legal_name: 'Kavin Industries Private Limited',
    },
    create: {
      id: '40000000-0000-0000-0000-000000000001',
      tenant_id: demoTenant.id,
      company_code: 'KAVIN-HQ',
      company_name: 'Kavin Industries Private Limited',
      legal_name: 'Kavin Industries Private Limited',
      business_type: 'Manufacturing & Export',
      ownership_type: 'Private Limited',
      pan_number: 'AAACK1234F',
      gstin: '33AAACK1234F1Z5',
      currency_code: 'INR',
      country_code: 'IN',
      company_status: 'ACTIVE'
    }
  });

  const demoBranch = await (prisma as any).tbCompanyBranch.upsert({
    where: { id: '50000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '50000000-0000-0000-0000-000000000001',
      tenant_id: demoTenant.id,
      name: 'Chennai Central Plant & HQ',
      description: 'Primary corporate office and industrial plant',
      status: 'ACTIVE'
    }
  });

  const demoUser = await (prisma as any).tbUser.upsert({
    where: { id: '60000000-0000-0000-0000-000000000001' },
    update: {
      username: 'kavin',
      full_name: 'Kavin',
      email: 'kavin@zuno.com',
    },
    create: {
      id: '60000000-0000-0000-0000-000000000001',
      tenant_id: demoTenant.id,
      username: 'kavin',
      full_name: 'Kavin',
      email: 'kavin@zuno.com',
      mobile: '+919876543210',
      user_type: 'OWNER',
      user_status: 'ACTIVE',
      email_verified: true,
      mobile_verified: true
    }
  });

  await (prisma as any).tbUserCredential.create({
    data: {
      user_id: demoUser.id,
      password_hash: passwordHash,
      failed_attempts: 0
    }
  }).catch(() => {});

  console.log('✅ Seeded Default Master Tenant: kavin / Kavin@987');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('Seeding error:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

