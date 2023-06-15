import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    INSERT INTO organisations
    (
      name,
      user_id,
      contact,
      slug
    )
    VALUES
    (
      'Austrian Force',
      2,
      'office@austrianforce.at',
      'austrianforce'
    )

  `;
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM organisations
  `;
}
