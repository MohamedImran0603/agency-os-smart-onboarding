// ─── Utility Functions ─────────────────────────────────────────────────────────
// Pure helper functions shared across the frontend.

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names, handling conflicts intelligently.
 * Uses clsx for conditional logic and tailwind-merge for deduplication.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-brand-500', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO 8601 date string into a human-readable format.
 */
export function formatDate(iso: string, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * Capitalises the first character of a string.
 */
export function capitalise(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a snake_case or SCREAMING_SNAKE_CASE string to Title Case.
 *
 * @example
 * toTitleCase('DIGITAL_MARKETING') // → 'Digital Marketing'
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Delays execution for a given number of milliseconds.
 * Useful for simulating async operations in development.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
