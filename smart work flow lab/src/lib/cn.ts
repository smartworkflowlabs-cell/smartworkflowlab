import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names, resolving Tailwind conflicts (e.g. `cn('p-2', cond && 'p-4')`
 * keeps only `p-4` when `cond` is true instead of leaving both in the DOM).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
