import { Sql } from 'postgres';
import { encodeString } from '../util/encodeString';

export async function up(sql: Sql) {
  await sql`
    INSERT INTO organisations
    (
      alias,
      user_id,
      contact,
      slug
    )
    VALUES
    (
      'Austrian Force',
      2,
      'office@austrianforce.at',
      ${encodeString('Austrian Force').toLowerCase()}
    )

  `;
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM organisations
  `;
}
