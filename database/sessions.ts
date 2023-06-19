import { cache } from 'react';
import { sql } from './connect';

export type Session = {
  id: number;
  token: string;
  userId: number;
  // csrfSecret: string;
};

// Housekeeping, delete expired sessions
export const deleteExpiredSessions = cache(async () => {
  await sql`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < now()
  `;
});

// Create a new session. Is called, if login function was called successfull
export const createSession = cache(
  async (token: string, userId: number /* , csrfSecret: string */) => {
    const [session] = await sql<{ id: number; token: string }[]>`
      INSERT INTO sessions
        (token, user_id/* , csrf_secret */)
      VALUES
        (${token}, ${userId})
      RETURNING
        id,
        token
    `;

    await deleteExpiredSessions();

    return session;
  },
);

// Delete session on logout
export const deleteSessionByToken = cache(async (token: string) => {
  const [session] = await sql<{ id: number; token: string }[]>`
    DELETE FROM
      sessions
    WHERE
      sessions.token = ${token}
    RETURNING
      id,
      token
  `;

  return session;
});

// Check if session is valid (existing and not expired)
export const getValidSessionByToken = cache(async (token: string) => {
  const [session] = await sql<Session[]>`
    SELECT
      sessions.id,
      sessions.token,
      sessions.user_id
    FROM
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
  `;

  return session;
});
