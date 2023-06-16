import { RateLimiter } from 'limiter';
import { encodeString } from '../../util/encodeString';

// eventuell mit GraphQL REST dataSource neu schreiben????

export type LeagueofLegends = {
  summoner: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
};

// import { headers } from 'next/headers';
// const headersInstance = headers();
// const riotAuthorization = headersInstance.get('X-Riot-Token');

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

  // if ('status' in response) {
  //   throw console.error(status.message);
  // }

  const data = await response.json();
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
  const fetchResponse: LeagueofLegends = {
    summoner: soloQData.summonerName,
    tier: soloQData.tier,
    rank: soloQData.rank,
    leaguePoints: soloQData.leaguePoints,
    wins: soloQData.wins,
    losses: soloQData.losses,
  };

  return fetchResponse;
}
