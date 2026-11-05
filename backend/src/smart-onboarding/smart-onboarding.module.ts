import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SmartOnboardingController } from './smart-onboarding.controller';
import { TemplatesController } from './templates.controller';
import { AgenciesController } from './agencies.controller';
import { SmartOnboardingService } from './smart-onboarding.service';
import { AgencyContextGuard } from '../common';

@Module({
  imports: [PrismaModule],
  controllers: [SmartOnboardingController, TemplatesController, AgenciesController],
  providers: [SmartOnboardingService, AgencyContextGuard],
  exports: [SmartOnboardingService],
})
export class SmartOnboardingModule {}
