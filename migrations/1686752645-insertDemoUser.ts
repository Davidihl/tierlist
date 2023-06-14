import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    INSERT INTO users
    (username, password_hash, is_admin, is_player, created, last_update)
    VALUES
    (
      'admin',
      'password',
      true,
      false,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )

  `;
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM users
  `;
}
