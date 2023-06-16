import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    UPDATE players
    SET mainaccount_id = 1
    WHERE id= 1
  `;
}

export async function down(sql: Sql) {
  await sql`
    UPDATE players
    SET mainaccount_id = NULL
    WHERE id= 1
  `;
}
