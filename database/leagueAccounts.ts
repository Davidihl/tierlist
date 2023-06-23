import { cache } from 'react';
import { sql } from './connect';

export type LeagueAccount = {
  id: number;
  playerId: number;
  summoner: string;
  tier: number | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  lastUpdate: Date;
};

export type LeagueAccountQuery = {
  id: number;
  playerId: number;
  summoner: string;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  lastUpdate: Date;
};

export type RiotResponse = {
  summoner: string;
  tier: string;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
};

export type PlayerLeagueAccount = LeagueAccount & {
  isMainAccount: boolean;
  alias: string;
};

export const getAllLeagueAccounts = cache(async () => {
  const leagueAccounts = await sql<LeagueAccount[]>`
    SELECT
      *
    FROM
      league_accounts
 `;
  return leagueAccounts;
});

export const getLeagueAccountById = cache(async (id: number) => {
  const [leagueAccount] = await sql<LeagueAccount[]>`
    SELECT
      *
    FROM
      league_accounts
    WHERE
      id = ${id}
 `;
  return leagueAccount;
});

export const getLeagueAccountBySummoner = cache(async (summoner: string) => {
  const [leagueAccount] = await sql<LeagueAccount[]>`
    SELECT
      *
    FROM
      league_accounts
    WHERE
      summoner = ${summoner}
 `;
  return leagueAccount;
});

export const getAllLeagueAccountsByPlayerId = cache(async (id: number) => {
  const leagueAccounts = await sql<LeagueAccountQuery[]>`
    SELECT
      league_accounts.id,
      player_Id,
      summoner,
      tiers.name AS tier,
      rank,
      league_points,
      wins,
      losses,
      last_update
    FROM
      league_accounts
    INNER JOIN
      tiers
    ON
      league_accounts.tier= tiers.id
    WHERE
      player_id = ${id}
  `;
  return leagueAccounts;
});

export const addLeagueAccount = cache(
  async (account: RiotResponse, playerId: number) => {
    const [newAccount] = await sql<LeagueAccount[]>`
    INSERT INTO league_accounts
      (player_id, summoner, tier, rank, league_points, wins, losses)
    VALUES
      (${playerId},
      ${account.summoner},
      (SELECT id FROM tiers WHERE name = ${account.tier}),
      ${account.rank},
      ${account.leaguePoints},
      ${account.wins},
      ${account.losses})
    RETURNING
    *

  `;

    return newAccount;
  },
);
