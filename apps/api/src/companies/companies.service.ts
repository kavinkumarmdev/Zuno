import { Injectable, NotFoundException } from '@nestjs/common';
import { NeonPrismaService } from '../database/neon-prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: NeonPrismaService) {}

  async getCompanies(tenantId: string) {
    return (this.prisma as any).tbCompany.findMany({
      where: { tenant_id: tenantId, is_active: true }
    });
  }

  async getCompanyById(tenantId: string, companyId: string) {
    const company = await (this.prisma as any).tbCompany.findFirst({
      where: { id: companyId, tenant_id: tenantId }
    });
    if (!company) throw new NotFoundException('Company not found');

    const branches = await (this.prisma as any).tbCompanyBranch.findMany({
      where: { tenant_id: tenantId, is_active: true }
    });

    const addresses = await (this.prisma as any).tbCompanyAddress.findMany({
      where: { tenant_id: tenantId, company_id: companyId }
    });

    const contacts = await (this.prisma as any).tbCompanyContact.findMany({
      where: { tenant_id: tenantId, company_id: companyId }
    });

    const financialYears = await (this.prisma as any).tbCompanyFinancialYear.findMany({
      where: { tenant_id: tenantId }
    });

    return {
      company,
      branches,
      addresses,
      contacts,
      financialYears
    };
  }

  async createCompany(tenantId: string, userId: string, data: any) {
    return (this.prisma as any).tbCompany.create({
      data: {
        tenant_id: tenantId,
        company_code: data.companyCode,
        company_name: data.companyName,
        legal_name: data.legalName || data.companyName,
        business_type: data.businessType || 'General Enterprise',
        ownership_type: data.ownershipType || 'Private Limited',
        pan_number: data.panNumber,
        tan_number: data.tanNumber,
        gstin: data.gstin,
        currency_code: data.currencyCode || 'INR',
        country_code: data.countryCode || 'IN',
        company_status: 'ACTIVE',
        created_by: userId
      }
    });
  }

  async getBranches(tenantId: string) {
    return (this.prisma as any).tbCompanyBranch.findMany({
      where: { tenant_id: tenantId, is_active: true }
    });
  }

  async createBranch(tenantId: string, userId: string, data: any) {
    return (this.prisma as any).tbCompanyBranch.create({
      data: {
        tenant_id: tenantId,
        name: data.name,
        description: data.description,
        status: data.status || 'ACTIVE',
        created_by: userId
      }
    });
  }
}

