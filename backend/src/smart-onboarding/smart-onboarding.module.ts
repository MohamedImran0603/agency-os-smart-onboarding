import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SmartOnboardingController } from './smart-onboarding.controller';
import { TemplatesController } from './templates.controller';
import { SmartOnboardingService } from './smart-onboarding.service';
import { AgencyContextGuard } from '../common';

@Module({
  imports: [PrismaModule],
  controllers: [SmartOnboardingController, TemplatesController],
  providers: [SmartOnboardingService, AgencyContextGuard],
  exports: [SmartOnboardingService],
})
export class SmartOnboardingModule {}
