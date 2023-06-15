import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    INSERT INTO users
    (username, password_hash, is_admin)
    VALUES
    (
      'admin',
      'password',
      true
    )

  `;

  await sql`
    INSERT INTO users
    (username, password_hash, is_admin)
    VALUES
    (
      'austrianforce',
      'password',
      false
    )

    `;
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM users
  `;
}
