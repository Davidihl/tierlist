import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE tiers (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name varchar(50)
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE tiers
  `;
}
