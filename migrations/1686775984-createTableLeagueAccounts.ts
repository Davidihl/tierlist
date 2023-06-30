import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE league_accounts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      player_id integer NOT NULL REFERENCES players (id),
      summoner VARCHAR(30) UNIQUE NOT NULL,
      summoner_id VARCHAR(60) UNIQUE NOT NULL,
      tier integer REFERENCES tiers (id),
      rank VARCHAR(10),
      league_points integer,
      wins integer,
      losses integer,
      last_update timestamp NOT NULL DEFAULT NOW()

    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE league_accounts
  `;
}
