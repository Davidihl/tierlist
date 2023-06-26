import { cache } from 'react';
import LeagueAccount from '../components/LeagueAccount';
import { encodeString } from '../util/encodeString';
import { sql } from './connect';

export type Player = {
  id: number;
  userId: number;
  alias: string;
  firstName: string | null;
  lastName: string | null;
  contact: string | null;
  slug: string;
  mainaccountId: number | null;
};

export type PlayerInput = {
  userId: number;
  alias: string;
  firstName: string | null;
  lastName: string | null;
  contact: string | null;
};

export type MainAccountId = {
  mainaccountId: number | null;
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

export const getPlayerBySlug = cache(async (slug: string) => {
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
      slug = ${slug}
 `;
  return player;
});

export const getPlayerByUserId = cache(async (id: number) => {
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
      user_id = ${id}
 `;
  return player;
});

export const createPlayer = cache(
  async (
    userId: number,
    alias: string,
    firstName: string | null,
    lastName: string | null,
    contact: string | null,
  ) => {
    const [player] = await sql<Player[]>`
    INSERT INTO players
      (user_id, alias, first_name, last_name, contact, slug)
    VALUES
      (${userId}, ${alias}, ${firstName}, ${lastName}, ${contact}, ${encodeString(
      alias,
    ).toLowerCase()})
    RETURNING
    *
    `;

    return player;
  },
);

export const getLeagueMainAccountIdByPlayerId = cache(async (id: number) => {
  const leagueAccountId = sql<MainAccountId[]>`
  SELECT
    mainaccount_id
  FROM
    players
  WHERE
    id = ${id}
  `;

  return leagueAccountId;
});

export const setLeagueMainAccount = cache(
  async (LeagueAccountId: number, playerId: number) => {
    const updatedPlayer = await sql<Player[]>`
  UPDATE
    players
  SET
    mainaccount_id = ${LeagueAccountId}
  WHERE
    id = ${playerId}
  RETURNING
     id,
     user_id,
     alias,
     first_name,
     last_name,
     contact,
     slug,
     mainaccount_id
  `;

    return updatedPlayer;
  },
);
