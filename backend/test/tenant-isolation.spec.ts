import { Test, TestingModule } from '@nestjs/testing';
import { SmartOnboardingService } from '../src/smart-onboarding/smart-onboarding.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { AgencyType } from '../src/smart-onboarding/dto';

describe('Tenant Isolation Verification', () => {
  let service: SmartOnboardingService;
  let prisma: any;

  const agencyA = 'tenant-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const agencyB = 'tenant-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  beforeEach(async () => {
    prisma = {
      agency: {
        upsert: jest.fn().mockImplementation(({ where }) => ({ id: where.id, name: 'Tenant' })),
      },
      agencyOnboarding: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.agencyId === agencyA) {
            return {
              id: 'ob-a',
              agencyId: agencyA,
              agencyName: 'Agency A Corp',
              agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
              currentStep: 4,
            };
          }
          if (where.agencyId === agencyB) {
            return {
              id: 'ob-b',
              agencyId: agencyB,
              agencyName: 'Agency B LLC',
              agencyType: AgencyType.DIGITAL_MARKETING,
              currentStep: 1,
            };
          }
          return null;
        }),
      },
      agencyServiceSelection: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      agencyTemplateSelection: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      workspaceTemplate: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      $transaction: jest.fn().mockImplementation(async (cb) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmartOnboardingService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SmartOnboardingService>(SmartOnboardingService);
  });

  it('ensures Agency B sees its own state and cannot view Agency A state', async () => {
    const stateB = await service.getOnboardingState(agencyB);
    expect(stateB.agencyId).toBe(agencyB);
    expect(stateB.agencyName).toBe('Agency B LLC');
    expect(stateB.agencyId).not.toBe(agencyA);
  });

  it('rejects cross-tenant record tampering', async () => {
    // Attempting to invoke service with mismatched record
    const mismatchedRecord = { agencyId: agencyA };
    expect(() => {
      (service as any).assertAgencyOwnership(mismatchedRecord, agencyB);
    }).toThrow(ForbiddenException);
  });
});
