import { cache } from 'react';
import { sql } from './connect';

export type LeagueAccount = {
  name: string;
  tier: number | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
};

export type PlayerLeagueAccount = LeagueAccount & {
  isMainAccount: boolean;
};

export const getAllLeagueAccounts = cache(async () => {
  const leagueAccounts = await sql<LeagueAccount[]>`
    SELECT
      name,
      tier,
      rank,
      league_points,
      wins,
      losses
    FROM
      league_accounts
 `;
  return leagueAccounts;
});

export const getLeagueAccountById = cache(async (id: number) => {
  const [leagueAccount] = await sql<LeagueAccount[]>`
    SELECT
      name,
      tier,
      rank,
      league_points,
      wins,
      losses
    FROM
      league_accounts
    WHERE
      id = ${id}
 `;
  return leagueAccount;
});

export const getLeagueAccountsByPlayerId = cache(async (id: number) => {
  const leagueAccounts = await sql<PlayerLeagueAccount[]>`
    SELECT
      league_accounts.name,
      league_accounts.tier,
      league_accounts.rank,
      league_accounts.league_points,
      league_accounts.wins,
      league_accounts.losses,
      CASE WHEN players.mainaccount_id = league_accounts.id THEN TRUE ELSE FALSE END AS is_main_account
    FROM
      league_accounts
    INNER JOIN
      players ON players.mainaccount_id = league_accounts.id
    WHERE
      league_accounts.player_id = ${id}
  `;
  return leagueAccounts;
});
