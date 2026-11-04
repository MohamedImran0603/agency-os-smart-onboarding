declare module '@nestjs/testing' {
  export const Test: {
    createTestingModule(metadata: any): {
      compile(): Promise<{
        get<T>(token: any): T;
      }>;
    };
  };
  export type TestingModule = any;
}

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => any) => void;
declare const beforeEach: (fn: () => any) => void;
declare const afterEach: (fn: () => any) => void;
declare const expect: (actual: any) => any;
declare const jest: any;

