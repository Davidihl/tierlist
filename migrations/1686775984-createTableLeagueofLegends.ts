import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE leagueoflegends (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      player_id integer NOT NULL,
      name VARCHAR(30) UNIQUE NOT NULL,
      rank integer NOT NULL,
      league_points integer,
      last_update timestamp NOT NULL DEFAULT NOW()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE leagueoflegends
  `;
}
