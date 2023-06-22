import { cache } from 'react';
import { sql } from './connect';
import { Organisation } from './organisations';
import { Player } from './players';

export type Session = {
  id: number;
  token: string;
  userId: number;
  // csrfSecret: string;
};

export type Token = {
  token: string;
};

export type Slug = {
  slug: string;
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

// Get slug from token
export const getSlugFromToken = cache(async (userId: number) => {
  const [player] = await sql<Player[]>`
    SELECT
      *
    FROM
      players
    WHERE
      user_id = ${userId}`;

  if (!player) {
    const [organisation] = await sql<Organisation[]>`
    SELECT
      *
    FROM
      organisations
    WHERE
      user_id = ${userId}`;

    if (!organisation) {
      throw new Error('404: No context for user in session');
    }

    const organisationSlug = { slug: organisation.slug };

    return organisationSlug;
  }

  const playerSlug = { slug: player.slug };
  return playerSlug;
});
