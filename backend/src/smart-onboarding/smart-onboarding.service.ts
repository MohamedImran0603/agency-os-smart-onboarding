import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SaveProfileDto,
  SaveServicesDto,
  SaveTemplatesDto,
  AgencyType,
} from './dto';

@Injectable()
export class SmartOnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper asserting tenant ownership. Throws ForbiddenException if mismatched.
   */
  private assertAgencyOwnership(
    record: { agencyId: string },
    agencyId: string,
  ): void {
    if (record.agencyId !== agencyId) {
      throw new ForbiddenException({
        success: false,
        message: 'Access denied: Tenant agency mismatch.',
        code: 'FORBIDDEN_TENANT_ACCESS',
      });
    }
  }

  /**
   * 1. Get Onboarding State
   * Retrieves active onboarding record or creates a fresh IN_PROGRESS session.
   */
  async getOnboardingState(agencyId: string) {
    let onboarding = await this.prisma.agencyOnboarding.findUnique({
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
      // Ensure agency exists in stub/database
      await this.prisma.agency.upsert({
        where: { id: agencyId },
        update: {},
        create: {
          id: agencyId,
          name: 'New Agency',
        },
      });

      onboarding = await this.prisma.agencyOnboarding.create({
        data: {
          agencyId,
          agencyName: 'New Agency',
          agencyType: 'SOFTWARE_DEVELOPMENT' as any,
          status: 'IN_PROGRESS' as any,
          currentStep: 1,
        },
        include: {
          serviceSelections: true,
          templateSelections: {
            include: { template: true },
          },
          generatedConfigs: true,
        },
      });
    }

    return onboarding;
  }

  /**
   * 2. Save Profile
   * Upserts the AgencyOnboarding record and advances currentStep to 2.
   */
  async saveProfile(agencyId: string, dto: SaveProfileDto) {
    // Ensure parent agency record is updated/synced
    await this.prisma.agency.upsert({
      where: { id: agencyId },
      update: { name: dto.agencyName },
      create: {
        id: agencyId,
        name: dto.agencyName,
      },
    });

    const onboarding = await this.prisma.agencyOnboarding.upsert({
      where: { agencyId },
      update: {
        agencyName: dto.agencyName,
        agencyType: dto.agencyType as any,
        currentStep: Math.max(2, (await this.getStep(agencyId)) || 2),
      },
      create: {
        agencyId,
        agencyName: dto.agencyName,
        agencyType: dto.agencyType as any,
        currentStep: 2,
        status: 'IN_PROGRESS' as any,
      },
      include: {
        serviceSelections: true,
        templateSelections: {
          include: { template: true },
        },
      },
    });

    return onboarding;
  }

  /**
   * 3. Save Services
   * Replaces AgencyServiceSelection records and advances currentStep to 3.
   */
  async saveServices(agencyId: string, dto: SaveServicesDto) {
    const onboarding = await this.getOnboardingState(agencyId);
    this.assertAgencyOwnership(onboarding, agencyId);

    if (!dto.services || dto.services.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'At least one service must be selected.',
        code: 'VALIDATION_ERROR',
      });
    }

    await this.prisma.$transaction(async (tx) => {
      // Delete existing selections for this onboarding session
      await tx.agencyServiceSelection.deleteMany({
        where: { onboardingId: onboarding.id, agencyId },
      });

      // Insert new selections
      await tx.agencyServiceSelection.createMany({
        data: dto.services.map((serviceName) => ({
          agencyId,
          onboardingId: onboarding.id,
          serviceName,
        })),
      });

      // Advance step
      await tx.agencyOnboarding.update({
        where: { agencyId },
        data: { currentStep: Math.max(3, onboarding.currentStep) },
      });
    });

    return this.getOnboardingState(agencyId);
  }

  /**
   * 4. Get Recommended Templates
   * Deterministic match: returns templates matching agencyType OR hybrid (null/HYBRID).
   */
  async getRecommendedTemplates(agencyId: string) {
    const onboarding = await this.prisma.agencyOnboarding.findUnique({
      where: { agencyId },
    });

    if (!onboarding || !onboarding.agencyType) {
      throw new BadRequestException({
        success: false,
        message: 'Agency profile must be saved before templates can be recommended.',
        code: 'PROFILE_REQUIRED',
      });
    }

    const type = onboarding.agencyType as AgencyType;

    let whereClause: any = { isActive: true };

    if (type === AgencyType.HYBRID) {
      // Hybrid receives all active templates
      whereClause = { isActive: true };
    } else {
      // Matching specific type or cross-functional (null or HYBRID)
      whereClause = {
        isActive: true,
        OR: [
          { agencyType: type as any },
          { agencyType: AgencyType.HYBRID as any },
          { agencyType: null },
        ],
      };
    }

    const templates = await this.prisma.workspaceTemplate.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    return templates;
  }

  /**
   * 5. Save Template Selections
   * Validates template active status and replaces selections, advancing currentStep to 4.
   */
  async saveTemplateSelections(agencyId: string, dto: SaveTemplatesDto) {
    const onboarding = await this.getOnboardingState(agencyId);
    this.assertAgencyOwnership(onboarding, agencyId);

    if (!dto.templateIds || dto.templateIds.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'At least one template must be selected.',
        code: 'VALIDATION_ERROR',
      });
    }

    // Verify all templates exist and are active
    const activeTemplates = await this.prisma.workspaceTemplate.findMany({
      where: {
        id: { in: dto.templateIds },
        isActive: true,
      },
    });

    if (activeTemplates.length !== dto.templateIds.length) {
      throw new BadRequestException({
        success: false,
        message: 'One or more selected template IDs do not exist or are inactive.',
        code: 'INVALID_TEMPLATE_SELECTION',
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.agencyTemplateSelection.deleteMany({
        where: { onboardingId: onboarding.id, agencyId },
      });

      await tx.agencyTemplateSelection.createMany({
        data: dto.templateIds.map((templateId) => ({
          agencyId,
          onboardingId: onboarding.id,
          templateId,
        })),
      });

      await tx.agencyOnboarding.update({
        where: { agencyId },
        data: { currentStep: Math.max(4, onboarding.currentStep) },
      });
    });

    return this.getOnboardingState(agencyId);
  }

  /**
   * 6. Generate Preview
   * Computes what WOULD be generated. Read-only: does NOT write to database.
   */
  async generatePreview(agencyId: string) {
    const onboarding = await this.prisma.agencyOnboarding.findUnique({
      where: { agencyId },
      include: {
        templateSelections: {
          include: { template: true },
        },
        serviceSelections: true,
      },
    });

    if (!onboarding) {
      throw new BadRequestException({
        success: false,
        message: 'Onboarding profile not found.',
        code: 'PROFILE_REQUIRED',
      });
    }

    const templates = onboarding.templateSelections.map((ts) => ts.template);

    const pipelines: Array<{ name: string; stages: any[]; sourceTemplate: string }> = [];
    const taskChecklists: Array<{ title: string; items: string[]; sourceTemplate: string }> = [];
    const projectTemplates: Array<{ name: string; category: string; defaultRoles: string[] }> = [];
    const marketingWorkflows: Array<{ name: string; details: any }> = [];

    for (const t of templates) {
      const config = t.configurationData as Record<string, any>;

      if (config.pipeline) {
        pipelines.push({
          name: config.pipeline.name || `${t.name} Pipeline`,
          stages: config.pipeline.stages || [],
          sourceTemplate: t.name,
        });
      }

      if (Array.isArray(config.taskChecklists)) {
        for (const ch of config.taskChecklists) {
          taskChecklists.push({
            title: ch.title,
            items: ch.items || [],
            sourceTemplate: t.name,
          });
        }
      }

      if (config.defaultRoles) {
        projectTemplates.push({
          name: `${t.name} Workspace Structure`,
          category: t.category,
          defaultRoles: config.defaultRoles,
        });
      }

      if (t.agencyType === ('DIGITAL_MARKETING' as any) || t.category?.includes('MARKETING')) {
        marketingWorkflows.push({
          name: `${t.name} Campaign Automation`,
          details: config.pipeline?.stages || [],
        });
      }
    }

    return {
      agencyName: onboarding.agencyName,
      agencyType: onboarding.agencyType,
      selectedServices: onboarding.serviceSelections.map((s) => s.serviceName),
      preview: {
        totalPipelines: pipelines.length,
        totalTaskChecklists: taskChecklists.length,
        totalProjectTemplates: projectTemplates.length,
        pipelines,
        taskChecklists,
        projectTemplates,
        marketingWorkflows,
      },
    };
  }

  /**
   * 7. Activate Onboarding
   * Idempotent: returns existing configs if already COMPLETED.
   * Otherwise provisions GeneratedWorkspaceConfig in a single transaction.
   */
  async activate(agencyId: string) {
    const onboarding = await this.prisma.agencyOnboarding.findUnique({
      where: { agencyId },
      include: {
        templateSelections: {
          include: { template: true },
        },
        serviceSelections: true,
        generatedConfigs: true,
      },
    });

    if (!onboarding) {
      throw new BadRequestException({
        success: false,
        message: 'Onboarding profile required before activation.',
        code: 'PROFILE_REQUIRED',
      });
    }

    // Idempotency check: if COMPLETED already, return existing config without creating duplicates
    if (onboarding.status === ('COMPLETED' as any)) {
      return {
        message: 'ONBOARDING_ALREADY_ACTIVATED',
        status: 'COMPLETED',
        activatedAt: onboarding.activatedAt,
        configs: onboarding.generatedConfigs,
      };
    }

    if (onboarding.currentStep < 4) {
      throw new BadRequestException({
        success: false,
        message: 'Onboarding wizard must complete profile, services, and templates before activation.',
        code: 'ONBOARDING_INCOMPLETE',
      });
    }

    if (onboarding.templateSelections.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'At least one workspace template must be selected to activate.',
        code: 'INVALID_TEMPLATE_SELECTION',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const generatedConfigsData: any[] = [];

      for (const sel of onboarding.templateSelections) {
        const t = sel.template;
        const config = t.configurationData as Record<string, any>;

        // 1. Pipeline Config
        if (config.pipeline) {
          generatedConfigsData.push({
            agencyId,
            onboardingId: onboarding.id,
            configType: 'PIPELINE',
            name: `${t.name} Pipeline`,
            configData: config.pipeline,
            sourceTemplateId: t.id,
          });
        }

        // 2. Project Structure Config
        if (config.defaultRoles) {
          generatedConfigsData.push({
            agencyId,
            onboardingId: onboarding.id,
            configType: 'PROJECT',
            name: `${t.name} Project Architecture`,
            configData: { defaultRoles: config.defaultRoles, category: t.category },
            sourceTemplateId: t.id,
          });
        }

        // 3. Task Checklist Config
        if (config.taskChecklists) {
          generatedConfigsData.push({
            agencyId,
            onboardingId: onboarding.id,
            configType: 'TASK',
            name: `${t.name} Task Checklists`,
            configData: config.taskChecklists,
            sourceTemplateId: t.id,
          });
        }

        // 4. Marketing Workflow Config (if marketing or hybrid)
        if (t.agencyType === ('DIGITAL_MARKETING' as any) || t.agencyType === ('HYBRID' as any)) {
          generatedConfigsData.push({
            agencyId,
            onboardingId: onboarding.id,
            configType: 'MARKETING_WORKFLOW',
            name: `${t.name} Marketing Workflow`,
            configData: config.pipeline || {},
            sourceTemplateId: t.id,
          });
        }
      }

      await tx.generatedWorkspaceConfig.createMany({
        data: generatedConfigsData,
      });

      const updatedOnboarding = await tx.agencyOnboarding.update({
        where: { agencyId },
        data: {
          status: 'COMPLETED' as any,
          currentStep: 7,
          activatedAt: new Date(),
        },
      });

      const allConfigs = await tx.generatedWorkspaceConfig.findMany({
        where: { agencyId },
      });

      return {
        message: 'Workspace successfully provisioned and activated.',
        status: updatedOnboarding.status,
        activatedAt: updatedOnboarding.activatedAt,
        configs: allConfigs,
      };
    });
  }

  /**
   * 8. List All Active Templates
   * For the template management demo view (`GET /api/templates`).
   */
  async listAllActiveTemplates() {
    return this.prisma.workspaceTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Template Deletion Safety:
   * Never hard delete a template used in a GeneratedWorkspaceConfig. Deactivate instead.
   */
  async safeDeleteTemplate(templateId: string) {
    const usages = await this.prisma.generatedWorkspaceConfig.count({
      where: { sourceTemplateId: templateId },
    });

    if (usages > 0) {
      // Soft-delete / deactivate to preserve historical integrity
      return this.prisma.workspaceTemplate.update({
        where: { id: templateId },
        data: { isActive: false },
      });
    }

    return this.prisma.workspaceTemplate.delete({
      where: { id: templateId },
    });
  }

  private async getStep(agencyId: string): Promise<number | null> {
    const ob = await this.prisma.agencyOnboarding.findUnique({
      where: { agencyId },
      select: { currentStep: true },
    });
    return ob ? ob.currentStep : null;
  }

  /**
   * 8. List All Agency Profiles & Demos
   * Returns all agencies with their onboarding progression and generated configs.
   */
  async listAgencies() {
    return this.prisma.agency.findMany({
      include: {
        onboardings: {
          include: {
            serviceSelections: true,
            templateSelections: {
              include: { template: true },
            },
            generatedConfigs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 9. Get Single Agency Profile
   */
  async getAgencyById(id: string) {
    const agency = await this.prisma.agency.findUnique({
      where: { id },
      include: {
        onboardings: {
          include: {
            serviceSelections: true,
            templateSelections: {
              include: { template: true },
            },
            generatedConfigs: true,
          },
        },
      },
    });
    if (!agency) {
      throw new NotFoundException({
        success: false,
        message: `Agency with ID '${id}' not found.`,
      });
    }
    return agency;
  }

  /**
   * 10. Create New Agency Profile Demo
   */
  async createAgency(name: string, agencyType: AgencyType = AgencyType.SOFTWARE_DEVELOPMENT) {
    const trimmedName = name?.trim();
    if (!trimmedName || trimmedName.length < 2) {
      throw new BadRequestException({
        success: false,
        message: 'Agency name must be at least 2 characters long.',
      });
    }

    const agency = await this.prisma.agency.create({
      data: {
        name: trimmedName,
        onboardings: {
          create: {
            agencyName: trimmedName,
            agencyType: agencyType as any,
            status: 'IN_PROGRESS' as any,
            currentStep: 1,
          },
        },
      },
      include: {
        onboardings: {
          include: {
            serviceSelections: true,
            templateSelections: {
              include: { template: true },
            },
            generatedConfigs: true,
          },
        },
      },
    });

    return agency;
  }

  /**
   * 11. Delete Agency Profile
   */
  async deleteAgency(id: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.generatedWorkspaceConfig.deleteMany({ where: { agencyId: id } });
      await tx.agencyTemplateSelection.deleteMany({ where: { agencyId: id } });
      await tx.agencyServiceSelection.deleteMany({ where: { agencyId: id } });
      await tx.agencyOnboarding.deleteMany({ where: { agencyId: id } });
      await tx.agency.delete({ where: { id } });
    });
    return { success: true, message: `Agency '${id}' deleted successfully.` };
  }
}
