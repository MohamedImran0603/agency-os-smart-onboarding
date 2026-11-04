import { Test, TestingModule } from '@nestjs/testing';
import { SmartOnboardingService } from '../src/smart-onboarding/smart-onboarding.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { AgencyType } from '../src/smart-onboarding/dto';
import { BadRequestException } from '@nestjs/common';

describe('SmartOnboardingService', () => {
  let service: SmartOnboardingService;
  let prisma: any;

  const mockAgencyId = 'a1111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    prisma = {
      agency: {
        upsert: jest.fn().mockResolvedValue({ id: mockAgencyId, name: 'Acme Test' }),
      },
      agencyOnboarding: {
        findUnique: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
      },
      agencyServiceSelection: {
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        createMany: jest.fn().mockResolvedValue({ count: 2 }),
      },
      workspaceTemplate: {
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      agencyTemplateSelection: {
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        createMany: jest.fn().mockResolvedValue({ count: 2 }),
        findMany: jest.fn(),
      },
      generatedWorkspaceConfig: {
        createMany: jest.fn().mockResolvedValue({ count: 4 }),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback(prisma);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmartOnboardingService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SmartOnboardingService>(SmartOnboardingService);
  });

  describe('getOnboardingState', () => {
    it('creates a new record if none exists', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue(null);
      prisma.agencyOnboarding.create.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        status: 'IN_PROGRESS',
        currentStep: 1,
      });

      const result = await service.getOnboardingState(mockAgencyId);
      expect(prisma.agencyOnboarding.create).toHaveBeenCalled();
      expect(result.status).toEqual('IN_PROGRESS');
    });

    it('returns existing record when found', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        status: 'IN_PROGRESS',
        currentStep: 2,
      });

      const result = await service.getOnboardingState(mockAgencyId);
      expect(prisma.agencyOnboarding.create).not.toHaveBeenCalled();
      expect(result.currentStep).toBe(2);
    });
  });

  describe('saveProfile', () => {
    it('saves agency name and type, advancing currentStep', async () => {
      prisma.agencyOnboarding.upsert.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        agencyName: 'Updated Agency',
        agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
        currentStep: 2,
      });

      const result = await service.saveProfile(mockAgencyId, {
        agencyName: 'Updated Agency',
        agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
      });

      expect(prisma.agencyOnboarding.upsert).toHaveBeenCalled();
      expect(result.agencyName).toBe('Updated Agency');
      expect(result.currentStep).toBe(2);
    });
  });

  describe('saveServices', () => {
    it('replaces selections and advances step', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        currentStep: 2,
      });

      await service.saveServices(mockAgencyId, {
        services: ['Web Development', 'DevOps'],
      });

      expect(prisma.agencyServiceSelection.deleteMany).toHaveBeenCalled();
      expect(prisma.agencyServiceSelection.createMany).toHaveBeenCalledWith({
        data: [
          { agencyId: mockAgencyId, onboardingId: 'ob-1', serviceName: 'Web Development' },
          { agencyId: mockAgencyId, onboardingId: 'ob-1', serviceName: 'DevOps' },
        ],
      });
    });

    it('rejects empty services array', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        currentStep: 2,
      });

      await expect(
        service.saveServices(mockAgencyId, { services: [] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRecommendedTemplates', () => {
    it('throws PROFILE_REQUIRED if no profile is saved yet', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue(null);

      await expect(
        service.getRecommendedTemplates(mockAgencyId),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns SOFTWARE templates for SOFTWARE_DEVELOPMENT agency', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
      });
      prisma.workspaceTemplate.findMany.mockResolvedValue([
        { id: 't-1', name: 'Web App', agencyType: 'SOFTWARE_DEVELOPMENT' },
      ]);

      const result = await service.getRecommendedTemplates(mockAgencyId);
      expect(result).toHaveLength(1);
      expect(prisma.workspaceTemplate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        }),
      );
    });
  });

  describe('saveTemplateSelections', () => {
    it('rejects inactive or non-existent template IDs', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        currentStep: 3,
      });
      // Return 1 template when 2 were requested
      prisma.workspaceTemplate.findMany.mockResolvedValue([{ id: 't-1', isActive: true }]);

      await expect(
        service.saveTemplateSelections(mockAgencyId, {
          templateIds: ['t-1', 'non-existent-id'],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generatePreview', () => {
    it('returns preview data without writing to GeneratedWorkspaceConfig', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        agencyName: 'Acme Preview',
        agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
        templateSelections: [
          {
            template: {
              name: 'Web App',
              configurationData: {
                pipeline: { name: 'Dev Pipeline', stages: [] },
                taskChecklists: [{ title: 'Init', items: ['Task 1'] }],
              },
            },
          },
        ],
        serviceSelections: [{ serviceName: 'Web Dev' }],
      });

      const preview = await service.generatePreview(mockAgencyId);
      expect(preview.agencyName).toBe('Acme Preview');
      expect(preview.preview.totalPipelines).toBe(1);
      expect(prisma.generatedWorkspaceConfig.createMany).not.toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    it('provisions GeneratedWorkspaceConfig and marks status COMPLETED', async () => {
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        status: 'IN_PROGRESS',
        currentStep: 4,
        templateSelections: [
          {
            template: {
              id: 't-1',
              name: 'Template 1',
              agencyType: 'SOFTWARE_DEVELOPMENT',
              configurationData: {
                pipeline: { name: 'Pipeline 1', stages: [] },
              },
            },
          },
        ],
        serviceSelections: [{ serviceName: 'Web' }],
      });
      prisma.agencyOnboarding.update.mockResolvedValue({
        status: 'COMPLETED',
        activatedAt: new Date(),
      });
      prisma.generatedWorkspaceConfig.findMany.mockResolvedValue([
        { id: 'cfg-1', name: 'Pipeline 1' },
      ]);

      const res = await service.activate(mockAgencyId);
      expect(res.status).toBe('COMPLETED');
      expect(prisma.generatedWorkspaceConfig.createMany).toHaveBeenCalled();
    });

    it('is idempotent: returns existing config without re-creating if already COMPLETED', async () => {
      const existingConfigs = [{ id: 'cfg-existing', name: 'Pre-existing' }];
      prisma.agencyOnboarding.findUnique.mockResolvedValue({
        id: 'ob-1',
        agencyId: mockAgencyId,
        status: 'COMPLETED',
        activatedAt: new Date(),
        generatedConfigs: existingConfigs,
      });

      const res = await service.activate(mockAgencyId);
      expect(res.message).toBe('ONBOARDING_ALREADY_ACTIVATED');
      expect(prisma.generatedWorkspaceConfig.createMany).not.toHaveBeenCalled();
    });
  });
});

