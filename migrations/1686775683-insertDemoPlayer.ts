import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    INSERT INTO players
    ( user_id,
      alias,
      first_name,
      last_name,
      contact,
      slug)
    VALUES
    (
      1,
      'Chaoslordi',
      'David',
      'Ihl',
      'daih1985@gmail.com',
      'chaoslordi'
    )

  `;
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM players
  `;
}
