import { Sql } from 'postgres';

const tiers = [
  'Challenger',
  'Grandmaster',
  'Master',
  'Diamond',
  'Emerald',
  'Platin',
  'Gold',
  'Silver',
  'Bronze',
  'Iron',
];

export async function up(sql: Sql) {
  for (const tier of tiers) {
    await sql`
    INSERT INTO tiers
    (name)
    VALUES
    (
      ${tier}
    )

  `;
  }
}

export async function down(sql: Sql) {
  await sql`
      DELETE FROM users
  `;
}
