import { Sql } from 'postgres';

const demoUser = [
  {
    leagueId: 'db626ae4-7efb-4757-9e41-7c31ac584104',
    queueType: 'RANKED_SOLO_5x5',
    tier: 'PLATINUM',
    rank: 'IV',
    summonerId: 'uVHOFflKPR6Lnacign_sU_ifXEVUo3T00zSEl0jTRJWObOA',
    summonerName: 'Chaoslordi',
    leaguePoints: 1,
    wins: 50,
    losses: 47,
    veteran: false,
    inactive: false,
    freshBlood: false,
    hotStreak: true,
  },
  {
    leagueId: '1b4cf5af-a848-4f7f-99c4-b740c5367d11',
    queueType: 'RANKED_FLEX_SR',
    tier: 'PLATINUM',
    rank: 'I',
    summonerId: 'VnxbIU0zMaK81X80AzQfVp_nxiFV9KdBFurmo1amTj4bHm8',
    summonerName: 'Chaoslordi',
    leaguePoints: 75,
    wins: 49,
    losses: 33,
    veteran: false,
    inactive: false,
    freshBlood: false,
    hotStreak: false,
  },
];

export async function up(sql: Sql) {
  await sql`
    INSERT INTO league_accounts
    (
      player_id,
      summoner,
      summoner_id,
      tier,
      rank,
      league_points,
      wins,
      losses
    )
    VALUES
    (
      1,
      ${demoUser[0]!.summonerName},
      ${demoUser[0]!.summonerId},
      (SELECT id FROM tiers WHERE name = ${demoUser[0]!.tier}),
      ${demoUser[0]!.rank},
      ${demoUser[0]!.leaguePoints},
      ${demoUser[0]!.wins},
      ${demoUser[0]!.losses}
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
  UPDATE
    players
  SET
    mainaccount_id = NULL
  `;
  await sql`
      DELETE FROM league_accounts
  `;
}
