/// <reference types="next" />
/// <reference types="next/image-types/global" />

// ─── Ambient Type Declarations for Next.js & React ───────────────────────────
// Provides type definitions for Next.js App Router, React, and DOM JSX elements.

declare module 'next' {
  export interface Metadata {
    title?: string | { template?: string; default?: string };
    description?: string;
    metadataBase?: URL;
    [key: string]: any;
  }
}

declare module 'next/font/google' {
  export function Inter(options?: any): {
    className: string;
    variable: string;
    style: { fontFamily: string };
  };
}

declare module 'next/navigation' {
  export function redirect(url: string): never;
  export function useRouter(): {
    push(url: string): void;
    replace(url: string): void;
    back(): void;
    forward(): void;
    refresh(): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

declare module 'next/link' {
  import type React from 'react';
  const Link: React.FC<{
    href: string;
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }>;
  export default Link;
}

declare namespace React {
  type ReactNode =
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactElement
    | React.ReactNodeArray;

  interface ReactElement<P = any, T = any> {
    type: T;
    props: P;
    key: string | number | null;
  }

  interface ReactNodeArray extends Array<ReactNode> {}

  type FC<P = {}> = (props: P) => ReactElement | null;

  interface ButtonHTMLAttributes<T> {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: (event: any) => void;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }

  interface InputHTMLAttributes<T> {
    type?: string;
    value?: string | number | readonly string[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    className?: string;
    onChange?: (event: any) => void;
    onBlur?: (event: any) => void;
    [key: string]: any;
  }

  interface HTMLAttributes<T> {
    className?: string;
    children?: ReactNode;
    onClick?: (event: any) => void;
    title?: string;
    style?: any;
    id?: string;
    [key: string]: any;
  }

  interface FormEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
  }

  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;

  const Fragment: FC<{ children?: ReactNode }>;
}

declare module 'react' {
  export = React;
  export as namespace React;
}

declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass {}
  interface ElementAttributesProperty {
    props: {};
  }
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
