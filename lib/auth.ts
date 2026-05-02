// TODO #11 — replace this entire file with real NextAuth session logic.
// Every Server Action calls getCurrentUserId() to scope data to the right user.
// Keeping it in one place means auth wiring is a single-file change.

// A fixed ID for the dev stub user. You need one User row in the DB with this
// ID before any board mutations will work locally. Create it via Prisma Studio
// (`npm run db:studio`) or a seed script.
export const STUB_USER_ID = "stub-user-id"

export async function getCurrentUserId(): Promise<string> {
  return STUB_USER_ID
}
