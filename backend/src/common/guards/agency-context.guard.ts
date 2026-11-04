import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

// Extend Express Request interface to include agencyId
declare module 'express' {
  interface Request {
    agencyId?: string;
  }
}

/**
 * AgencyContextGuard
 *
 * Reads "x-agency-id" header and attaches it as request.agencyId.
 * Throws 401 Unauthorized if the header is missing or empty.
 *
 * Architecture Note:
 * For standalone demo, this extracts the tenant context from the header.
 * When integrating with the full Agency OS, this guard can be replaced in one line
 * by inheriting from standard Passport JWT guard:
 *   extends AuthGuard('jwt') { handleRequest(err, user) { return user.agencyId; } }
 */
@Injectable()
export class AgencyContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const agencyIdHeader = request.headers['x-agency-id'];

    if (!agencyIdHeader || typeof agencyIdHeader !== 'string' || agencyIdHeader.trim() === '') {
      throw new UnauthorizedException({
        success: false,
        message: 'Missing or invalid "x-agency-id" authentication header.',
        code: 'MISSING_AGENCY_CONTEXT',
      });
    }

    request.agencyId = agencyIdHeader.trim();
    return true;
  }
}
