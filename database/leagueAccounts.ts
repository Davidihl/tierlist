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

export async function getAllLeagueAccounts() {
  const leagueAccounts = await sql<LeagueAccount[]>`
    SELECT
      *
    FROM
      league_accounts
 `;
  return leagueAccounts;
}

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
