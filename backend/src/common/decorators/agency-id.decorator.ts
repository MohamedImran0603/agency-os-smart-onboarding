import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Parameter decorator to extract the tenant agencyId injected by AgencyContextGuard.
 * Ensures controllers never read agencyId from the request body.
 */
export const AgencyId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.agencyId as string;
  },
);

