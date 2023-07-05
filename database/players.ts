import { cache } from 'react';
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
      players.*
    FROM
      players
    LEFT JOIN
      league_accounts
    ON
      players.mainaccount_id = league_accounts.id
    ORDER BY
      league_accounts.tier ASC,
      league_accounts.rank ASC,
      league_accounts.league_points ASC
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
    ORDER BY
      id
 `;
  return player;
});

export const getPlayerByAlias = cache(async (alias: string) => {
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
      alias = ${alias}
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
  const leagueAccountId = await sql<MainAccountId[]>`
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

export const updatePlayer = cache(
  async (
    playerId: number,
    alias: string,
    firstName: string,
    lastName: string,
    contact: string,
  ) => {
    const [player] = await sql<Player[]>`
    UPDATE
      players
    SET
      alias = ${alias}, first_name=${firstName}, last_name=${lastName}, contact = ${contact}, slug = ${encodeString(
      alias,
    ).toLowerCase()}
    WHERE
        id = ${playerId}
  RETURNING
  *`;

    return player;
  },
);

export const removeMainAccountByPlayerId = cache(async (playerId: number) => {
  const [player] = await sql<Player[]>`
    UPDATE
      players
    SET
      mainaccount_id = null
    WHERE
        id = ${playerId}
  RETURNING
  *`;

  return player;
});

export const deletePlayerByPlayerId = cache(async (playerId: number) => {
  const [player] = await sql<Player[]>`
  DELETE FROM
    players
  WHERE
    id = ${playerId}
  RETURNING
  *
  `;

  return player;
});
