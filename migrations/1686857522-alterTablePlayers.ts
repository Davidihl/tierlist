import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    ALTER TABLE players ADD mainaccount_id integer REFERENCES leagueoflegends (id)
  `;
}

export async function down(sql: Sql) {
  await sql`
    ALTER TABLE players DROP mainaccount_id
  `;
}
