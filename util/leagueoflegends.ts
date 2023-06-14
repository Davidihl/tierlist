import { RateLimiter } from 'limiter';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const summonerLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'second',
});

const leagueLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'second',
});

export async function callSummonerApi(summoner: string) {
  const remainingRequests = await summonerLimiter.removeTokens(1);

  if (remainingRequests === 0) {
    throw console.error('Too many requests on RIOT Summoner API');
  }

  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
  );

  const data = await response.json;
  return data;
}

export async function callLeagueApi(encryptedSummoner: string) {
  const remainingRequests = await leagueLimiter.removeTokens(1);

  if (remainingRequests === 0) {
    throw console.error('Too many requests on RIOT League API');
  }
}

export async function getLeagueofLegendsData(summoner: string) {
  const summonerData: any = await callSummonerApi(summoner);

  if (!summonerData) {
    throw new Error('Failed to fetch summoner data');
  }

  const leagueData: any = await callLeagueApi(summonerData.id);
  console.log(leagueData);
}
