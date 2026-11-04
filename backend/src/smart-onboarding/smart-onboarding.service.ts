// ─── Smart Onboarding Service ──────────────────────────────────────────────────
// Encapsulates all business logic for the smart onboarding wizard.
// Adheres strictly to tenant-scoping by agencyId.

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgencyOnboardingDto, AgencyTypeEnum, SelectServicesDto, SelectTemplatesDto } from './dto';

@Injectable()
export class SmartOnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List active workspace templates, optionally filtered by agencyType or universal templates.
   */
  async getTemplates(agencyType?: AgencyTypeEnum) {
    if (agencyType) {
      return this.prisma.workspaceTemplate.findMany({
        where: {
          isActive: true,
          OR: [
            { agencyType: agencyType as any },
            { agencyType: null },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
    }

    return this.prisma.workspaceTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Initialize or retrieve an existing onboarding profile for an agency.
   */
  async createOrGetOnboarding(dto: CreateAgencyOnboardingDto) {
    // Verify agency exists
    const agency = await this.prisma.agency.findUnique({
      where: { id: dto.agencyId },
    });
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${dto.agencyId} not found.`);
    }

    return this.prisma.agencyOnboarding.upsert({
      where: { agencyId: dto.agencyId },
      update: {
        agencyName: dto.agencyName,
        agencyType: dto.agencyType as any,
      },
      create: {
        agencyId: dto.agencyId,
        agencyName: dto.agencyName,
        agencyType: dto.agencyType as any,
        currentStep: 1,
        status: 'IN_PROGRESS' as any,
      },
      include: {
        serviceSelections: true,
        templateSelections: {
          include: { template: true },
        },
      },
    });
  }

  /**
   * Retrieve onboarding record and current step for an agency.
   */
  async getOnboardingByAgency(agencyId: string) {
    const onboarding = await this.prisma.agencyOnboarding.findUnique({
      where: { agencyId },
      include: {
        serviceSelections: true,
        templateSelections: {
          include: { template: true },
        },
        generatedConfigs: true,
      },
    });

    if (!onboarding) {
      throw new NotFoundException(`Onboarding session for agency ID ${agencyId} not found.`);
    }

    return onboarding;
  }

  /**
   * Update active step number.
   */
  async updateStep(agencyId: string, step: number) {
    await this.getOnboardingByAgency(agencyId);
    return this.prisma.agencyOnboarding.update({
      where: { agencyId },
      data: { currentStep: step },
    });
  }

  /**
   * Save selected services for the agency onboarding session.
   */
  async saveServices(agencyId: string, dto: SelectServicesDto) {
    const onboarding = await this.getOnboardingByAgency(agencyId);

    // Replace previous selections in transaction
    return this.prisma.$transaction(async (tx) => {
      await tx.agencyServiceSelection.deleteMany({
        where: { onboardingId: onboarding.id },
      });

      const records = dto.serviceNames.map((serviceName) => ({
        agencyId,
        onboardingId: onboarding.id,
        serviceName,
      }));

      await tx.agencyServiceSelection.createMany({
        data: records,
      });

      return tx.agencyServiceSelection.findMany({
        where: { onboardingId: onboarding.id },
      });
    });
  }

  /**
   * Save selected workspace templates for the agency onboarding session.
   */
  async saveTemplates(agencyId: string, dto: SelectTemplatesDto) {
    const onboarding = await this.getOnboardingByAgency(agencyId);

    // Verify templates exist
    const templates = await this.prisma.workspaceTemplate.findMany({
      where: { id: { in: dto.templateIds } },
    });

    if (templates.length !== dto.templateIds.length) {
      throw new BadRequestException('One or more selected template IDs are invalid.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.agencyTemplateSelection.deleteMany({
        where: { onboardingId: onboarding.id },
      });

      const records = dto.templateIds.map((templateId) => ({
        agencyId,
        onboardingId: onboarding.id,
        templateId,
      }));

      await tx.agencyTemplateSelection.createMany({
        data: records,
      });

      return tx.agencyTemplateSelection.findMany({
        where: { onboardingId: onboarding.id },
        include: { template: true },
      });
    });
  }

  /**
   * Confirm onboarding selection and auto-generate workspace configurations.
   */
  async confirmAndGenerateWorkspace(agencyId: string) {
    const onboarding = await this.getOnboardingByAgency(agencyId);

    if (onboarding.status === ('COMPLETED' as any)) {
      return {
        message: 'Workspace was already configured and completed.',
        status: onboarding.status,
        activatedAt: onboarding.activatedAt,
        configsCount: onboarding.generatedConfigs?.length || 0,
      };
    }

    const selections = await this.prisma.agencyTemplateSelection.findMany({
      where: { onboardingId: onboarding.id },
      include: { template: true },
    });

    if (selections.length === 0) {
      throw new BadRequestException('Cannot confirm onboarding without at least one selected template.');
    }

    // Auto-generate configurations for each selected template
    return this.prisma.$transaction(async (tx) => {
      for (const sel of selections) {
        const configData = sel.template.configurationData as Record<string, any>;

        // 1. Pipeline Config
        if (configData.pipeline) {
          await tx.generatedWorkspaceConfig.create({
            data: {
              agencyId,
              onboardingId: onboarding.id,
              configType: 'PIPELINE',
              name: `${sel.template.name} - Pipeline`,
              configData: configData.pipeline,
              sourceTemplateId: sel.template.id,
            },
          });
        }

        // 2. Task Checklist Config
        if (configData.taskChecklists) {
          await tx.generatedWorkspaceConfig.create({
            data: {
              agencyId,
              onboardingId: onboarding.id,
              configType: 'TASK',
              name: `${sel.template.name} - Checklists`,
              configData: configData.taskChecklists,
              sourceTemplateId: sel.template.id,
            },
          });
        }
      }

      // Mark onboarding completed and record activation timestamp
      const updatedOnboarding = await tx.agencyOnboarding.update({
        where: { agencyId },
        data: {
          status: 'COMPLETED' as any,
          currentStep: 4,
          activatedAt: new Date(),
        },
      });

      const totalConfigs = await tx.generatedWorkspaceConfig.count({
        where: { agencyId },
      });

      return {
        message: 'Workspace generated successfully.',
        status: updatedOnboarding.status,
        activatedAt: updatedOnboarding.activatedAt,
        configsCount: totalConfigs,
      };
    });
  }
}
