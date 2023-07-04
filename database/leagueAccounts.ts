import { cache } from 'react';
import { sql } from './connect';

export type LeagueAccount = {
  id: number;
  playerId: number;
  summoner: string;
  summonerId: string;
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
  summonerId: string;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  lastUpdate: Date;
};

export type RiotResponse = {
  summoner: string;
  summonerId: string;
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
  const leagueAccounts = await sql<LeagueAccountQuery[]>`
    SELECT
      league_accounts.id,
      player_id,
      summoner_id,
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
 `;
  return leagueAccounts;
});

export const getLeagueAccountsByPlayerId = cache(async (id: number) => {
  const leagueAccounts = await sql<LeagueAccountQuery[]>`
    SELECT
      league_accounts.id,
      player_id,
      summoner,
      summoner_id,
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

export const getLeagueAccountById = cache(async (id: number) => {
  const [leagueAccount] = await sql<LeagueAccountQuery[]>`
    SELECT
      league_accounts.id,
      player_id,
      summoner,
      summoner_id,
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
      league_accounts.id = ${id}
 `;
  return leagueAccount;
});

export const getLeagueAccountBySummonerId = cache(
  async (summonerId: string) => {
    const [leagueAccount] = await sql<LeagueAccountQuery[]>`
    SELECT
      league_accounts.id,
      player_id,
      summoner,
      summoner_id,
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
      summoner_id = ${summonerId}
 `;
    return leagueAccount;
  },
);

export const getAllLeagueAccountsByPlayerId = cache(async (id: number) => {
  const leagueAccounts = await sql<LeagueAccountQuery[]>`
    SELECT
      league_accounts.id,
      player_id,
      summoner,
      summoner_id,
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
    ORDER BY
      tiers.id ASC,
      league_accounts.rank ASC,
      league_accounts.league_points ASC
  `;
  return leagueAccounts;
});

export const addLeagueAccount = cache(
  async (account: RiotResponse, playerId: number) => {
    const [newAccount] = await sql<LeagueAccount[]>`
    INSERT INTO league_accounts
      (player_id, summoner, summoner_id, tier, rank, league_points, wins, losses)
    VALUES
      (${playerId},
      ${account.summoner},
      ${account.summonerId},
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

export const deleteLeagueAccount = cache(async (id: number) => {
  const [deletedAccount] = await sql<LeagueAccount[]>`
    DELETE FROM
      league_Accounts
    WHERE
      id = ${id}
    RETURNING
      *`;
  return deletedAccount;
});

export const deleteLeagueAccountsByPlayerId = cache(
  async (playerId: number) => {
    const [deletedAccount] = await sql<LeagueAccount[]>`
    DELETE FROM
      league_Accounts
    WHERE
      player_id = ${playerId}
    RETURNING
      *`;
    return deletedAccount;
  },
);

export const updateLeagueAccount = cache(
  async (account: RiotResponse, summonerId: string) => {
    const [updatedAccount] = await sql<LeagueAccount[]>`
    UPDATE
      league_accounts
    SET
      summoner = ${account.summoner},
      summoner_id = ${account.summonerId},
      tier = (SELECT id FROM tiers WHERE name = ${account.tier}),
      rank = ${account.rank},
      league_points = ${account.leaguePoints},
      wins = ${account.wins},
      losses = ${account.losses},
      last_update = NOW()
    WHERE summoner_id = ${summonerId}
    RETURNING *
  `;

    return updatedAccount;
  },
);
