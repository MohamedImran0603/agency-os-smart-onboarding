import { Test, TestingModule } from '@nestjs/testing';
import { SmartOnboardingController } from '../src/smart-onboarding/smart-onboarding.controller';
import { SmartOnboardingService } from '../src/smart-onboarding/smart-onboarding.service';
import { AgencyType } from '../src/smart-onboarding/dto';

describe('SmartOnboardingController', () => {
  let controller: SmartOnboardingController;
  let service: any;

  const mockAgencyId = 'a1111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    service = {
      getOnboardingState: jest.fn().mockResolvedValue({ id: 'ob-1', agencyId: mockAgencyId }),
      saveProfile: jest.fn().mockResolvedValue({ id: 'ob-1', agencyName: 'Acme' }),
      saveServices: jest.fn().mockResolvedValue({ id: 'ob-1', services: ['Web'] }),
      getRecommendedTemplates: jest.fn().mockResolvedValue([]),
      saveTemplateSelections: jest.fn().mockResolvedValue({ id: 'ob-1' }),
      generatePreview: jest.fn().mockResolvedValue({ preview: {} }),
      activate: jest.fn().mockResolvedValue({ status: 'COMPLETED' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartOnboardingController],
      providers: [
        {
          provide: SmartOnboardingService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<SmartOnboardingController>(SmartOnboardingController);
  });

  it('delegates getOnboardingState passing extracted agencyId', async () => {
    await controller.getOnboardingState(mockAgencyId);
    expect(service.getOnboardingState).toHaveBeenCalledWith(mockAgencyId);
  });

  it('delegates saveProfile passing agencyId and DTO', async () => {
    const dto = {
      agencyName: 'Acme Digital',
      agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
    };
    await controller.saveProfile(mockAgencyId, dto);
    expect(service.saveProfile).toHaveBeenCalledWith(mockAgencyId, dto);
  });

  it('delegates saveServices passing agencyId and DTO', async () => {
    const dto = { services: ['SEO', 'Content'] };
    await controller.saveServices(mockAgencyId, dto);
    expect(service.saveServices).toHaveBeenCalledWith(mockAgencyId, dto);
  });

  it('delegates getRecommendedTemplates with agencyId', async () => {
    await controller.getRecommendedTemplates(mockAgencyId);
    expect(service.getRecommendedTemplates).toHaveBeenCalledWith(mockAgencyId);
  });

  it('delegates activate with agencyId', async () => {
    await controller.activate(mockAgencyId, {});
    expect(service.activate).toHaveBeenCalledWith(mockAgencyId);
  });
});

