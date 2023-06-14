import { Sql } from 'postgres';

export type User = {
  id: number;
  name: string;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE players (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL,
      alias VARCHAR(30) NOT NULL,
      first_name VARCHAR (30),
      last_name VARCHAR (30),
      contact VARCHAR(100),
      slug VARCHAR(30),
      leagueoflegends_id integer[]
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE players
  `;
}
