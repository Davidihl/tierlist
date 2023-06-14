import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username varchar(30) NOT NULL,
      password_hash varchar(80) NOT NULL,
      is_admin boolean NOT NULL,
      is_player boolean NOT NULL,
      created timestamp NOT NULL,
      last_update timestamp NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE users
  `;
}
