import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    ALTER TABLE players ADD COLUMN mainaccount_id integer REFERENCES league_accounts (id)
  `;
}

export async function down(sql: Sql) {
  await sql`
    ALTER TABLE players DROP COLUMN mainaccount_id
  `;
}
