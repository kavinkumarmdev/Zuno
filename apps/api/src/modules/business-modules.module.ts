import { Module } from '@nestjs/common';
import { BusinessModulesService } from './business-modules.service';
import { BusinessModulesController } from './business-modules.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  controllers: [BusinessModulesController],
  providers: [BusinessModulesService],
  exports: [BusinessModulesService],
})
export class BusinessModulesModule {}

