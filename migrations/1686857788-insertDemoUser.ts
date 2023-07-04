import bcrypt from 'bcrypt';
import { Sql } from 'postgres';

export async function up(sql: Sql) {
  const passwordhash1 = await bcrypt.hash('password', 10);
  const passwordhash2 = await bcrypt.hash('password', 10);

  await sql`
    INSERT INTO users
    (username, password_hash, is_admin)
    VALUES
    (
      'Chaoslordi',
      ${passwordhash1},
      true
    )

  `;

  await sql`
    INSERT INTO users
    (username, password_hash, is_admin)
    VALUES
    (
      'Austrian Force',
      ${passwordhash2},
      false
    )

    `;
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM users
  `;
}
