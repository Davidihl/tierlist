import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE associations (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      player_id integer NOT NULL REFERENCES players (id),
      organisation_id integer NOT NULL REFERENCES organisations (id),
      start_date timestamp NOT NULL,
      end_date timestamp
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE associations
  `;
}