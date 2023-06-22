import { Sql } from 'postgres';

const tiers = [
  'CHALLENGER',
  'GRANDMASTER',
  'MASTER',
  'DIAMOND',
  'EMERALD',
  'PLATINUM',
  'GOLD',
  'SILVER',
  'BRONZE',
  'IRON',
  'UNRANKED',
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
