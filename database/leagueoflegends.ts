import { cache } from 'react';
import { sql } from './connect';

export type LeagueofLegends = {
  summoner: string;
  tier: string | '';
  rank: string | '';
  leaguePoints: number | '';
  wins: number | '';
  losses: number | '';
};

export async function getAllLeagueAccounts() {
  const leagueoflegends = await sql<LeagueofLegends[]>`
    SELECT
      *
    FROM
      leagueoflegends
 `;
  return leagueoflegends;
}
