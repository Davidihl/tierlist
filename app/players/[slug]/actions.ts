'use server';

import { z } from 'zod';
import {
  getLeagueAccountById,
  getLeagueAccountBySummoner,
  RiotResponse,
} from '../../../database/leagueAccounts';
import { getLeagueofLegendsData } from '../../api/leagueoflegends';

export async function searchLeagueAccount(summoner: string) {
  const checkInput = z.string().nonempty();

  if (!checkInput.safeParse(summoner).success) {
    return { error: 'Summoner required' };
  }
  const notAvailable = await getLeagueAccountBySummoner(summoner);

  if (notAvailable) {
    return { error: 'League of Legends account already assigned' };
  }

  const result: RiotResponse = await getLeagueofLegendsData(summoner);
  return result;
}
