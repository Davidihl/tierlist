import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE INDEX
      organisation_slug
    ON
      organisations(slug)
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP INDEX organisation_slug
  `;
}
