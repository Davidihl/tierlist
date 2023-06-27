import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE organisations (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      alias VARCHAR(40) UNIQUE NOT NULL,
      user_id integer NOT NULL REFERENCES users (id),
      contact VARCHAR(50),
      slug VARCHAR(40) UNIQUE NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE organisations
  `;
}
