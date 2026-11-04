import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal error occurred.';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        code = this.deriveStableCode(status);
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || exception.message || message;
        code = resObj.code || this.deriveStableCode(status);
        if (Array.isArray(resObj.message)) {
          // Validation pipe errors
          message = resObj.message.join('; ');
          code = 'VALIDATION_ERROR';
          details = { validationErrors: resObj.message };
        } else if (resObj.details) {
          details = resObj.details;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);

      // Check Prisma or DB errors safely without leaking internal schema
      if (exception.name.includes('Prisma') || exception.message.includes('Prisma')) {
        message = 'A database constraint violation occurred.';
        code = 'DATABASE_ERROR';
      }
    }

    response.status(status).json({
      success: false,
      message,
      code,
      details,
    });
  }

  private deriveStableCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}

