import {
  IsString,
  IsNotEmpty,
  IsEnum,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AgencyType {
  SOFTWARE_DEVELOPMENT = 'SOFTWARE_DEVELOPMENT',
  DIGITAL_MARKETING = 'DIGITAL_MARKETING',
  HYBRID = 'HYBRID',
}

export class SaveProfileDto {
  @ApiProperty({
    description: 'Legal / brand name of the agency',
    example: 'Apex Digital Labs',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'agencyName must be at least 2 characters long' })
  agencyName: string;

  @ApiProperty({
    enum: AgencyType,
    description: 'Business archetype of the agency',
    example: AgencyType.SOFTWARE_DEVELOPMENT,
  })
  @IsEnum(AgencyType, {
    message: 'agencyType must be one of: SOFTWARE_DEVELOPMENT, DIGITAL_MARKETING, HYBRID',
  })
  @IsNotEmpty()
  agencyType: AgencyType;
}

export class SaveServicesDto {
  @ApiProperty({
    description: 'Array of services selected for this agency (minimum 1 item)',
    type: [String],
    example: ['Web Application Development', 'SaaS Product Architecture'],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'services array must not be empty' })
  @ArrayMinSize(1, { message: 'At least one service must be selected' })
  @IsString({ each: true, message: 'Each service name must be a string' })
  services: string[];
}

export class SaveTemplatesDto {
  @ApiProperty({
    description: 'Array of workspace template IDs to provision (minimum 1 item)',
    type: [String],
    example: ['t0000000-0000-0000-0000-000000000001'],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'templateIds array must not be empty' })
  @ArrayMinSize(1, { message: 'At least one template ID must be selected' })
  @IsString({ each: true, message: 'Each template ID must be a string' })
  templateIds: string[];
}

export class ActivateOnboardingDto {
  // Empty DTO — activation executes purely using the saved state in the database
}
