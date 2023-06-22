'use server';

import {
  getLeagueAccountById,
  getLeagueAccountBySummoner,
  RiotResponse,
} from '../../../database/leagueAccounts';
import { getLeagueofLegendsData } from '../../api/leagueoflegends';

export async function searchLeagueAccount(summoner: string) {
  const notAvailable = await getLeagueAccountBySummoner(summoner);

  if (notAvailable) {
    return { error: 'League of Legends account already assigned' };
  }

  const result: RiotResponse = await getLeagueofLegendsData(summoner);
  return result;
}
