import { Test, TestingModule } from '@nestjs/testing';
import { SmartOnboardingService } from '../src/smart-onboarding/smart-onboarding.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Duplicate Activation & Idempotency Protection', () => {
  let service: SmartOnboardingService;
  let prisma: any;

  const mockAgencyId = 'a1111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    prisma = {
      agencyOnboarding: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      generatedWorkspaceConfig: {
        createMany: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmartOnboardingService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SmartOnboardingService>(SmartOnboardingService);
  });

  it('safely handles repeated activation calls idempotently without duplicate records', async () => {
    const existingConfigs = [
      { id: 'cfg-1', name: 'Web Pipeline', configType: 'PIPELINE' },
      { id: 'cfg-2', name: 'Web Tasks', configType: 'TASK' },
    ];

    // Simulate already-completed session
    prisma.agencyOnboarding.findUnique.mockResolvedValue({
      id: 'ob-1',
      agencyId: mockAgencyId,
      status: 'COMPLETED',
      currentStep: 7,
      activatedAt: new Date('2026-01-01T00:00:00Z'),
      generatedConfigs: existingConfigs,
    });

    const result = await service.activate(mockAgencyId);

    // Assert that the response explicitly signals already-activated state
    expect(result.message).toBe('ONBOARDING_ALREADY_ACTIVATED');
    expect(result.status).toBe('COMPLETED');
    expect(result.configs).toEqual(existingConfigs);

    // Verify database transaction / insertion was NOT invoked
    expect(prisma.generatedWorkspaceConfig.createMany).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
