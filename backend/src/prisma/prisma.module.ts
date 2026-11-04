// ─── Prisma Module ─────────────────────────────────────────────────────────────
// Declared as @Global() so every feature module can inject PrismaService
// without importing PrismaModule in each one.

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
