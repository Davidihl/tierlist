import { cache } from 'react';
import { sql } from './connect';

export type Tier = {
  id: number;
  name: string | null;
};

export const getTierIdByRiotResponse = cache(async (riotResponse: string) => {
  const [tier] = await sql<Tier[]>`
    SELECT
      id,
      name
    FROM
      tiers
    WHERE
      name = ${riotResponse}
 `;
  return tier;
});
