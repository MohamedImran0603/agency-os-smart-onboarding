// ─── Ambient Type Declarations for NestJS & Prisma ────────────────────────────
// Provides fallback type definitions for IDE and TypeScript resolution.

declare module '@nestjs/common' {
  export const Injectable: () => ClassDecorator;
  export const Module: (metadata: any) => ClassDecorator;
  export const Controller: (prefix?: string) => ClassDecorator;
  export const Get: (path?: string) => MethodDecorator;
  export const Post: (path?: string) => MethodDecorator;
  export const Put: (path?: string) => MethodDecorator;
  export const Patch: (path?: string) => MethodDecorator;
  export const Delete: (path?: string) => MethodDecorator;
  export const Body: (property?: string) => ParameterDecorator;
  export const Param: (property?: string) => ParameterDecorator;
  export const Query: (property?: string) => ParameterDecorator;
  export const UseGuards: (...guards: any[]) => MethodDecorator & ClassDecorator;
  export const UseInterceptors: (...interceptors: any[]) => MethodDecorator & ClassDecorator;
  export const UseFilters: (...filters: any[]) => MethodDecorator & ClassDecorator;
  export const Catch: (...exceptions: any[]) => ClassDecorator;
  export const Global: () => ClassDecorator;
  export const HttpCode: (statusCode: number) => MethodDecorator;
  export const ValidationPipe: any;
  export const HttpStatus: {
    OK: number;
    CREATED: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    CONFLICT: number;
    UNPROCESSABLE_ENTITY: number;
    INTERNAL_SERVER_ERROR: number;
  };
  export class HttpException extends Error {
    constructor(response: string | Record<string, any>, status: number);
    getStatus(): number;
    getResponse(): string | Record<string, any>;
  }
  export class BadRequestException extends HttpException {}
  export class UnauthorizedException extends HttpException {}
  export class ForbiddenException extends HttpException {}
  export class NotFoundException extends HttpException {}
  export class ConflictException extends HttpException {}
  export class Logger {
    constructor(context?: string);
    log(message: any, context?: string): void;
    error(message: any, trace?: string, context?: string): void;
    warn(message: any, context?: string): void;
  }
  export interface CanActivate {
    canActivate(context: any): boolean | Promise<boolean>;
  }
  export interface ExecutionContext {
    switchToHttp(): any;
    getHandler(): any;
    getClass(): any;
  }
  export interface ExceptionFilter<T = any> {
    catch(exception: T, host: any): void;
  }
  export interface ArgumentsHost {
    switchToHttp(): any;
  }
  export interface NestInterceptor<T = any, R = any> {
    intercept(context: ExecutionContext, next: any): any;
  }
  export interface CallHandler<T = any> {
    handle(): any;
  }
  export const createParamDecorator: (factory: any) => any;
}

declare module '@nestjs/core' {
  export const NestFactory: {
    create(module: any, options?: any): Promise<any>;
  };
}

declare module '@nestjs/swagger' {
  export const ApiTags: (name: string) => ClassDecorator;
  export const ApiOperation: (options: any) => MethodDecorator;
  export const ApiResponse: (options: any) => MethodDecorator;
  export const ApiSecurity: (name: string) => ClassDecorator & MethodDecorator;
  export const ApiQuery: (options: any) => MethodDecorator;
  export const ApiProperty: (options?: any) => PropertyDecorator;
  export class DocumentBuilder {
    setTitle(title: string): this;
    setDescription(description: string): this;
    setVersion(version: string): this;
    addApiKey(options: any, name: string): this;
    addBearerAuth(): this;
    build(): any;
  }
  export const SwaggerModule: {
    createDocument(app: any, config: any): any;
    setup(path: string, app: any, document: any): void;
  };
}

declare module '@prisma/client' {
  export enum AgencyType {
    SOFTWARE_DEVELOPMENT = 'SOFTWARE_DEVELOPMENT',
    DIGITAL_MARKETING = 'DIGITAL_MARKETING',
    HYBRID = 'HYBRID',
  }
  export enum OnboardingStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
  }
  export class PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction(fn: any): Promise<any>;
    [key: string]: any;
  }
}

declare module 'class-validator' {
  export function IsString(options?: any): PropertyDecorator;
  export function IsNotEmpty(options?: any): PropertyDecorator;
  export function IsEnum(entity: any, options?: any): PropertyDecorator;
  export function MinLength(min: number, options?: any): PropertyDecorator;
  export function IsArray(options?: any): PropertyDecorator;
  export function ArrayNotEmpty(options?: any): PropertyDecorator;
  export function ArrayMinSize(min: number, options?: any): PropertyDecorator;
  export function IsUUID(version?: any, options?: any): PropertyDecorator;
  export function IsInt(options?: any): PropertyDecorator;
  export function Min(min: number, options?: any): PropertyDecorator;
  export function validate(object: any, options?: any): Promise<any[]>;
}

declare module 'class-transformer' {
  export function plainToInstance<T, V>(cls: new (...args: any[]) => T, plain: V, options?: any): T;
}

declare module 'rxjs' {
  export class Observable<T> {
    pipe(...operations: any[]): Observable<any>;
  }
}

declare module 'rxjs/operators' {
  export function map<T, R>(project: (value: T, index: number) => R): any;
}

declare module 'express' {
  export interface Request {
    headers: Record<string, any>;
    agencyId?: string;
    [key: string]: any;
  }
  export interface Response {
    status(code: number): this;
    json(body: any): this;
  }
}

