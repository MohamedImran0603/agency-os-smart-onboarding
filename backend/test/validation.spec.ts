import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  SaveProfileDto,
  SaveServicesDto,
  SaveTemplatesDto,
  AgencyType,
} from '../src/smart-onboarding/dto';

describe('DTO Validation Rules', () => {
  it('rejects missing agencyType in SaveProfileDto', async () => {
    const raw = { agencyName: 'Valid Agency Name' };
    const dto = plainToInstance(SaveProfileDto, raw);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const agencyTypeError = errors.find((e) => e.property === 'agencyType');
    expect(agencyTypeError).toBeDefined();
  });

  it('rejects agencyName shorter than 2 characters in SaveProfileDto', async () => {
    const raw = { agencyName: 'A', agencyType: AgencyType.SOFTWARE_DEVELOPMENT };
    const dto = plainToInstance(SaveProfileDto, raw);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects empty services array in SaveServicesDto', async () => {
    const raw = { services: [] };
    const dto = plainToInstance(SaveServicesDto, raw);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const servicesError = errors.find((e) => e.property === 'services');
    expect(servicesError).toBeDefined();
  });

  it('rejects empty templateIds in SaveTemplatesDto', async () => {
    const raw = { templateIds: [] };
    const dto = plainToInstance(SaveTemplatesDto, raw);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const templateIdsError = errors.find((e) => e.property === 'templateIds');
    expect(templateIdsError).toBeDefined();
  });

  it('accepts valid SaveProfileDto', async () => {
    const raw = {
      agencyName: 'Valid Agency Name',
      agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
    };
    const dto = plainToInstance(SaveProfileDto, raw);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
