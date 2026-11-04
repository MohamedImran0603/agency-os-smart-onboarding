// ─── Smart Onboarding Controller ──────────────────────────────────────────────
// REST endpoint handlers for the smart onboarding wizard.

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SmartOnboardingService } from './smart-onboarding.service';
import {
  CreateAgencyOnboardingDto,
  UpdateOnboardingStepDto,
  SelectServicesDto,
  SelectTemplatesDto,
  AgencyTypeEnum,
} from './dto';

@ApiTags('smart-onboarding')
@Controller('smart-onboarding')
export class SmartOnboardingController {
  constructor(
    private readonly smartOnboardingService: SmartOnboardingService,
  ) {}

  @Get('templates')
  @ApiOperation({ summary: 'List available workspace templates filtered by agency type' })
  @ApiQuery({ name: 'agencyType', enum: AgencyTypeEnum, required: false })
  @ApiResponse({ status: 200, description: 'Workspace templates returned successfully' })
  async getTemplates(@Query('agencyType') agencyType?: AgencyTypeEnum) {
    return this.smartOnboardingService.getTemplates(agencyType);
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Initialize or retrieve onboarding session for an agency' })
  @ApiResponse({ status: 201, description: 'Onboarding session initialized' })
  async createSession(@Body() dto: CreateAgencyOnboardingDto) {
    return this.smartOnboardingService.createOrGetOnboarding(dto);
  }

  @Get('sessions/:agencyId')
  @ApiOperation({ summary: 'Get current onboarding state and progress for an agency' })
  @ApiResponse({ status: 200, description: 'Onboarding state returned' })
  async getSession(@Param('agencyId') agencyId: string) {
    return this.smartOnboardingService.getOnboardingByAgency(agencyId);
  }

  @Patch('sessions/:agencyId/step')
  @ApiOperation({ summary: 'Update active wizard step number' })
  @ApiResponse({ status: 200, description: 'Step updated successfully' })
  async updateStep(
    @Param('agencyId') agencyId: string,
    @Body() dto: UpdateOnboardingStepDto,
  ) {
    return this.smartOnboardingService.updateStep(agencyId, dto.currentStep);
  }

  @Post('sessions/:agencyId/services')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save service selections for an agency onboarding session' })
  @ApiResponse({ status: 200, description: 'Services saved successfully' })
  async saveServices(
    @Param('agencyId') agencyId: string,
    @Body() dto: SelectServicesDto,
  ) {
    return this.smartOnboardingService.saveServices(agencyId, dto);
  }

  @Post('sessions/:agencyId/templates')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save template selections for an agency onboarding session' })
  @ApiResponse({ status: 200, description: 'Templates saved successfully' })
  async saveTemplates(
    @Param('agencyId') agencyId: string,
    @Body() dto: SelectTemplatesDto,
  ) {
    return this.smartOnboardingService.saveTemplates(agencyId, dto);
  }

  @Post('sessions/:agencyId/confirm')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Confirm onboarding and auto-generate workspace configurations' })
  @ApiResponse({ status: 201, description: 'Workspace generated and onboarding completed' })
  async confirmWorkspace(@Param('agencyId') agencyId: string) {
    return this.smartOnboardingService.confirmAndGenerateWorkspace(agencyId);
  }
}
