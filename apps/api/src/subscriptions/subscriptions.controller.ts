import { Controller, Get, Post, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/require-permission.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload, BillingCycle } from '@zuno/shared-types';

@ApiTags('Subscriptions & Modules')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Public()
  @Get('catalogue')
  @ApiOperation({ summary: 'Get entire SaaS module & submodule catalogue with pricing' })
  async getCatalogue() {
    return this.subscriptionsService.getCatalogue();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('current')
  @ApiOperation({ summary: 'Get active subscription, active modules, and recent invoices' })
  async getCurrent(@CurrentTenant() tenantId: string) {
    return this.subscriptionsService.getCurrentSubscription(tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('check-access/:moduleCode')
  @ApiOperation({ summary: 'Verify if current tenant is entitled to use specified module' })
  async checkAccess(
    @CurrentTenant() tenantId: string,
    @Param('moduleCode') moduleCode: string
  ) {
    const isEntitled = await this.subscriptionsService.checkModuleEntitlement(tenantId, moduleCode);
    return { moduleCode, isEntitled };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @ApiOperation({ summary: 'Create checkout session to purchase or upgrade modules' })
  async createCheckout(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: { moduleCodes: string[]; billingCycle: BillingCycle; companyId?: string }
  ) {
    return this.subscriptionsService.createSubscriptionCheckout(
      tenantId,
      body.companyId || user.companyId || tenantId,
      body.moduleCodes,
      body.billingCycle || BillingCycle.MONTHLY
    );
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Idempotent payment gateway webhook endpoint' })
  async handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: any
  ) {
    const eventId = body.event_id || body.id || 'evt_' + Date.now();
    const paymentId = body.payload?.payment?.entity?.id || body.paymentId;
    const status = body.event === 'payment.captured' ? 'captured' : body.status || 'success';
    return this.subscriptionsService.processPaymentWebhook(eventId, paymentId, status, signature || 'mock_sig');
  }
}

