import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { SmartOnboardingService } from './smart-onboarding.service';
import { AgencyType } from './dto';

export class CreateAgencyDto {
  @ApiProperty({
    description: 'Name of the agency workspace',
    example: 'Acme Digitals',
    minLength: 2,
  })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  @MinLength(2, { message: 'name must be at least 2 characters long' })
  name: string;

  @ApiPropertyOptional({
    enum: AgencyType,
    description: 'Operating archetype of the agency',
    example: AgencyType.SOFTWARE_DEVELOPMENT,
  })
  @IsOptional()
  @IsEnum(AgencyType, {
    message: 'agencyType must be one of: SOFTWARE_DEVELOPMENT, DIGITAL_MARKETING, HYBRID',
  })
  agencyType?: AgencyType;
}

@ApiTags('agencies (Demo Helpers — beyond core module scope)')
@Controller('agencies')
export class AgenciesController {
  constructor(private readonly service: SmartOnboardingService) {}

  @Get()
  @ApiOperation({ summary: 'List all agencies and demo profiles (Demo helper — beyond core module scope)' })
  @ApiResponse({ status: 200, description: 'Agencies list returned' })
  async listAgencies() {
    return this.service.listAgencies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single agency profile (Demo helper — beyond core module scope)' })
  async getAgency(@Param('id') id: string) {
    return this.service.getAgencyById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new agency demo profile (Demo helper — beyond core module scope)' })
  async createAgency(@Body() body: CreateAgencyDto) {
    return this.service.createAgency(body.name, body.agencyType);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agency profile and its tenant data (Demo helper — beyond core module scope)' })
  async deleteAgency(@Param('id') id: string) {
    return this.service.deleteAgency(id);
  }
}
