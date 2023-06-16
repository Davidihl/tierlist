import { cache } from 'react';
import { sql } from './connect';

export type Player = {
  id: number;
  userId: number;
  alias: string;
  firstName: string;
  lastName: string;
  contact: string;
  slug: string;
  mainaccountId: number;
};

export const getAllPlayers = cache(async () => {
  const players = await sql<Player[]>`
    SELECT
     id,
     user_id,
     alias,
     first_name,
     last_name,
     contact,
     slug,
     mainaccount_id

    FROM
      players
 `;
  return players;
});

export const getPlayerById = cache(async (id: number) => {
  const [player] = await sql<Player[]>`
    SELECT
     id,
     user_id,
     alias,
     first_name,
     last_name,
     contact,
     slug,
     mainaccount_id
    FROM
      players
    WHERE
      id = ${id}
 `;
  return player;
});
