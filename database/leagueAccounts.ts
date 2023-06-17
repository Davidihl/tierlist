import { cache } from 'react';
import { sql } from './connect';

export type LeagueAccount = {
  summoner: string;
  tier: string | '';
  rank: string | '';
  leaguePoints: number | '';
  wins: number | '';
  losses: number | '';
};

export type PlayerLeagueAccount = LeagueAccount & {
  main: boolean;
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

export const getLeagueAccountsByPlayerId = cache(async (id: number) => {
  const leagueAccounts = await sql<PlayerLeagueAccount[]>`
    SELECT
      league_accounts.*,
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
