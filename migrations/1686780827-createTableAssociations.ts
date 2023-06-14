import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE associations (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      player_id integer NOT NULL,
      organisation_id integer NOT NULL,
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
