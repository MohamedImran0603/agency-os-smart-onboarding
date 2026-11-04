import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SmartOnboardingService } from './smart-onboarding.service';
import {
  SaveProfileDto,
  SaveServicesDto,
  SaveTemplatesDto,
  ActivateOnboardingDto,
} from './dto';
import { AgencyContextGuard, AgencyId } from '../common';

@ApiTags('smart-onboarding')
@ApiSecurity('agency-context')
@UseGuards(AgencyContextGuard)
@Controller('onboarding')
export class SmartOnboardingController {
  constructor(
    private readonly smartOnboardingService: SmartOnboardingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve or initialize current onboarding state' })
  @ApiResponse({ status: 200, description: 'Current onboarding state returned' })
  async getOnboardingState(@AgencyId() agencyId: string) {
    return this.smartOnboardingService.getOnboardingState(agencyId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Save agency profile (name & type) and advance to step 2' })
  @ApiResponse({ status: 200, description: 'Profile saved successfully' })
  async saveProfile(
    @AgencyId() agencyId: string,
    @Body() dto: SaveProfileDto,
  ) {
    return this.smartOnboardingService.saveProfile(agencyId, dto);
  }

  @Put('services')
  @ApiOperation({ summary: 'Save selected services and advance to step 3' })
  @ApiResponse({ status: 200, description: 'Services saved successfully' })
  async saveServices(
    @AgencyId() agencyId: string,
    @Body() dto: SaveServicesDto,
  ) {
    return this.smartOnboardingService.saveServices(agencyId, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get deterministic recommended workspace templates for agency' })
  @ApiResponse({ status: 200, description: 'Recommended templates returned' })
  async getRecommendedTemplates(@AgencyId() agencyId: string) {
    return this.smartOnboardingService.getRecommendedTemplates(agencyId);
  }

  @Put('templates')
  @ApiOperation({ summary: 'Save template selections and advance to step 4' })
  @ApiResponse({ status: 200, description: 'Template selections saved successfully' })
  async saveTemplateSelections(
    @AgencyId() agencyId: string,
    @Body() dto: SaveTemplatesDto,
  ) {
    return this.smartOnboardingService.saveTemplateSelections(agencyId, dto);
  }

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate preview of workspace structures without database writes' })
  @ApiResponse({ status: 200, description: 'Preview generated successfully' })
  async generatePreview(@AgencyId() agencyId: string) {
    return this.smartOnboardingService.generatePreview(agencyId);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Provision and activate entire workspace configuration (Idempotent)' })
  @ApiResponse({ status: 200, description: 'Workspace activated successfully' })
  async activate(
    @AgencyId() agencyId: string,
    @Body() _dto: ActivateOnboardingDto,
  ) {
    return this.smartOnboardingService.activate(agencyId);
  }
}
