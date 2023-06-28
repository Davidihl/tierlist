import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    INSERT INTO associations
    (
      player_id,
      organisation_id,
      player_request,
      start_date
    )
    VALUES
    (
      1,
      1,
      false,
      CURRENT_TIMESTAMP
    )

  `;
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM associations
  `;
}
