import { GraphQLError } from 'graphql';
import { RateLimiter } from 'limiter';
import { RiotResponse } from '../../database/leagueAccounts';
import { encodeString } from '../../util/encodeString';

// Define API Authorization Header
const riotAuthorization = new Headers();
riotAuthorization.append('X-Riot-Token', process.env.RIOT_API_KEY || '');

// Provide limiters for each endpoint used
const summonerLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'second',
});

const leagueLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'second',
});

// Call Summoner Endpoint
export async function callSummonerApi(summoner: string) {
  const remainingRequests = await summonerLimiter.removeTokens(1);

  if (remainingRequests === 0) {
    throw console.error('Too many requests on RIOT Summoner API');
  }

  const encodedSummoner = encodeString(summoner);

  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodedSummoner}`,
    {
      method: 'GET',
      headers: riotAuthorization,
    },
  );

  const data = await response.json();

  if ('status' in data) {
    throw new GraphQLError(data.status.message, {
      extensions: { code: data.status_code },
    });
  }

  return data;
}

// Call League of Legends Endpoint
export async function callLeagueApi(encryptedSummoner: string) {
  const remainingRequests = await leagueLimiter.removeTokens(1);

  if (remainingRequests === 0) {
    throw console.error('Too many requests on RIOT League API');
  }

  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummoner}`,
    { method: 'GET', headers: riotAuthorization },
  );

  const data = await response.json();
  return data;
}

// Fetch Summoner data and use result to fetch League of Legends data
export async function getLeagueofLegendsData(summoner: string) {
  const summonerData: any = await callSummonerApi(summoner);

  if (!summonerData) {
    throw new Error('Failed to fetch summoner data');
  }

  const leagueData: any = await callLeagueApi(summonerData.id);
  const [soloQData] = leagueData.filter(
    (rank: any) => rank.queueType === 'RANKED_SOLO_5x5',
  );

  if (!soloQData) {
    const unranked: RiotResponse = {
      summoner,
      summonerId: summonerData.id,
      tier: 'UNRANKED',
      rank: '',
      leaguePoints: 0,
      wins: 0,
      losses: 0,
    };

    return unranked;
  }

  const riotResponse: RiotResponse = {
    summoner: soloQData.summonerName,
    summonerId: soloQData.summonerId,
    tier: soloQData.tier,
    rank: soloQData.rank,
    leaguePoints: soloQData?.leaguePoints,
    wins: soloQData.wins,
    losses: soloQData.losses,
  };

  return riotResponse;
}

// Fetch League of Legends Data with summonerId to update database
export async function updateLeagueofLegendsData(
  summoner: string,
  summonerId: string,
) {
  const leagueData: any = await callLeagueApi(summonerId);
  const [soloQData] = leagueData.filter(
    (rank: any) => rank.queueType === 'RANKED_SOLO_5x5',
  );

  if (!soloQData) {
    const unranked: RiotResponse = {
      summoner,
      summonerId,
      tier: 'UNRANKED',
      rank: '',
      leaguePoints: 0,
      wins: 0,
      losses: 0,
    };

    return unranked;
  }

  const riotResponse: RiotResponse = {
    summoner: soloQData.summonerName,
    summonerId: soloQData.summonerId,
    tier: soloQData.tier,
    rank: soloQData.rank,
    leaguePoints: soloQData?.leaguePoints,
    wins: soloQData.wins,
    losses: soloQData.losses,
  };

  return riotResponse;
}
