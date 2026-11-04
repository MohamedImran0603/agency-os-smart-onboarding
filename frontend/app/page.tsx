// ─── Root Page ────────────────────────────────────────────────────────────────
// Redirects authenticated users to their dashboard and unauthenticated users
// to the smart-onboarding wizard. Populated with real auth logic in Phase 3.

import { redirect } from 'next/navigation';

/**
 * Root route — performs a server-side redirect.
 * Replace the target with the dashboard route once auth is wired.
 */
export default function RootPage(): never {
  redirect('/smart-onboarding');
}
