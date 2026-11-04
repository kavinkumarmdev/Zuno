import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BusinessModulesService } from './business-modules.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload, PaginationParams } from '@zuno/shared-types';

@ApiTags('Business Modules & Tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules')
export class BusinessModulesController {
  constructor(private readonly modulesService: BusinessModulesService) {}

  @Get('data/:tableName')
  @ApiOperation({ summary: 'Query records from any approved catalogue table with pagination and tenant isolation' })
  @ApiParam({ name: 'tableName', description: 'Approved catalogue table name (e.g. tb_product_master, tb_purchase_order)' })
  async listRecords(
    @CurrentTenant() tenantId: string,
    @Param('tableName') tableName: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.modulesService.listRecords(tenantId, tableName, {
      page,
      limit,
      search,
      sortBy,
      sortOrder
    });
  }

  @Get('data/:tableName/:id')
  @ApiOperation({ summary: 'Get single record from approved catalogue table' })
  async getRecord(
    @CurrentTenant() tenantId: string,
    @Param('tableName') tableName: string,
    @Param('id') id: string
  ) {
    return this.modulesService.getRecordById(tenantId, tableName, id);
  }

  @Post('data/:tableName')
  @ApiOperation({ summary: 'Create a new record in the specified catalogue table' })
  async createRecord(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Param('tableName') tableName: string,
    @Body() body: any
  ) {
    return this.modulesService.createRecord(tenantId, user.sub, tableName, body);
  }

  @Patch('data/:tableName/:id')
  @ApiOperation({ summary: 'Update an existing record in the specified catalogue table' })
  async updateRecord(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Param('tableName') tableName: string,
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.modulesService.updateRecord(tenantId, user.sub, tableName, id, body);
  }

  @Delete('data/:tableName/:id')
  @ApiOperation({ summary: 'Soft-delete a record in the specified catalogue table' })
  async deleteRecord(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Param('tableName') tableName: string,
    @Param('id') id: string
  ) {
    return this.modulesService.deleteRecord(tenantId, user.sub, tableName, id);
  }
}

