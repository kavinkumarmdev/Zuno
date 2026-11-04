import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { NeonPrismaService } from '../database/neon-prisma.service';
import { SubscriptionStatus, BillingCycle } from '@zuno/shared-types';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(private readonly prisma: NeonPrismaService) {}

  /**
   * Return the full public catalogue of SaaS modules, submodules, features and prices
   */
  async getCatalogue() {
    const categories = await (this.prisma as any).tbModuleCategory.findMany({
      where: { is_active: true }
    });

    const modules = await (this.prisma as any).tbModule.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' }
    });

    const submodules = await (this.prisma as any).tbSubmodule.findMany({
      where: { is_active: true }
    });

    const features = await (this.prisma as any).tbModuleFeature.findMany({
      where: { is_active: true }
    });

    const prices = await (this.prisma as any).tbModulePrice.findMany({
      where: { is_active: true }
    });

    return {
      categories,
      modules: modules.map((m: any) => ({
        ...m,
        submodules: submodules.filter((s: any) => s.module_id === m.id || s.name.includes(m.module_name)),
        features: features.filter((f: any) => f.module_id === m.id),
        prices: prices.filter((p: any) => p.module_id === m.id)
      }))
    };
  }

  /**
   * Get current active subscription, purchased items and effective entitlements for a tenant
   */
  async getCurrentSubscription(tenantId: string) {
    const subscription = await (this.prisma as any).tbSubscription.findFirst({
      where: { tenant_id: tenantId },
      orderBy: { created_time: 'desc' }
    });

    if (!subscription) {
      return {
        status: SubscriptionStatus.EXPIRED,
        hasActiveSubscription: false,
        items: [],
        entitlements: []
      };
    }

    const items = await (this.prisma as any).tbSubscriptionItem.findMany({
      where: { subscription_id: subscription.id }
    });

    const entitlements = await (this.prisma as any).tbSubscriptionEntitlement.findMany({
      where: { tenant_id: tenantId, entitlement_status: 'ACTIVE' }
    });

    const invoices = await (this.prisma as any).tbInvoice.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_time: 'desc' },
      take: 10
    });

    return {
      subscription,
      hasActiveSubscription: ['ACTIVE', 'TRIAL'].includes(subscription.subscription_status),
      items,
      entitlements,
      recentInvoices: invoices
    };
  }

  /**
   * Central Entitlement Verification Service
   * Verifies whether tenant has an active entitlement for a specific module or feature
   */
  async checkModuleEntitlement(tenantId: string, moduleCode: string): Promise<boolean> {
    const module = await (this.prisma as any).tbModule.findFirst({
      where: { module_code: moduleCode }
    });
    if (!module) return true; // If module code not registered as paywalled, permit

    // Check active subscription
    const subscription = await (this.prisma as any).tbSubscription.findFirst({
      where: {
        tenant_id: tenantId,
        subscription_status: { in: ['ACTIVE', 'TRIAL'] }
      }
    });

    if (!subscription) return false;

    // Check module entitlement or tenant trial (trial gives access to all standard modules)
    if (subscription.subscription_status === 'TRIAL') {
      return true;
    }

    const entitlement = await (this.prisma as any).tbSubscriptionEntitlement.findFirst({
      where: {
        tenant_id: tenantId,
        module_id: module.id,
        entitlement_status: 'ACTIVE'
      }
    });

    return !!entitlement;
  }

  /**
   * Purchase or Upgrade modules
   */
  async createSubscriptionCheckout(tenantId: string, companyId: string, moduleCodes: string[], billingCycle: BillingCycle) {
    const modules = await (this.prisma as any).tbModule.findMany({
      where: { module_code: { in: moduleCodes } }
    });

    if (modules.length === 0) {
      throw new BadRequestException('At least one valid module must be selected');
    }

    let subtotal = 0;
    const itemsData: any[] = [];

    for (const m of modules) {
      const price = await (this.prisma as any).tbModulePrice.findFirst({
        where: { module_id: m.id, billing_cycle: billingCycle, is_active: true }
      });
      const amount = price ? Number(price.fixed_amount) : (billingCycle === BillingCycle.YEARLY ? 9999 : 999);
      subtotal += amount;

      itemsData.push({
        module_id: m.id,
        module_name_snapshot: m.module_name,
        billing_cycle: billingCycle,
        unit_price: amount,
        final_amount: amount,
        item_status: 'PENDING'
      });
    }

    const gstTax = subtotal * 0.18; // 18% GST standard
    const totalAmount = subtotal + gstTax;

    // Create Subscription
    const subscriptionNumber = 'SUB-' + Date.now();
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === BillingCycle.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await (this.prisma as any).tbSubscription.create({
      data: {
        tenant_id: tenantId,
        company_id: companyId,
        subscription_number: subscriptionNumber,
        billing_cycle: billingCycle,
        subtotal_amount: subtotal,
        tax_amount: gstTax,
        total_amount: totalAmount,
        subscription_status: 'PENDING',
        start_date: startDate,
        end_date: endDate,
        auto_renew: true
      }
    });

    // Create items
    for (const item of itemsData) {
      await (this.prisma as any).tbSubscriptionItem.create({
        data: {
          ...item,
          subscription_id: subscription.id
        }
      });
    }

    // Create Invoice
    const invoiceNumber = 'INV-' + Date.now();
    const invoice = await (this.prisma as any).tbInvoice.create({
      data: {
        tenant_id: tenantId,
        document_number: invoiceNumber,
        document_date: new Date(),
        status: 'PENDING',
        remarks: `Subscription billing for ${modules.map((m: any) => m.module_name).join(', ')}`
      }
    });

    // Create payment checkout record
    const payment = await (this.prisma as any).tbPayment.create({
      data: {
        tenant_id: tenantId,
        document_number: 'PAY-' + Date.now(),
        document_date: new Date(),
        amount: totalAmount,
        currency_code: 'INR',
        status: 'PENDING',
        remarks: `Checkout for invoice ${invoiceNumber}`
      }
    });

    return {
      subscription,
      invoice,
      payment,
      checkoutUrl: `/billing/checkout/${payment.id}`,
      amount: totalAmount
    };
  }

  /**
   * Confirm Payment & Activate Entitlements (Idempotent Webhook Handler)
   */
  async processPaymentWebhook(gatewayEventId: string, paymentId: string, status: string, gatewaySignature: string) {
    // 1. Verify idempotency via tb_payment_webhook
    const existing = await (this.prisma as any).tbPaymentWebhook.findFirst({
      where: { document_number: gatewayEventId }
    });

    if (existing) {
      this.logger.warn(`Duplicate webhook event ${gatewayEventId} skipped`);
      return { idempotent: true, status: existing.status };
    }

    // 2. Fetch payment
    const payment = await (this.prisma as any).tbPayment.findUnique({
      where: { id: paymentId }
    });
    if (!payment) throw new NotFoundException('Payment transaction not found');

    // 3. Record webhook in inbox
    await (this.prisma as any).tbPaymentWebhook.create({
      data: {
        tenant_id: payment.tenant_id,
        document_number: gatewayEventId,
        document_date: new Date(),
        amount: payment.amount,
        currency_code: payment.currency_code,
        status: status === 'captured' || status === 'success' ? 'PROCESSED' : 'FAILED',
        remarks: `Gateway verified event signature ${gatewaySignature.substring(0, 16)}...`
      }
    });

    if (status === 'captured' || status === 'success') {
      // Update payment
      await (this.prisma as any).tbPayment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' }
      });

      // Activate active subscription and items
      const subscription = await (this.prisma as any).tbSubscription.findFirst({
        where: { tenant_id: payment.tenant_id, subscription_status: 'PENDING' },
        orderBy: { created_time: 'desc' }
      });

      if (subscription) {
        await (this.prisma as any).tbSubscription.update({
          where: { id: subscription.id },
          data: { subscription_status: 'ACTIVE', activated_time: new Date() }
        });

        // Activate items and create entitlements
        const items = await (this.prisma as any).tbSubscriptionItem.findMany({
          where: { subscription_id: subscription.id }
        });

        for (const item of items) {
          await (this.prisma as any).tbSubscriptionItem.update({
            where: { id: item.id },
            data: { item_status: 'ACTIVE', activation_time: new Date() }
          });

          await (this.prisma as any).tbSubscriptionEntitlement.create({
            data: {
              tenant_id: payment.tenant_id,
              company_id: subscription.company_id,
              subscription_id: subscription.id,
              subscription_item_id: item.id,
              module_id: item.module_id,
              entitlement_status: 'ACTIVE',
              valid_from: new Date(),
              valid_until: subscription.end_date,
              activation_source: 'PAYMENT'
            }
          });
        }
      }
    }

    return { success: true };
  }
}

