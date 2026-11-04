import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SmartOnboardingService } from './smart-onboarding.service';
import { AgencyContextGuard } from '../common';

@ApiTags('templates')
@ApiSecurity('agency-context')
@UseGuards(AgencyContextGuard)
@Controller('templates')
export class TemplatesController {
  constructor(
    private readonly smartOnboardingService: SmartOnboardingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all active WorkspaceTemplates for template management demo view' })
  @ApiResponse({ status: 200, description: 'All active workspace templates returned' })
  async listAllTemplates() {
    return this.smartOnboardingService.listAllActiveTemplates();
  }
}
