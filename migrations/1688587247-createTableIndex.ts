import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE INDEX
      player_slug
    ON
      players(slug)
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP INDEX player_slug
  `;
}
