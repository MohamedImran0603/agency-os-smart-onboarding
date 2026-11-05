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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SmartOnboardingService } from './smart-onboarding.service';
import { AgencyType } from './dto';

export class CreateAgencyDto {
  name: string;
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
