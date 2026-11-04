import { IsString, IsNotEmpty, IsEnum, IsUUID, IsInt, Min, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AgencyTypeEnum {
  SOFTWARE_DEVELOPMENT = 'SOFTWARE_DEVELOPMENT',
  DIGITAL_MARKETING = 'DIGITAL_MARKETING',
  HYBRID = 'HYBRID',
}

export class CreateAgencyOnboardingDto {
  @ApiProperty({ description: 'Explicit Agency ID (UUID)', example: 'a0000000-0000-0000-0000-000000000001' })
  @IsUUID()
  @IsNotEmpty()
  agencyId: string;

  @ApiProperty({ description: 'Legal / brand name of the agency', example: 'Apex Digital Labs' })
  @IsString()
  @IsNotEmpty()
  agencyName: string;

  @ApiProperty({ enum: AgencyTypeEnum, description: 'Primary business archetype of the agency' })
  @IsEnum(AgencyTypeEnum)
  @IsNotEmpty()
  agencyType: AgencyTypeEnum;
}

export class UpdateOnboardingStepDto {
  @ApiProperty({ description: 'Current active wizard step number', example: 2 })
  @IsInt()
  @Min(1)
  currentStep: number;
}

export class SelectServicesDto {
  @ApiProperty({ description: 'List of services selected by the agency', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  serviceNames: string[];
}

export class SelectTemplatesDto {
  @ApiProperty({ description: 'List of template IDs selected by the agency', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  templateIds: string[];
}
